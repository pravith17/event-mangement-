import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Camera, Upload } from 'lucide-react';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');

  const startScanning = async () => {
    try {
      if (!videoRef.current) return;

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          onScan(result.data);
          stopScanning();
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
      setIsScanning(true);
      setError('');
    } catch (err) {
      const errorMessage = 'Failed to start camera. Please ensure camera permissions are granted.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const result = await QrScanner.scanImage(file);
      onScan(result);
      setError('');
    } catch (err) {
      const errorMessage = 'Could not read QR code from image. Please try a clearer image.';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center text-[#1a365d]">Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="camera" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Camera
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="camera" className="space-y-4">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-gray-100 rounded-lg object-cover"
                style={{ display: isScanning ? 'block' : 'none' }}
              />
              {!isScanning && (
                <div className="w-full h-64 bg-gradient-to-br from-[#e6f3ff] to-[#f0f8ff] rounded-lg flex items-center justify-center border-2 border-dashed border-[#4a90e2]">
                  <p className="text-[#1a365d] text-center">
                    <Camera className="w-8 h-8 mx-auto mb-2 text-[#4a90e2]" />
                    Camera preview will appear here
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              {!isScanning ? (
                <Button onClick={startScanning} className="w-full bg-[#4a90e2] hover:bg-[#357abd]">
                  Start Camera Scan
                </Button>
              ) : (
                <Button onClick={stopScanning} variant="outline" className="w-full border-[#4a90e2] text-[#4a90e2] hover:bg-[#e6f3ff]">
                  Stop Scanning
                </Button>
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qr-upload" className="text-[#1a365d]">Upload QR Code Image</Label>
              <div className="relative">
                <Input
                  id="qr-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full h-32 border-2 border-dashed border-[#4a90e2] hover:bg-[#e6f3ff] flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-8 h-8 text-[#4a90e2]" />
                  <span className="text-[#1a365d]">Choose QR Code Image</span>
                  <span className="text-sm text-gray-500">JPG, PNG, or other image formats</span>
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}