'use client';

import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Users, Video } from 'lucide-react';
import { useERPStore } from '@/lib/store/StoreContext';
import { useAuth } from '@/lib/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CalendarEvent } from '@/lib/types';

export default function CalendarPage() {
  const { state, addCalendarEvent, logAudit } = useERPStore();
  const { currentUser, can } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    title: '',
    type: 'Meeting' as CalendarEvent['type'],
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '11:00 AM',
    location: 'Conference Room 1 / Zoom',
    participants: 'Alexander Vance, Elena Rostova',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) return;

    addCalendarEvent({
      title: form.title,
      type: form.type,
      date: form.date,
      startTime: form.startTime,
      endTime: form.endTime,
      location: form.location,
      participants: form.participants.split(',').map((p) => p.trim()),
    });

    logAudit('Scheduled Calendar Event', 'calendar', `Event added: ${form.title} on ${form.date}`, currentUser.name, currentUser.id);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" /> Enterprise Calendar & Meetings
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized company schedules, meeting agendas, employee leaves, holidays, and milestones.
          </p>
        </div>

        {can('calendar', 'create') && (
          <Button onClick={() => setIsModalOpen(true)} icon={<Plus className="w-4 h-4" />}>
            Schedule Event
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {state.calendarEvents.map((ev) => {
          const typeColors: Record<string, any> = {
            Meeting: 'indigo',
            Holiday: 'success',
            Leave: 'warning',
            Milestone: 'purple',
            Interview: 'sky',
          };

          return (
            <div
              key={ev.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant={typeColors[ev.type]}>{ev.type}</Badge>
                <span className="text-xs font-semibold text-slate-500">{ev.date}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{ev.title}</h3>

              <div className="space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {ev.startTime} – {ev.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ev.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{ev.participants.join(', ')}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Company Event"
        description="Book a conference room or sync session."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Event Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Q4 Executive Budget Review"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Event Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as any })}
              options={[
                { label: 'Meeting', value: 'Meeting' },
                { label: 'Milestone', value: 'Milestone' },
                { label: 'Interview', value: 'Interview' },
                { label: 'Holiday', value: 'Holiday' },
              ]}
            />
            <Input
              label="Date"
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
            <Input
              label="End Time"
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            />
          </div>
          <Input
            label="Location / Video Link"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Room 2 / Zoom URL"
          />
          <Input
            label="Participants (Comma separated)"
            value={form.participants}
            onChange={(e) => setForm({ ...form, participants: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Schedule
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
