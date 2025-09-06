import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Users, UserCheck, UserX, RefreshCw, Download, BarChart3 } from 'lucide-react';
import { getRegistrationsByEvent, getUsers, getEventStats, exportToCSV, getCurrentUser, getEvents, getEventsByOrganizer } from '@/lib/storage';
import { Registration, Event, EventStats } from '@/types';
import EventSelector from '@/components/EventSelector';
import StatsChart from '@/components/StatsChart';
import ThemeToggle from '@/components/ThemeToggle';

export default function Dashboard() {
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [stats, setStats] = useState<EventStats | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);

  useEffect(() => {
    loadAvailableEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      loadEventData();
    }
  }, [selectedEventId]);

  const loadAvailableEvents = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    let events: Event[] = [];
    if (currentUser.role === 'organizer') {
      events = getEventsByOrganizer(currentUser.id);
    } else {
      events = getEvents().filter(e => e.isActive);
    }
    
    setAvailableEvents(events);
    
    // Auto-select first event if none selected
    if (events.length > 0 && !selectedEventId) {
      setSelectedEventId(events[0].id);
    }
  };

  const loadEventData = () => {
    if (!selectedEventId) return;
    
    setIsRefreshing(true);
    const eventRegistrations = getRegistrationsByEvent(selectedEventId);
    const eventStats = getEventStats(selectedEventId);
    
    setRegistrations(eventRegistrations);
    setStats(eventStats);
    
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleExportCSV = () => {
    if (!selectedEventId) return;
    
    const csvContent = exportToCSV(selectedEventId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const selectedEvent = availableEvents.find(e => e.id === selectedEventId);
    const filename = `${selectedEvent?.name || 'event'}_attendance_${new Date().toISOString().split('T')[0]}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const users = getUsers();
  const checkedInRegistrations = registrations.filter(r => r.checkedIn);
  const notCheckedInRegistrations = registrations.filter(r => !r.checkedIn);
  const selectedEvent = availableEvents.find(e => e.id === selectedEventId);

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const RegistrationCard = ({ registration }: { registration: Registration }) => {
    const user = users.find(u => u.id === registration.userId);
    
    return (
      <Card className="mb-3 border-0 shadow-md hover:shadow-lg transition-shadow duration-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-[#1a365d] dark:text-white text-lg">{user?.name || 'Unknown'}</h3>
              <p className="text-sm text-[#64748b] dark:text-gray-300 mb-1">{user?.email || 'Unknown'}</p>
              <p className="text-sm text-[#64748b] dark:text-gray-300 mb-2">{user?.phone || 'Unknown'}</p>
              <p className="text-xs text-[#94a3b8] dark:text-gray-400 flex items-center gap-1">
                <span>Registered: {formatDateTime(registration.registeredAt)}</span>
              </p>
              {registration.checkedIn && registration.checkedInAt && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <UserCheck className="w-3 h-3" />
                  <span>Checked in: {formatDateTime(registration.checkedInAt)}</span>
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge 
                variant={registration.checkedIn ? "default" : "secondary"}
                className={registration.checkedIn 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200"
                }
              >
                {registration.checkedIn ? "Present" : "Registered"}
              </Badge>
              {registration.qrUsed && (
                <Badge variant="outline" className="text-xs border-purple-300 text-purple-600 dark:border-purple-400 dark:text-purple-400">
                  QR Used
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e6f3ff] to-[#dbeafe] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      {/* Header */}
      <header className="max-w-7xl mx-auto pt-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#4a90e2] to-[#357abd] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">PM</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1a365d] dark:text-white tracking-tight">Pravi Managers</h1>
              <p className="text-xs text-[#4a90e2] font-medium">Analytics Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button 
              onClick={loadEventData}
              variant="outline"
              size="sm"
              className="border-[#4a90e2] text-[#4a90e2] hover:bg-[#e6f3ff] dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-900/20"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
              size="sm"
              className="text-[#4a90e2] hover:bg-[#e6f3ff] dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Event Selection */}
        <Card className="mb-8 border-0 shadow-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-[#1a365d] dark:text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Multi-Event Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <EventSelector 
                  selectedEventId={selectedEventId}
                  onEventSelect={setSelectedEventId}
                  showCreateButton={getCurrentUser()?.role === 'organizer'}
                />
              </div>
              {selectedEventId && (
                <Button 
                  onClick={handleExportCSV}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-xl"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
            
            {selectedEvent && (
              <div className="mt-4 p-4 bg-[#e6f3ff] dark:bg-gray-700 rounded-xl">
                <h3 className="font-semibold text-[#1a365d] dark:text-white mb-2">{selectedEvent.name}</h3>
                <p className="text-sm text-[#64748b] dark:text-gray-300">{selectedEvent.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedEventId && stats ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
                <CardContent className="p-6 text-center">
                  <Users className="w-8 h-8 text-[#4a90e2] mx-auto mb-2" />
                  <div className="text-3xl font-bold text-[#1a365d] dark:text-white mb-1">{stats.totalRegistered}</div>
                  <div className="text-sm text-[#64748b] dark:text-gray-300 font-medium">Total Registered</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20">
                <CardContent className="p-6 text-center">
                  <UserCheck className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-[#1a365d] dark:text-white mb-1">{stats.totalCheckedIn}</div>
                  <div className="text-sm text-[#64748b] dark:text-gray-300 font-medium">Present</div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/20">
                <CardContent className="p-6 text-center">
                  <UserX className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-[#1a365d] dark:text-white mb-1">{stats.totalRegistered - stats.totalCheckedIn}</div>
                  <div className="text-sm text-[#64748b] dark:text-gray-300 font-medium">Absent</div>
                </CardContent>
              </Card>
            </div>

            {/* Real-time Charts */}
            <div className="mb-8">
              <StatsChart stats={stats} />
            </div>

            {/* Detailed Tabs */}
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-1">
                <TabsTrigger 
                  value="all" 
                  className="rounded-lg data-[state=active]:bg-[#4a90e2] data-[state=active]:text-white font-medium"
                >
                  All Registered ({registrations.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="present"
                  className="rounded-lg data-[state=active]:bg-green-500 data-[state=active]:text-white font-medium"
                >
                  Present ({checkedInRegistrations.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="absent"
                  className="rounded-lg data-[state=active]:bg-gray-500 data-[state=active]:text-white font-medium"
                >
                  Absent ({notCheckedInRegistrations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-8">
                <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#1a365d] dark:text-white flex items-center gap-2">
                      <Users className="w-6 h-6" />
                      All Registered Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {registrations.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-[#64748b] dark:text-gray-300 text-lg">No users registered yet.</p>
                        <p className="text-sm text-[#94a3b8] dark:text-gray-400 mt-2">Users will appear here once they register for the event.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {registrations.map(registration => (
                          <RegistrationCard key={registration.id} registration={registration} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="present" className="mt-8">
                <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#1a365d] dark:text-white flex items-center gap-2">
                      <UserCheck className="w-6 h-6 text-green-500" />
                      Present Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {checkedInRegistrations.length === 0 ? (
                      <div className="text-center py-12">
                        <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-[#64748b] dark:text-gray-300 text-lg">No users checked in yet.</p>
                        <p className="text-sm text-[#94a3b8] dark:text-gray-400 mt-2">Users will appear here once they check in to the event.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {checkedInRegistrations.map(registration => (
                          <RegistrationCard key={registration.id} registration={registration} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="absent" className="mt-8">
                <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl text-[#1a365d] dark:text-white flex items-center gap-2">
                      <UserX className="w-6 h-6 text-gray-500" />
                      Absent Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {notCheckedInRegistrations.length === 0 ? (
                      <div className="text-center py-12">
                        <UserCheck className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <p className="text-green-600 dark:text-green-400 text-lg font-semibold">Perfect Attendance!</p>
                        <p className="text-sm text-[#64748b] dark:text-gray-300 mt-2">All registered users are present at the event.</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {notCheckedInRegistrations.map(registration => (
                          <RegistrationCard key={registration.id} registration={registration} />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-[#64748b] dark:text-gray-300 text-lg">
                {availableEvents.length === 0 
                  ? "No events available. Create an event to get started." 
                  : "Select an event to view analytics and manage attendees."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}