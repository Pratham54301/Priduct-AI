import User from '../models/User.js';
import Prediction from '../models/Prediction.js';
import PremiumSubscription from '../models/PremiumSubscription.js';
import Settings from '../models/Settings.js';
import ApiUsageLog from '../models/ApiUsageLog.js';
import mongoose from 'mongoose';

const normalizeMembership = (membership) => {
  if (!membership) return 'free';
  const value = String(membership).toLowerCase();
  if (value === 'premium') return 'premium';
  if (value === 'lifetime') return 'lifetime';
  return 'free';
};

const toDayRange = (dateInput) => {
  const d = new Date(dateInput);
  if (Number.isNaN(d.getTime())) return null;
  const start = new Date(d);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
};

const getSystemSettings = async () =>
  Settings.findOneAndUpdate(
    { singleton: 'system' },
    { $setOnInsert: { singleton: 'system' } },
    { new: true, upsert: true }
  );

const estimateRevenueFromSub = (sub, pricing) => {
  if (typeof sub?.amountPaid === 'number' && sub.amountPaid > 0) return sub.amountPaid;
  if (sub?.plan === 'lifetime') return pricing?.lifetimePrice || 9999;
  return pricing?.premiumMonthlyPrice || 999;
};

export const getUsers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const q = (req.query.q || '').trim();
    const role = (req.query.role || '').trim().toLowerCase();
    const membership = (req.query.membership || '').trim().toLowerCase();

    const filter = {};
    if (q) {
      filter.$or = [
        { email: { $regex: q, $options: 'i' } },
        { name: { $regex: q, $options: 'i' } },
        { fullName: { $regex: q, $options: 'i' } },
      ];
    }
    if (role && ['user', 'admin'].includes(role)) filter.role = role;
    if (membership && ['free', 'premium', 'lifetime'].includes(membership)) filter.membership = membership;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: users.map((u) => ({
        id: u._id,
        fullName: u.fullName || u.name,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive !== false,
        membership: normalizeMembership(u.membership),
        createdAt: u.createdAt,
        isProfileComplete: !!u.isProfileComplete,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    const user = await User.findById(id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const predictions = await Prediction.find({ customer: id }).sort({ createdAt: -1 }).limit(100);
    const subscription = await PremiumSubscription.findOne({ user: id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName || user.name,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive !== false,
          membership: normalizeMembership(user.membership),
          isProfileComplete: !!user.isProfileComplete,
          createdAt: user.createdAt,
          savedStocks: user.savedStocks || [],
        },
        subscription,
        predictions,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user details' });
  }
};

export const getPredictionLogs = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const q = (req.query.q || '').trim();
    const date = (req.query.date || '').trim();
    const symbol = (req.query.symbol || '').trim().toUpperCase();
    const user = (req.query.user || '').trim().toLowerCase();

    const filter = {};
    if (date) {
      const range = toDayRange(date);
      if (range) {
        const { start, end } = range;
        filter.createdAt = { $gte: start, $lt: end };
      }
    }
    if (symbol) {
      filter.symbol = symbol;
    }

    let predictions = [];
    let total = 0;
    const baseQuery = Prediction.find(filter)
      .populate('customer', 'name fullName email membership role')
      .sort({ createdAt: -1 });

    if (q || user) {
      const all = await baseQuery;
      const lowered = q.toLowerCase();
      const filtered = all.filter((p) => {
        const symbolText = String(p.symbol || '').toLowerCase();
        const email = String(p.customer?.email || '').toLowerCase();
        const name = String(p.customer?.fullName || p.customer?.name || '').toLowerCase();
        const matchesQuery = !lowered || symbolText.includes(lowered) || email.includes(lowered) || name.includes(lowered);
        const matchesUser = !user || email.includes(user) || name.includes(user);
        return matchesQuery && matchesUser;
      });
      total = filtered.length;
      predictions = filtered.slice((page - 1) * limit, page * limit);
    } else {
      [predictions, total] = await Promise.all([
        baseQuery.skip((page - 1) * limit).limit(limit),
        Prediction.countDocuments(filter),
      ]);
    }

    return res.status(200).json({
      success: true,
      data: predictions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch prediction logs' });
  }
};

export const updateUserMembership = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    const { membership, expiresAt } = req.body;
    const normalizedMembership = normalizeMembership(membership);
    if (!['free', 'premium', 'lifetime'].includes(normalizedMembership)) {
      return res.status(400).json({ success: false, message: 'Invalid membership value' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.membership = normalizedMembership;
    await user.save();

    if (normalizedMembership !== 'free') {
      const parsedExpiry = expiresAt ? new Date(expiresAt) : null;
      await PremiumSubscription.create({
        user: user._id,
        plan: normalizedMembership === 'lifetime' ? 'lifetime' : 'premium',
        status: 'active',
        source: 'admin',
        startedAt: new Date(),
        endsAt: parsedExpiry && !Number.isNaN(parsedExpiry.getTime()) ? parsedExpiry : null,
        updatedBy: req.user,
      });
    } else {
      await PremiumSubscription.updateMany(
        { user: user._id, status: 'active' },
        { $set: { status: 'cancelled', endsAt: new Date(), updatedBy: req.user } }
      );
    }

    return res.status(200).json({
      success: true,
      message: `Membership updated to ${normalizedMembership}`,
      data: {
        id: user._id,
        membership: normalizedMembership,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update membership' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const { role, fullName, name, membership, isActive } = req.body || {};

    if (role !== undefined) {
      if (!['user', 'admin'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role value' });
      }
      // Prevent accidental removal of the last admin account.
      if (user.role === 'admin' && role === 'user') {
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
          return res.status(400).json({ success: false, message: 'Cannot demote the last admin user' });
        }
      }
      user.role = role;
    }

    if (membership !== undefined) {
      user.membership = normalizeMembership(membership);
    }
    if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
    }
    if (typeof fullName === 'string' && fullName.trim()) user.fullName = fullName.trim();
    if (typeof name === 'string' && name.trim()) user.name = name.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        id: user._id,
        role: user.role,
        isActive: user.isActive !== false,
        membership: normalizeMembership(user.membership),
        fullName: user.fullName || user.name,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }

    if (String(req.user) === String(id)) {
      return res.status(400).json({ success: false, message: 'Admin cannot delete their own account' });
    }

    const user = await User.findById(id).select('role');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the last admin user' });
      }
    }

    await Promise.all([
      User.findByIdAndDelete(id),
      Prediction.deleteMany({ customer: id }),
      PremiumSubscription.deleteMany({ user: id }),
    ]);

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
};

export const deletePrediction = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid prediction id' });
    }

    const deleted = await Prediction.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Prediction not found' });
    }
    return res.status(200).json({ success: true, message: 'Prediction deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete prediction' });
  }
};

