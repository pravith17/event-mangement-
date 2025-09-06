import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QRScanner from '@/components/QRScanner';
import { findRegistrationByQRCode, updateRegistration, getUsers, getEventById } from '@/lib/storage';
import { Registration } from '@/types';
import { ArrowLeft, CheckCircle, Clock, Shield } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

export default function CheckIn() {
  const navigate = useNavigate();
  const [checkedInRegistration, setCheckedInRegistration] = useState<Registration | null>(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async (qrCode: string) => {
    setIsProcessing(true);
    setError('');

    try {
      const registration = findRegistrationByQRCode(qrCode);
      
      if (!registration) {
        setError('Invalid QR code. Please make sure you are registered for this event.');
        setIsProcessing(false);
        return;
      }

      if (registration.qrUsed) {
        setError('This QR code has already been used. Each QR code can only be used once for security.');
        setIsProcessing(false);
        return;
      }

      if (registration.checkedIn) {
        setError('You are already checked in to this event.');
        setIsProcessing(false);
        return;
      }

      // Update registration as checked in and mark QR as used
      updateRegistration(registration.id, {
        checkedIn: true,
        checkedInAt: new Date().toISOString(),
        qrUsed: true,
      });

      setCheckedInRegistration({ 
        ...registration, 
        checkedIn: true, 
        checkedInAt: new Date().toISOString(),
        qrUsed: true
      });
    } catch (err) {
      setError('Failed to process check-in. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleScanError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const resetScanner = () => {
    setCheckedInRegistration(null);
    setError('');
  };

  if (checkedInRegistration) {
    const users = getUsers();
    const user = users.find(u => u.id === checkedInRegistration.userId);
    const event = getEventById(checkedInRegistration.eventId);

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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-600 dark:text-green-400 font-bold">✓ Check-in Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm rounded-xl p-6 border border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-[#1a365d] dark:text-white mb-2">{user?.name}</h3>
                <p className="text-[#64748b] dark:text-gray-300 mb-1">{user?.email}</p>
                <p className="text-[#64748b] dark:text-gray-300 mb-3">{user?.phone}</p>
                <p className="text-lg font-semibold text-[#4a90e2] dark:text-blue-400 mb-3">{event?.name}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                  <Clock className="w-4 h-4" />
                  <span>Checked in at: {new Date(checkedInRegistration.checkedInAt!).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <Shield className="w-3 h-3" />
                  <span>QR code secured - one-time use only</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 space-y-3">
            <Button 
              onClick={resetScanner} 
              className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-semibold py-3 rounded-xl"
            >
              Scan Another QR Code
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="outline" 
              className="w-full border-[#4a90e2] text-[#4a90e2] hover:bg-[#e6f3ff] dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20 font-semibold py-3 rounded-xl"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a365d] dark:text-white mb-2">Secure Check-in</h1>
          <p className="text-[#64748b] dark:text-gray-300 text-lg">
            Scan QR code or upload from gallery
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-sm text-[#4a90e2] dark:text-blue-400">
            <Shield className="w-4 h-4" />
            <span>One-time use security enabled</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <Alert className="mb-6 rounded-xl border-[#4a90e2] bg-[#e6f3ff] dark:bg-blue-900/20 dark:border-blue-400">
            <AlertDescription className="text-[#1a365d] dark:text-white">Processing secure check-in...</AlertDescription>
          </Alert>
        )}

        <QRScanner onScan={handleScan} onError={handleScanError} />
      </div>
    </div>
  );
}