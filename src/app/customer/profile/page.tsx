'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Edit, Save, X, Upload, Eye, Trash2, Star, TrendingUp, Bell, Shield, CreditCard } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChangePasswordForm } from '@/components/customer/ChangePasswordForm';

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  avatar: string;
  membership: string;
  isProfileComplete: boolean;
  savedStocks: Array<{ symbol: string; name: string; addedAt: string }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
  }>;
  loginHistory: Array<{
    timestamp: string;
    ipAddress: string;
    userAgent: string;
    location: string;
  }>;
}

interface Prediction {
  id: string;
  ticker: string;
  date: string;
  prediction: string;
  accuracy: number;
  result: string;
  price: number;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: string;
  validUntil: string;
  isRecommended: boolean;
}

export default function CustomerProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    gender: '',
    dateOfBirth: '',
    avatar: ''
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPredictions();
      fetchOffers();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/customer/profile', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setFormData({
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          gender: data.gender || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
          avatar: data.avatar || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/customer/predictions', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setPredictions(data);
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch('/api/customer/offers', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setOffers(data);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Name is required",
        variant: "destructive"
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch('/api/customer/update-profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setProfile(prev => prev ? { ...prev, ...result.user } : null);
        toast({
          title: "Success",
          description: "Profile updated successfully"
        });
        setIsEditing(false);
        fetchProfile();
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        gender: profile.gender || '',
        dateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : '',
        avatar: profile.avatar || ''
      });
    }
    setIsEditing(false);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/customer/notifications/${notificationId}/read`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (response.ok) {
        fetchProfile();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/customer/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        fetchProfile();
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user || !profile) {
    return null;
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPredictionColor = (prediction: string) => {
    return prediction === 'Bullish' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar || '/default-avatar.jpg'} alt={profile.name} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
                <p className="text-muted-foreground">{profile.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={profile.membership === 'Free' ? 'secondary' : 'default'}>
                    {profile.membership} Plan
                  </Badge>
                  <Badge variant={profile.isProfileComplete ? 'default' : 'destructive'}>
                    {profile.isProfileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile Info</TabsTrigger>
              <TabsTrigger value="predictions">Predictions</TabsTrigger>
              <TabsTrigger value="offers">Offers</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Profile Info Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm" disabled={isUpdating}>
                        <Save className="w-4 h-4 mr-2" />
                        {isUpdating ? 'Saving...' : 'Save'}
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      {isEditing ? (
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-md">
                          {profile.name || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="p-3 bg-muted rounded-md text-muted-foreground">
                        {profile.email}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Enter your phone number"
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-md">
                          {profile.phone || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      {isEditing ? (
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                            <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-muted rounded-md">
                          {profile.gender || 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      {isEditing ? (
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-md">
                          {profile.dateOfBirth ? formatDate(profile.dateOfBirth) : 'Not provided'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      {isEditing ? (
                        <Textarea
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Enter your address"
                          rows={3}
                        />
                      ) : (
                        <div className="p-3 bg-muted rounded-md">
                          {profile.address || 'Not provided'}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="space-y-2">
                      <Label htmlFor="avatar">Avatar URL</Label>
                      <Input
                        id="avatar"
                        value={formData.avatar}
                        onChange={(e) => handleInputChange('avatar', e.target.value)}
                        placeholder="Enter avatar image URL"
                      />
                      <Button variant="outline" size="sm" className="w-full">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Predictions Tab */}
            <TabsContent value="predictions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recent Predictions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {predictions.length > 0 ? (
                    <div className="space-y-4">
                      {predictions.map((prediction) => (
                        <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-2xl font-bold">{prediction.ticker}</div>
                            <div>
                              <div className="font-medium">{prediction.prediction}</div>
                              <div className="text-sm text-muted-foreground">
                                {formatDate(prediction.date)} • Accuracy: {prediction.accuracy}%
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${getPredictionColor(prediction.prediction)}`}>
                              ${prediction.price}
                            </div>
                            <div className="text-sm text-muted-foreground">{prediction.result}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No predictions yet. Start making predictions to see your history here.
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Saved Stocks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.savedStocks.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {profile.savedStocks.map((stock) => (
                        <div key={stock.symbol} className="p-4 border rounded-lg">
                          <div className="font-bold">{stock.symbol}</div>
                          <div className="text-sm text-muted-foreground">{stock.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Added {formatDate(stock.addedAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No saved stocks yet. Save stocks to your watchlist to see them here.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Offers Tab */}
            <TabsContent value="offers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Personalized Offers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {offers.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {offers.map((offer) => (
                        <div key={offer.id} className={`p-6 border rounded-lg ${offer.isRecommended ? 'border-primary bg-primary/5' : ''}`}>
                          {offer.isRecommended && (
                            <Badge className="mb-2">Recommended</Badge>
                          )}
                          <h3 className="text-lg font-semibold mb-2">{offer.title}</h3>
                          <p className="text-muted-foreground mb-4">{offer.description}</p>
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl font-bold">${offer.price}</span>
                            <span className="text-sm text-muted-foreground line-through">${offer.originalPrice}</span>
                            <Badge variant="secondary">{offer.discount} OFF</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground mb-4">
                            Valid until {formatDate(offer.validUntil)}
                          </div>
                          <Button className="w-full">Get Started</Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No offers available at the moment.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {profile.notifications.length > 0 ? (
                    <div className="space-y-4">
                      {profile.notifications.map((notification) => (
                        <div key={notification.id} className={`p-4 border rounded-lg ${!notification.isRead ? 'bg-primary/5 border-primary/20' : ''}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{notification.title}</h4>
                                {!notification.isRead && (
                                  <Badge variant="secondary">New</Badge>
                                )}
                              </div>
                              <p className="text-muted-foreground mb-2">{notification.message}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span>{formatDate(notification.createdAt)}</span>
                                <Badge variant="outline">{notification.type}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {!notification.isRead && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => markNotificationAsRead(notification.id)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No notifications yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-4">Change Password</h4>
                    <ChangePasswordForm />
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Recent Login Activity</h4>
                    <div className="space-y-3">
                      {profile.loginHistory.map((login, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">{formatDate(login.timestamp)}</div>
                            <div className="text-sm text-muted-foreground">
                              {login.ipAddress} • {login.location}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(login.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
