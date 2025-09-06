import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUsers } from '@/lib/storage';
import { User } from '@/types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = () => {
      const allUsers = getUsers();
      setUsers(allUsers);
    };

    loadUsers();
    
    // Refresh data every 5 seconds to show real-time updates
    const interval = setInterval(loadUsers, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const registeredUsers = users;
  const checkedInUsers = users.filter(user => user.checkedIn);
  const notCheckedInUsers = users.filter(user => !user.checkedIn);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const UserCard = ({ user }: { user: User }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">{user.phone}</p>
            <p className="text-xs text-gray-500 mt-1">
              Registered: {formatDateTime(user.registeredAt)}
            </p>
            {user.checkedIn && user.checkedInAt && (
              <p className="text-xs text-green-600 mt-1">
                Checked in: {formatDateTime(user.checkedInAt)}
              </p>
            )}
          </div>
          <Badge variant={user.checkedIn ? "default" : "secondary"}>
            {user.checkedIn ? "Present" : "Registered"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center mb-2">Organizer Dashboard</h1>
          <div className="flex justify-center gap-4 text-sm text-gray-600">
            <span>Total Registered: <strong>{registeredUsers.length}</strong></span>
            <span>Present: <strong>{checkedInUsers.length}</strong></span>
            <span>Absent: <strong>{notCheckedInUsers.length}</strong></span>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Registered ({registeredUsers.length})</TabsTrigger>
            <TabsTrigger value="present">Present ({checkedInUsers.length})</TabsTrigger>
            <TabsTrigger value="absent">Absent ({notCheckedInUsers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Registered Users</CardTitle>
              </CardHeader>
              <CardContent>
                {registeredUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No users registered yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {registeredUsers.map(user => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="present" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Present Users</CardTitle>
              </CardHeader>
              <CardContent>
                {checkedInUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No users checked in yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {checkedInUsers.map(user => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="absent" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Absent Users</CardTitle>
              </CardHeader>
              <CardContent>
                {notCheckedInUsers.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    All registered users are present!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {notCheckedInUsers.map(user => (
                      <UserCard key={user.id} user={user} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/')} variant="outline">
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}