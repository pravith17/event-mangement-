import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import QRScanner from '@/components/QRScanner';
import { findUserByQRCode, updateUser } from '@/lib/storage';
import { User } from '@/types';
import { ArrowLeft, CheckCircle, Clock } from 'lucide-react';

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
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-600 font-bold">✓ Check-in Successful!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-[#1a365d] mb-2">{checkedInUser.name}</h3>
                <p className="text-[#64748b] mb-1">{checkedInUser.email}</p>
                <p className="text-[#64748b] mb-4">{checkedInUser.phone}</p>
                <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                  <Clock className="w-4 h-4" />
                  <span>Checked in at: {new Date(checkedInUser.checkedInAt!).toLocaleString()}</span>
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
              className="w-full border-[#4a90e2] text-[#4a90e2] hover:bg-[#e6f3ff] font-semibold py-3 rounded-xl"
            >
              Back to Home
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
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1a365d] mb-2">Event Check-in</h1>
          <p className="text-[#64748b] text-lg">
            Scan your QR code or upload from gallery to check in
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 rounded-xl">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isProcessing && (
          <Alert className="mb-6 rounded-xl border-[#4a90e2] bg-[#e6f3ff]">
            <AlertDescription className="text-[#1a365d]">Processing check-in...</AlertDescription>
          </Alert>
        )}

        <QRScanner onScan={handleScan} onError={handleScanError} />
      </div>
    </div>
  );
}