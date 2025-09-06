import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export default function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }).catch(console.error);
    }
  }, [value, size]);

  return (
    <Card className="w-fit mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Your Check-in QR Code</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <canvas ref={canvasRef} className="border rounded-lg" />
      </CardContent>
    </Card>
  );
}