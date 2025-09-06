import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Users, UserPlus, BarChart3, CheckCircle, Clock, Shield, LogOut } from 'lucide-react';
import { getCurrentUser, setCurrentUser } from '@/lib/storage';
import { useEffect, useState } from 'react';
import { AuthUser } from '@/types';
import ThemeToggle from '@/components/ThemeToggle';

export default function Index() {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    window.location.reload();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'organizer': return 'text-purple-600 dark:text-purple-400';
      case 'volunteer': return 'text-green-600 dark:text-green-400';
      default: return 'text-blue-600 dark:text-blue-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-[#e2e8f0] dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a365d] dark:text-white tracking-tight">Pravi Managers</h1>
              <p className="text-xs text-[#4a90e2] font-medium">Event Solutions</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#1a365d] dark:text-white">{user.name}</p>
                  <p className={`text-xs font-medium capitalize ${getRoleColor(user.role)}`}>{user.role}</p>
                </div>
                <Button onClick={handleLogout} variant="ghost" size="sm" className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#4a90e2]/5 to-[#357abd]/5 dark:from-blue-900/20 dark:to-purple-900/20"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full border border-[#4a90e2]/20 dark:border-gray-600 mb-8">
            <Shield className="w-4 h-4 text-[#4a90e2] mr-2" />
            <span className="text-sm font-medium text-[#1a365d] dark:text-white">Enterprise Event Management</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-[#1a365d] dark:text-white mb-6 leading-tight">
            Advanced Event
            <span className="block bg-gradient-to-r from-[#4a90e2] to-[#357abd] bg-clip-text text-transparent">
              Management System
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-[#64748b] dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
            Multi-event support, real-time analytics, role-based access, and secure QR technology. 
            <span className="block mt-2 font-medium text-[#4a90e2]">Professional. Scalable. Secure.</span>
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium text-[#1a365d] dark:text-white">Multi-Event Support</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full">
              <Clock className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-[#1a365d] dark:text-white">Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-full">
              <Shield className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-[#1a365d] dark:text-white">Role-based Security</span>
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
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-[#f8fafc] dark:from-gray-800 dark:to-gray-900 hover:scale-105"
              onClick={() => navigate('/events')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a90e2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a365d] dark:text-white mb-4">Events & Registration</h3>
                <p className="text-[#64748b] dark:text-gray-300 mb-6 leading-relaxed">
                  Manage multiple events, handle registrations with instant QR generation and email delivery.
                </p>
                <Button className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  Manage Events
                </Button>
              </CardContent>
            </Card>

            {/* Check-in Card */}
            <Card 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-[#f0fdf4] dark:from-gray-800 dark:to-green-900/20 hover:scale-105"
              onClick={() => navigate('/checkin')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <QrCode className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a365d] dark:text-white mb-4">Secure Check-In</h3>
                <p className="text-[#64748b] dark:text-gray-300 mb-6 leading-relaxed">
                  Advanced QR scanning with camera or file upload. One-time use security for maximum protection.
                </p>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 group-hover:shadow-lg">
                  Scan QR Code
                </Button>
              </CardContent>
            </Card>

            {/* Dashboard Card */}
            <Card 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer bg-gradient-to-br from-white to-[#fefbff] dark:from-gray-800 dark:to-purple-900/20 hover:scale-105"
              onClick={() => navigate('/dashboard')}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-[#1a365d] dark:text-white mb-4">Analytics Dashboard</h3>
                <p className="text-[#64748b] dark:text-gray-300 mb-6 leading-relaxed">
                  Real-time charts, multi-event analytics, CSV exports, and comprehensive attendance reports.
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
      <section className="py-16 px-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1a365d] dark:text-white mb-4">Enterprise Features</h2>
            <p className="text-[#64748b] dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Advanced capabilities designed for professional event management
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] dark:text-white mb-2">Multi-Event Management</h3>
              <p className="text-[#64748b] dark:text-gray-300">Organize multiple events with separate dashboards and analytics</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] dark:text-white mb-2">Role-Based Security</h3>
              <p className="text-[#64748b] dark:text-gray-300">Organizer, volunteer, and participant roles with appropriate access</p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a365d] dark:text-white mb-2">Advanced Analytics</h3>
              <p className="text-[#64748b] dark:text-gray-300">Real-time charts, hourly breakdowns, and CSV export capabilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a365d] dark:bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">PM</span>
              </div>
              <div>
                <h3 className="text-lg font-bold">Pravi Managers</h3>
                <p className="text-sm text-blue-200">Enterprise Event Solutions</p>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-blue-200 mb-2">© 2024 Pravi Managers. All rights reserved.</p>
              <p className="text-sm text-blue-300">Advanced QR technology with enterprise security</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}