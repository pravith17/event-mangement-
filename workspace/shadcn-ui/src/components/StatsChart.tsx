import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventStats } from '@/types';

interface StatsChartProps {
  stats: EventStats;
}

const COLORS = ['#4a90e2', '#10b981', '#f59e0b', '#ef4444'];

export default function StatsChart({ stats }: StatsChartProps) {
  const pieData = [
    { name: 'Checked In', value: stats.totalCheckedIn, color: '#10b981' },
    { name: 'Not Checked In', value: stats.totalRegistered - stats.totalCheckedIn, color: '#6b7280' },
  ];

  const hourlyData = Array.from({ length: 24 }, (_, i) => {
    const hour = `${i}:00`;
    const registrations = stats.registrationsByHour.find(r => r.hour === hour)?.count || 0;
    const checkins = stats.checkinsByHour.find(c => c.hour === hour)?.count || 0;
    return { hour, registrations, checkins };
  }).filter(d => d.registrations > 0 || d.checkins > 0);

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Pie Chart */}
      <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#1a365d] dark:text-white flex items-center gap-2">
            Attendance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {entry.name}: {entry.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bar Chart */}
      <Card className="border-0 shadow-xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-[#1a365d] dark:text-white flex items-center gap-2">
            Hourly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="hour" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="registrations" fill="#4a90e2" name="Registrations" radius={[2, 2, 0, 0]} />
                <Bar dataKey="checkins" fill="#10b981" name="Check-ins" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}