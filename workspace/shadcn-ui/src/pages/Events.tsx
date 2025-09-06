import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Calendar, MapPin, Users, Mail, CheckCircle } from 'lucide-react';
import { saveRegistration, generateUniqueId, getCurrentUser, sendQRCodeEmail, findUserByEmail, saveUser, getEventById } from '@/lib/storage';
import { RegistrationData, Registration, User } from '@/types';
import EventSelector from '@/components/EventSelector';
import QRCodeDisplay from '@/components/QRCodeDisplay';
import ThemeToggle from '@/components/ThemeToggle';

export default function Events() {
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
    eventId: '',
  });
  const [registeredUser, setRegisteredUser] = useState<Registration | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (selectedEventId) {
      setFormData(prev => ({ ...prev, eventId: selectedEventId }));
    }
  }, [selectedEventId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    setEmailSent(false);

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.eventId) {
      setError('All fields are required and an event must be selected');
      setIsSubmitting(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    try {
      const currentUser = getCurrentUser();
      let userId = currentUser?.id;

      // Create or find user
      const existingUser = findUserByEmail(formData.email);
      if (!existingUser) {
        const newUser: User = {
          id: generateUniqueId(),
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          role: 'participant',
          eventIds: [formData.eventId],
          createdAt: new Date().toISOString(),
        };
        saveUser(newUser);
        userId = newUser.id;
      } else {
        // Update existing user
        if (!existingUser.eventIds.includes(formData.eventId)) {
          existingUser.eventIds.push(formData.eventId);
          saveUser(existingUser);
        }
        userId = existingUser.id;
      }

      const registrationId = generateUniqueId();
      const qrCode = `event-${formData.eventId}-user-${userId}-reg-${registrationId}`;
      
      const newRegistration: Registration = {
        id: registrationId,
        userId: userId!,
        eventId: formData.eventId,
        qrCode,
        registeredAt: new Date().toISOString(),
        checkedIn: false,
        qrUsed: false,
      };

      saveRegistration(newRegistration);
      setRegisteredUser(newRegistration);

      // Send email with QR code
      const event = getEventById(formData.eventId);
      if (event) {
        try {
          const emailSuccess = await sendQRCodeEmail(formData.email, qrCode, event.name);
          setEmailSent(emailSuccess);
        } catch (emailError) {
          console.error('Email sending failed:', emailError);
        }
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedEvent = selectedEventId ? getEventById(selectedEventId) : null;

  if (registeredUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        {/* Header */}
        <header className="max-w-md mx-auto pt-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="text-lg font-bold text-[#1a365d] dark:text-white">Pravi Managers</span>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="max-w-md mx-auto">
          <Card className="mb-6 border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400 font-bold">Registration Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-[#1a365d] dark:text-white mb-2 text-lg">
                Welcome to <strong>{selectedEvent?.name}</strong>!
              </p>
              <p className="text-sm text-[#64748b] dark:text-gray-300 mb-4">
                Your registration is complete. {emailSent ? 'We\'ve sent your QR code to your email.' : 'Save this QR code for check-in.'}
              </p>
              {emailSent && (
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-4">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">QR code sent to {formData.email}</span>
                </div>
              )}
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
              className="w-full border-[#4a90e2] text-[#4a90e2] hover:bg-[#e6f3ff] dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 font-semibold py-3 rounded-xl"
            >
              Go to Check-in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Header */}
      <header className="max-w-2xl mx-auto pt-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PM</span>
            </div>
            <span className="text-lg font-bold text-[#1a365d] dark:text-white">Pravi Managers</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              size="sm"
              className="text-[#4a90e2] hover:bg-[#e6f3ff] dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a365d] dark:text-white mb-2">Event Registration</h1>
          <p className="text-[#64748b] dark:text-gray-300 text-lg">
            Select an event and register to receive your QR code
          </p>
        </div>

        {/* Event Selection */}
        <Card className="mb-6 border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-[#1a365d] dark:text-white">Select Event</CardTitle>
          </CardHeader>
          <CardContent>
            <EventSelector 
              selectedEventId={selectedEventId}
              onEventSelect={setSelectedEventId}
              showCreateButton={getCurrentUser()?.role === 'organizer'}
            />
            
            {selectedEvent && (
              <div className="mt-4 p-4 bg-[#e6f3ff] dark:bg-gray-700 rounded-xl">
                <h3 className="font-semibold text-[#1a365d] dark:text-white mb-2">{selectedEvent.name}</h3>
                <p className="text-sm text-[#64748b] dark:text-gray-300 mb-3">{selectedEvent.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-[#4a90e2] dark:text-blue-400">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(selectedEvent.date).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#4a90e2] dark:text-blue-400">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registration Form */}
        {selectedEventId && (
          <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#1a365d] dark:text-white font-bold">Registration Details</CardTitle>
              <p className="text-[#64748b] dark:text-gray-300 mt-2">Fill in your information to complete registration</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1a365d] dark:text-white font-medium">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    disabled={isSubmitting}
                    className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1a365d] dark:text-white font-medium">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    disabled={isSubmitting}
                    className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[#1a365d] dark:text-white font-medium">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    disabled={isSubmitting}
                    className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
        )}
      </div>
    </div>
  );
}