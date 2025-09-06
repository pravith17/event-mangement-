import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUsers } from '@/lib/storage';
import { User } from '@/types';
import { ArrowLeft, Users, UserCheck, UserX, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadUsers = () => {
    setIsRefreshing(true);
    const allUsers = getUsers();
    setUsers(allUsers);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => {
    loadUsers();
    
    // Refresh data every 10 seconds to show real-time updates
    const interval = setInterval(loadUsers, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const registeredUsers = users;
  const checkedInUsers = users.filter(user => user.checkedIn);
  const notCheckedInUsers = users.filter(user => !user.checkedIn);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card className="mb-3 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white/80 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold text-[#1a365d] text-lg">{user.name}</h3>
            <p className="text-sm text-[#64748b] mb-1">{user.email}</p>
            <p className="text-sm text-[#64748b] mb-2">{user.phone}</p>
            <p className="text-xs text-[#94a3b8] flex items-center gap-1">
              <span>Registered: {formatDateTime(user.registeredAt)}</span>
            </p>
            {user.checkedIn && user.checkedInAt && (
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <UserCheck className="w-3 h-3" />
                <span>Checked in: {formatDateTime(user.checkedInAt)}</span>
              </p>
            )}
          </div>
          <Badge 
            variant={user.checkedIn ? "default" : "secondary"}
            className={user.checkedIn 
              ? "bg-green-500 hover:bg-green-600 text-white" 
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          >
            {user.checkedIn ? "Present" : "Registered"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe] p-4">
      {/* Header */}
      <header className="max-w-6xl mx-auto pt-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a365d] tracking-tight">Pravi Managers</h1>
              <p className="text-xs text-[#4a90e2] font-medium">Event Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={loadUsers}
              variant="outline"
              size="sm"
              className="border-[#4a90e2] text-[#4a90e2] hover:bg-[#e6f3ff]"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
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
        </div>
      </header>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#1a365d] mb-4">Event Analytics</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-[#4a90e2] mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#1a365d] mb-1">{registeredUsers.length}</div>
                <div className="text-sm text-[#64748b] font-medium">Total Registered</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50">
              <CardContent className="p-6 text-center">
                <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#1a365d] mb-1">{checkedInUsers.length}</div>
                <div className="text-sm text-[#64748b] font-medium">Present</div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6 text-center">
                <UserX className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-[#1a365d] mb-1">{notCheckedInUsers.length}</div>
                <div className="text-sm text-[#64748b] font-medium">Absent</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/60 backdrop-blur-sm rounded-xl p-1">
            <TabsTrigger 
              value="all" 
              className="rounded-lg data-[state=active]:bg-[#4a90e2] data-[state=active]:text-white font-medium"
            >
              All Registered ({registeredUsers.length})
            </TabsTrigger>
            <TabsTrigger 
              value="present"
              className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium"
            >
              Present ({checkedInUsers.length})
            </TabsTrigger>
            <TabsTrigger 
              value="absent"
              className="rounded-lg data-[state=active]:bg-gray-500 data-[state=active]:text-white font-medium"
            >
              Absent ({notCheckedInUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a365d] flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  All Registered Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {registeredUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-[#64748b] text-lg">No users registered yet.</p>
                    <p className="text-sm text-[#94a3b8] mt-2">Users will appear here once they register for the event.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {registeredUsers.map(user => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="present" className="mt-8">
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a365d] flex items-center gap-2">
                  <UserCheck className="w-6 h-6 text-green-500" />
                  Present Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {checkedInUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-[#64748b] text-lg">No users checked in yet.</p>
                    <p className="text-sm text-[#94a3b8] mt-2">Users will appear here once they check in to the event.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {checkedInUsers.map(user => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="absent" className="mt-8">
            <Card className="border-0 shadow-xl bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-[#1a365d] flex items-center gap-2">
                  <UserX className="w-6 h-6 text-gray-500" />
                  Absent Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                {notCheckedInUsers.length === 0 ? (
                  <div className="text-center py-12">
                    <UserCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
                    <p className="text-green-600 text-lg font-semibold">Perfect Attendance!</p>
                    <p className="text-sm text-[#64748b] mt-2">All registered users are present at the event.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notCheckedInUsers.map(user => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}