import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QRScanner from '@/components/QRScanner';
import { findUserByQRCode, updateUser } from '@/lib/storage';
import { User } from '@/types';

export default function CheckIn() {
  const navigate = useNavigate();
  const [checkedInUser, setCheckedInUser] = useState<User | null>(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleScan = async (qrCode: string) => {
    setIsProcessing(true);
    setError('');

    try {
      const user = findUserByQRCode(qrCode);
      
      if (!user) {
        setError('Invalid QR code. Please make sure you are registered for this event.');
        setIsProcessing(false);
        return;
      }

      if (user.checkedIn) {
        setError(`${user.name} is already checked in.`);
        setIsProcessing(false);
        return;
      }

      // Update user as checked in
      updateUser(user.id, {
        checkedIn: true,
        checkedInAt: new Date().toISOString(),
      });

      setCheckedInUser({ ...user, checkedIn: true, checkedInAt: new Date().toISOString() });
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
    setCheckedInUser(null);
    setError('');
  };

  if (checkedInUser) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-center text-green-600">✓ Check-in Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold">{checkedInUser.name}</h3>
                <p className="text-gray-600">{checkedInUser.email}</p>
                <p className="text-gray-600">{checkedInUser.phone}</p>
              </div>
              <p className="text-sm text-gray-500">
                Checked in at: {new Date(checkedInUser.checkedInAt!).toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-2">
            <Button onClick={resetScanner} className="w-full">
              Scan Another QR Code
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center mb-2">Event Check-in</h1>
          <p className="text-gray-600 text-center">
            Scan your QR code to check in to the event
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <Alert className="mb-4">
            <AlertDescription>Processing check-in...</AlertDescription>
          </Alert>
        )}

        <QRScanner onScan={handleScan} onError={handleScanError} />

        <div className="mt-6 text-center">
          <Button onClick={() => navigate('/')} variant="ghost">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}