import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { getEvents, getEventsByOrganizer, saveEvent, generateUniqueId, getCurrentUser } from '@/lib/storage';
import { Event } from '@/types';

interface EventSelectorProps {
  selectedEventId: string | null;
  onEventSelect: (eventId: string) => void;
  showCreateButton?: boolean;
}

export default function EventSelector({ selectedEventId, onEventSelect, showCreateButton = false }: EventSelectorProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    let availableEvents: Event[] = [];
    if (currentUser.role === 'organizer') {
      availableEvents = getEventsByOrganizer(currentUser.id);
    } else {
      availableEvents = getEvents().filter(e => e.isActive);
    }
    
    setEvents(availableEvents);
  };

  const handleCreateEvent = () => {
    const currentUser = getCurrentUser();
    if (!currentUser || !newEvent.name.trim()) return;

    const event: Event = {
      id: generateUniqueId(),
      name: newEvent.name.trim(),
      description: newEvent.description.trim(),
      date: newEvent.date,
      location: newEvent.location.trim(),
      organizerId: currentUser.id,
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    saveEvent(event);
    setEvents([...events, event]);
    onEventSelect(event.id);
    setIsCreateOpen(false);
    setNewEvent({ name: '', description: '', date: '', location: '' });
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={selectedEventId || ''} onValueChange={onEventSelect}>
        <SelectTrigger className="min-w-[200px] dark:bg-gray-700 dark:border-gray-600">
          <SelectValue placeholder="Select an event" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:border-gray-600">
          {events.map(event => (
            <SelectItem key={event.id} value={event.id}>
              {event.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showCreateButton && (
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-[#4a90e2] hover:bg-[#357abd]">
              <Plus className="w-4 h-4 mr-1" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent className="dark:bg-gray-800 dark:border-gray-600">
            <DialogHeader>
              <DialogTitle className="dark:text-white">Create New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="event-name" className="dark:text-white">Event Name</Label>
                <Input
                  id="event-name"
                  value={newEvent.name}
                  onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                  placeholder="Enter event name"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="event-description" className="dark:text-white">Description</Label>
                <Textarea
                  id="event-description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Enter event description"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="event-date" className="dark:text-white">Date</Label>
                <Input
                  id="event-date"
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="event-location" className="dark:text-white">Location</Label>
                <Input
                  id="event-location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Enter event location"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <Button onClick={handleCreateEvent} className="w-full bg-[#4a90e2] hover:bg-[#357abd]">
                Create Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}