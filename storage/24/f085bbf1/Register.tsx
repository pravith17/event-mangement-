import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import { saveUser, generateUniqueId } from '@/lib/storage';
import { RegistrationData, User } from '@/types';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
  });
  const [registeredUser, setRegisteredUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('All fields are required');
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const userId = generateUniqueId();
      const qrCode = `event-checkin-${userId}`;
      
      const newUser: User = {
        id: userId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        qrCode,
        registeredAt: new Date().toISOString(),
        checkedIn: false,
      };

      saveUser(newUser);
      setRegisteredUser(newUser);
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registeredUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe] p-4">
        {/* Header */}
        <header className="max-w-md mx-auto pt-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="text-lg font-bold text-[#1a365d]">Pravi Managers</span>
          </div>
        </header>

        <div className="max-w-md mx-auto">
          <Card className="mb-6 border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-600 font-bold">Registration Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-[#1a365d] mb-2 text-lg">
                Welcome, <strong>{registeredUser.name}</strong>!
              </p>
              <p className="text-sm text-[#64748b] mb-4">
                Your registration is complete. Save this QR code or take a screenshot - you'll need it to check in at the event.
              </p>
            </CardContent>
          </Card>

          <QRCodeDisplay value={registeredUser.qrCode} />

          <div className="mt-8 space-y-3">
            <Button 
              onClick={() => navigate('/')} 
              className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-semibold py-3 rounded-xl"
            >
              Back to Home
            </Button>
            <Button 
              onClick={() => navigate('/checkin')} 
              variant="outline" 
              className="w-full border-[#4a90e2] text-[#4a90e2] hover:bg-[#e6f3ff] font-semibold py-3 rounded-xl"
            >
              Go to Check-in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe] p-4">
      {/* Header */}
      <header className="max-w-md mx-auto pt-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="text-lg font-bold text-[#1a365d]">Pravi Managers</span>
          </div>
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            size="sm"
            className="text-[#4a90e2] hover:bg-[#e6f3ff]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#1a365d] font-bold">Event Registration</CardTitle>
            <p className="text-[#64748b] mt-2">Join our event with quick registration</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[#1a365d] font-medium">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                  className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1a365d] font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                  className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-[#1a365d] font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                  className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-semibold py-3 rounded-xl transition-all duration-300" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Registering...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}