export const getPremiumAnalytics = async (req, res) => {
  try {
    const settings = await getSystemSettings();
    const [totalUsers, freeUsers, premiumUsers, lifetimeUsers, activeSubscriptions, recentSubscriptions, premiumUserList] =
      await Promise.all([
        User.countDocuments({}),
        User.countDocuments({ membership: 'free' }),
        User.countDocuments({ membership: 'premium' }),
        User.countDocuments({ membership: 'lifetime' }),
        PremiumSubscription.countDocuments({ status: 'active' }),
        PremiumSubscription.find({})
          .populate('user', 'email fullName name membership')
          .sort({ createdAt: -1 })
          .limit(20),
        User.find({ membership: { $in: ['premium', 'lifetime'] } })
          .select('fullName name email membership isActive createdAt')
          .sort({ createdAt: -1 })
          .limit(100),
      ]);

    const totalEarnings = recentSubscriptions.reduce(
      (sum, sub) => sum + estimateRevenueFromSub(sub, settings?.paymentConfig),
      0
    );

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        freeUsers,
        premiumUsers,
        lifetimeUsers,
        activeSubscriptions,
        totalEarnings,
        paymentIntegration: {
          stripeEnabled: !!settings?.paymentConfig?.stripeEnabled,
          razorpayEnabled: !!settings?.paymentConfig?.razorpayEnabled,
          currency: settings?.paymentConfig?.currency || 'INR',
        },
        conversionRate: totalUsers ? Number((((premiumUsers + lifetimeUsers) / totalUsers) * 100).toFixed(2)) : 0,
        recentSubscriptions,
        premiumUsersList: premiumUserList.map((user) => ({
          id: user._id,
          fullName: user.fullName || user.name,
          email: user.email,
          membership: normalizeMembership(user.membership),
          isActive: user.isActive !== false,
          joinedAt: user.createdAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch premium analytics' });
  }
};

export const getDashboardAnalytics = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    const trendStart = new Date();
    trendStart.setDate(trendStart.getDate() - 6);
    trendStart.setHours(0, 0, 0, 0);

    const [totalUsers, totalPredictions, premiumUsers, activeUsersToday, predictionTrend, usersTrend] = await Promise.all([
      User.countDocuments({}),
      Prediction.countDocuments({}),
      User.countDocuments({ membership: { $in: ['premium', 'lifetime'] } }),
      Prediction.distinct('customer', { createdAt: { $gte: startOfToday } }),
      Prediction.aggregate([
        { $match: { createdAt: { $gte: trendStart } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: trendStart } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const trendMap = new Map();
    for (let i = 0; i < 7; i += 1) {
      const d = new Date(trendStart);
      d.setDate(trendStart.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      trendMap.set(key, { date: key, predictions: 0, users: 0 });
    }
    predictionTrend.forEach((row) => {
      if (trendMap.has(row._id)) trendMap.get(row._id).predictions = row.count;
    });
    usersTrend.forEach((row) => {
      if (trendMap.has(row._id)) trendMap.get(row._id).users = row.count;
    });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPredictions,
        activeUsersToday: activeUsersToday.filter(Boolean).length,
        premiumUsers,
        trends: Array.from(trendMap.values()),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch analytics' });
  }
};

export const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await PremiumSubscription.find({})
      .populate('user', 'fullName name email membership isActive')
      .sort({ createdAt: -1 })
      .limit(200);

    return res.status(200).json({
      success: true,
      data: subscriptions.map((sub) => ({
        id: sub._id,
        userId: sub.user?._id,
        userName: sub.user?.fullName || sub.user?.name || 'Unknown',
        userEmail: sub.user?.email || '',
        plan: sub.plan,
        status: sub.status,
        source: sub.source,
        startedAt: sub.startedAt,
        expiresAt: sub.endsAt,
        amountPaid: sub.amountPaid || 0,
        currency: sub.currency || 'INR',
      })),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch subscriptions' });
  }
};

export const upsertSubscription = async (req, res) => {
  try {
    const { userId, plan, expiresAt } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'Invalid user id' });
    }
    if (!['free', 'premium', 'lifetime'].includes(String(plan || '').toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const normalizedPlan = String(plan).toLowerCase();
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.membership = normalizedPlan;
    await user.save();

    if (normalizedPlan === 'free') {
      await PremiumSubscription.updateMany(
        { user: user._id, status: 'active' },
        { $set: { status: 'cancelled', endsAt: new Date(), updatedBy: req.user } }
      );
      return res.status(200).json({ success: true, message: 'Subscription downgraded to free' });
    }

    const parsedExpiry = expiresAt ? new Date(expiresAt) : null;
    const settings = await getSystemSettings();
    const amount =
      normalizedPlan === 'lifetime'
        ? settings?.paymentConfig?.lifetimePrice || 9999
        : settings?.paymentConfig?.premiumMonthlyPrice || 999;

    const sub = await PremiumSubscription.create({
      user: user._id,
      plan: normalizedPlan === 'lifetime' ? 'lifetime' : 'premium',
      status: 'active',
      source: 'admin',
      startedAt: new Date(),
      endsAt: parsedExpiry && !Number.isNaN(parsedExpiry.getTime()) ? parsedExpiry : null,
      amountPaid: amount,
      currency: settings?.paymentConfig?.currency || 'INR',
      paymentProvider: 'none',
      updatedBy: req.user,
    });

    return res.status(200).json({ success: true, message: 'Subscription updated', data: sub });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update subscription' });
  }
};

export const getSystemSettingsController = async (req, res) => {
  try {
    const settings = await getSystemSettings();
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch settings' });
  }
};

export const updateSystemSettings = async (req, res) => {
  try {
    const { featureToggles, aiPrompt, marketSentiment, paymentConfig } = req.body || {};

    const nextUpdate = {};
    if (featureToggles && typeof featureToggles === 'object') {
      if (typeof featureToggles.aiPredictionsEnabled === 'boolean') {
        nextUpdate['featureToggles.aiPredictionsEnabled'] = featureToggles.aiPredictionsEnabled;
      }
      if (typeof featureToggles.premiumSystemEnabled === 'boolean') {
        nextUpdate['featureToggles.premiumSystemEnabled'] = featureToggles.premiumSystemEnabled;
      }
      if (typeof featureToggles.emailAlertsEnabled === 'boolean') {
        nextUpdate['featureToggles.emailAlertsEnabled'] = featureToggles.emailAlertsEnabled;
      }
    }

    if (typeof aiPrompt === 'string') {
      nextUpdate.aiPrompt = aiPrompt.trim();
    }

    if (marketSentiment && typeof marketSentiment === 'object') {
      const mode = String(marketSentiment.mode || '').toLowerCase();
      const value = String(marketSentiment.value || '').toLowerCase();
      if (mode === 'auto' || mode === 'manual') {
        nextUpdate['marketSentiment.mode'] = mode;
      }
      if (['bullish', 'bearish', 'neutral'].includes(value)) {
        nextUpdate['marketSentiment.value'] = value;
      }
      if (typeof marketSentiment.note === 'string') {
        nextUpdate['marketSentiment.note'] = marketSentiment.note.trim();
      }
      nextUpdate['marketSentiment.updatedAt'] = new Date();
      nextUpdate['marketSentiment.updatedBy'] = req.user;
    }

    if (paymentConfig && typeof paymentConfig === 'object') {
      if (typeof paymentConfig.stripeEnabled === 'boolean') {
        nextUpdate['paymentConfig.stripeEnabled'] = paymentConfig.stripeEnabled;
      }
      if (typeof paymentConfig.razorpayEnabled === 'boolean') {
        nextUpdate['paymentConfig.razorpayEnabled'] = paymentConfig.razorpayEnabled;
      }
      if (typeof paymentConfig.currency === 'string' && paymentConfig.currency.trim()) {
        nextUpdate['paymentConfig.currency'] = paymentConfig.currency.trim().toUpperCase();
      }
      if (Number.isFinite(paymentConfig.premiumMonthlyPrice)) {
        nextUpdate['paymentConfig.premiumMonthlyPrice'] = Number(paymentConfig.premiumMonthlyPrice);
      }
      if (Number.isFinite(paymentConfig.lifetimePrice)) {
        nextUpdate['paymentConfig.lifetimePrice'] = Number(paymentConfig.lifetimePrice);
      }
    }

    const settings = await Settings.findOneAndUpdate(
      { singleton: 'system' },
      { $set: nextUpdate, $setOnInsert: { singleton: 'system' } },
      { new: true, upsert: true }
    );

    return res.status(200).json({ success: true, message: 'Settings updated', data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update settings' });
  }
};

export const getApiUsageMetrics = async (req, res) => {
  try {
    const settings = await getSystemSettings();
    const logs = await ApiUsageLog.find({ provider: 'gemini' }).sort({ createdAt: -1 }).limit(20);
    const errors = logs.filter((item) => item.status === 'error');

    return res.status(200).json({
      success: true,
      data: {
        counters: settings?.apiUsage || {
          totalPredictionRequests: 0,
          geminiRequestCount: 0,
          geminiErrorCount: 0,
        },
        recentLogs: logs,
        recentErrors: errors,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch API usage' });
  }
};
