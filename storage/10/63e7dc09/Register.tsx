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
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-center text-green-600">Registration Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Welcome, <strong>{registeredUser.name}</strong>!
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Save this QR code or take a screenshot. You'll need it to check in at the event.
              </p>
            </CardContent>
          </Card>

          <QRCodeDisplay value={registeredUser.qrCode} />

          <div className="mt-6 space-y-2">
            <Button onClick={() => navigate('/')} className="w-full">
              Back to Home
            </Button>
            <Button onClick={() => navigate('/checkin')} variant="outline" className="w-full">
              Go to Check-in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Event Registration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button onClick={() => navigate('/')} variant="ghost">
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}