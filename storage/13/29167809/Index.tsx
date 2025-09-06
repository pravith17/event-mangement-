import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Users, UserPlus, BarChart3 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Event Check-in System
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple and efficient event registration and check-in management. 
            Register attendees, generate QR codes, and track attendance in real-time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/register')}>
            <CardHeader className="text-center">
              <UserPlus className="w-12 h-12 mx-auto text-blue-600 mb-2" />
              <CardTitle>Register</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Register for the event and get your unique QR code
              </p>
              <Button className="w-full">
                Register Now
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/checkin')}>
            <CardHeader className="text-center">
              <QrCode className="w-12 h-12 mx-auto text-green-600 mb-2" />
              <CardTitle>Check-in</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                Scan your QR code to check in to the event
              </p>
              <Button className="w-full" variant="outline">
                Scan QR Code
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer md:col-span-2 lg:col-span-1" onClick={() => navigate('/dashboard')}>
            <CardHeader className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto text-purple-600 mb-2" />
              <CardTitle>Dashboard</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">
                View registered users and attendance statistics
              </p>
              <Button className="w-full" variant="outline">
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/50 border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <Users className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-semibold mb-1">Easy Registration</h3>
                <p className="text-sm text-gray-600">Quick form with name, email, and phone</p>
              </div>
              <div>
                <QrCode className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <h3 className="font-semibold mb-1">QR Code Generation</h3>
                <p className="text-sm text-gray-600">Unique QR codes for each attendee</p>
              </div>
              <div>
                <BarChart3 className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <h3 className="font-semibold mb-1">Real-time Tracking</h3>
                <p className="text-sm text-gray-600">Live attendance monitoring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}