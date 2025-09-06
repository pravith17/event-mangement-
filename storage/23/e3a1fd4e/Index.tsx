import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Users, UserPlus, BarChart3, CheckCircle, Clock, Shield } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-[#e2e8f0] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a365d] tracking-tight">Pravi Managers</h1>
              <p className="text-xs text-[#4a90e2] font-medium">Event Solutions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4a90e2]/5 to-[#357abd]/5"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-[#4a90e2]/20 mb-8">
            <Shield className="w-4 h-4 text-[#4a90e2] mr-2" />
            <span className="text-sm font-medium text-[#1a365d]">Professional Event Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-[#1a365d] mb-6 leading-tight">
            Smart Event
            <span className="block bg-gradient-to-r from-[#4a90e2] to-[#357abd] bg-clip-text text-transparent">
              Check-In System
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#64748b] mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Streamline your event registration and attendance tracking with our cutting-edge QR code technology. 
            <span className="block mt-2 font-medium text-[#4a90e2]">Fast. Secure. Professional.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-[#1a365d]">Instant Registration</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-[#1a365d]">Real-time Tracking</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-[#1a365d]">Secure & Reliable</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Action Cards */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Register Card */}
            <Card 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-[#f8fafc] hover:scale-105"
              onClick={() => navigate('/register')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a90e2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a365d] mb-4">Register</h3>
                <p className="text-[#64748b] mb-6 leading-relaxed">
                  Quick and secure event registration with instant QR code generation for seamless check-in experience.
                </p>
                <Button className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  Start Registration
                </Button>
              </CardContent>
            </Card>

            {/* Check-in Card */}
            <Card 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-[#f0fdf4] hover:scale-105"
              onClick={() => navigate('/checkin')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a365d] mb-4">Check-In</h3>
                <p className="text-[#64748b] mb-6 leading-relaxed">
                  Scan QR codes using camera or upload from gallery for instant attendance marking and verification.
                </p>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  Scan QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Dashboard Card */}
            <Card 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-[#fefbff] hover:scale-105"
              onClick={() => navigate('/dashboard')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a365d] mb-4">Dashboard</h3>
                <p className="text-[#64748b] mb-6 leading-relaxed">
                  Comprehensive real-time analytics and attendee management with detailed insights and reports.
                </p>
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a365d] mb-4">Why Choose Our System?</h2>
            <p className="text-[#64748b] text-lg max-w-2xl mx-auto">
              Built for modern events with enterprise-grade security and user-friendly design
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-2">Easy Registration</h3>
              <p className="text-[#64748b]">Streamlined form with validation and instant QR generation</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-2">Flexible Scanning</h3>
              <p className="text-[#64748b]">Camera scan or image upload with advanced QR recognition</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] mb-2">Live Analytics</h3>
              <p className="text-[#64748b]">Real-time attendance tracking with comprehensive reports</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a365d] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PM</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Pravi Managers</h3>
                <p className="text-sm text-blue-200">Professional Event Solutions</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-blue-200 mb-2">© 2024 Pravi Managers. All rights reserved.</p>
              <p className="text-sm text-blue-300">Powered by advanced QR technology</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}