import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { findUserByEmail, saveUser, setCurrentUser, generateUniqueId } from '@/lib/storage';
import { AuthUser, User } from '@/types';
import ThemeToggle from './ThemeToggle';

interface LoginFormProps {
  onLogin: (user: AuthUser) => void;
}

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'organizer' | 'volunteer' | 'participant'>('participant');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      let user = findUserByEmail(email);

      if (isLogin) {
        if (!user) {
          setError('User not found. Please sign up first.');
          setLoading(false);
          return;
        }
      } else {
        if (!name.trim()) {
          setError('Name is required for signup');
          setLoading(false);
          return;
        }

        if (user) {
          setError('User already exists. Please login instead.');
          setLoading(false);
          return;
        }

        // Create new user
        const newUser: User = {
          id: generateUniqueId(),
          name: name.trim(),
          email: email.trim(),
          phone: '',
          role,
          eventIds: [],
          createdAt: new Date().toISOString(),
        };

        saveUser(newUser);
        user = newUser;
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      setCurrentUser(authUser);
      onLogin(authUser);
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Header */}
      <header className="max-w-md mx-auto pt-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a365d] dark:text-white tracking-tight">Pravi Managers</h1>
              <p className="text-xs text-[#4a90e2] font-medium">Event Solutions</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="max-w-md mx-auto">
        <Card className="border-0 shadow-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-[#1a365d] dark:text-white font-bold">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <p className="text-[#64748b] dark:text-gray-300 mt-2">
              {isLogin ? 'Sign in to access your events' : 'Join our event management platform'}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1a365d] dark:text-white font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={loading}
                    className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1a365d] dark:text-white font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-[#1a365d] dark:text-white font-medium">Role</Label>
                  <Select value={role} onValueChange={(value: 'organizer' | 'volunteer' | 'participant') => setRole(value)}>
                    <SelectTrigger className="border-[#e2e8f0] focus:border-[#4a90e2] focus:ring-[#4a90e2] rounded-xl py-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
                      <SelectItem value="participant">Participant</SelectItem>
                      <SelectItem value="volunteer">Volunteer</SelectItem>
                      <SelectItem value="organizer">Organizer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full bg-[#4a90e2] hover:bg-[#357abd] text-white font-semibold py-3 rounded-xl transition-all duration-300" 
                disabled={loading}
              >
                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button
                onClick={() => setIsLogin(!isLogin)}
                variant="ghost"
                className="text-[#4a90e2] hover:bg-[#e6f3ff] dark:text-blue-400 dark:hover:bg-gray-700"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}