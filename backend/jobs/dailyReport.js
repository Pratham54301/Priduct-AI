const cron = require('node-cron');
const transporter = require('../utils/email');
const User = require('../models/User');
const Prediction = require('../models/Prediction');

async function sendDailyReports() {
  const users = await User.find();
  for (const user of users) {
    const predictions = await Prediction.find({ user: user._id, createdAt: { $gte: new Date(Date.now() - 24*60*60*1000) } });
    if (predictions.length === 0) continue;
    const summary = predictions.map(p => `Ticker: ${p.ticker}, Result: ${JSON.stringify(p.result)}`).join('\n');
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Daily Product.AI Prediction Summary',
      text: `Hello ${user.name},\n\nHere is your prediction summary for the last 24 hours:\n\n${summary}`
    });
  }
}

cron.schedule('0 8 * * *', sendDailyReports); // Runs every day at 8 AM

module.exports = sendDailyReports; 