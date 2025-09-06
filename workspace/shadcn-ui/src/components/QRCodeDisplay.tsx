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
          dark: '#1a365d',
          light: '#FFFFFF',
        },
      }).catch(console.error);
    }
  }, [value, size]);

  return (
    <Card className="w-fit mx-auto border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl text-[#1a365d] font-bold">Your Check-in QR Code</CardTitle>
        <p className="text-sm text-[#64748b]">Show this code at the event entrance</p>
      </CardHeader>
      <CardContent className="flex justify-center pb-6">
        <div className="p-4 bg-white rounded-xl shadow-inner">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>
      </CardContent>
    </Card>
  );
}