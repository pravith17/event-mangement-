import { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QRScannerProps {
  onScan: (result: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
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

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Scan QR Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-gray-100 rounded-lg object-cover"
            style={{ display: isScanning ? 'block' : 'none' }}
          />
          {!isScanning && (
            <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Camera preview will appear here</p>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-2 justify-center">
          {!isScanning ? (
            <Button onClick={startScanning} className="w-full">
              Start Scanning
            </Button>
          ) : (
            <Button onClick={stopScanning} variant="outline" className="w-full">
              Stop Scanning
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}