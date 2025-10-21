
import React, { useState, useMemo } from 'react';
import type { TTimeline } from '../types';
import { EventView } from './EventView';
import { ChevronLeftIcon, EditIcon, CheckIcon, PlusIcon, TrashIcon } from './icons';

interface TimelineScreenProps {
  timeline: TTimeline;
  onBack: () => void;
  onUpdateTimeline: (updates: Partial<Omit<TTimeline, 'id' | 'events'>>) => void;
  onDeleteTimeline: () => void;
  onAddEvent: () => void;
  onUpdateEvent: (eventId: string, updates: Partial<TTimeline['events'][0]>) => void;
  onDeleteEvent: (eventId: string) => void;
}

const TimelineItem: React.FC<{ children: React.ReactNode; isLeft: boolean }> = ({ children, isLeft }) => (
    <div className={`flex justify-start items-start w-full my-4 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="w-1/2 px-4">{children}</div>
        <div className="w-0 flex-shrink-0 relative h-full flex justify-center">
            <div className="absolute top-0 w-px h-full bg-slate-700"></div>
            <div className="absolute top-1/2 -mt-2 w-4 h-4 rounded-full bg-slate-800 border-2 border-indigo-500 z-10"></div>
        </div>
        <div className="w-1/2"></div>
    </div>
);


export const TimelineScreen: React.FC<TimelineScreenProps> = ({ timeline, onBack, onUpdateTimeline, onDeleteTimeline, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [filterPerson, setFilterPerson] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const { uniquePeople, uniqueTags } = useMemo(() => {
    const people = new Set<string>();
    const tags = new Set<string>();
    timeline.events.forEach(event => {
      event.people.forEach(p => people.add(p));
      event.tags.forEach(t => tags.add(t));
    });
    return { uniquePeople: Array.from(people), uniqueTags: Array.from(tags) };
  }, [timeline.events]);

  const filteredAndSortedEvents = useMemo(() => {
    return timeline.events
      .filter(event => {
        const personMatch = filterPerson ? event.people.includes(filterPerson) : true;
        const tagMatch = filterTag ? event.tags.includes(filterTag) : true;
        return personMatch && tagMatch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timeline.events, filterPerson, filterTag]);
  
  const handleDeleteTimeline = () => {
    if (window.confirm(`Are you sure you want to delete the timeline "${timeline.name}"? This action cannot be undone.`)) {
        onDeleteTimeline();
    }
  };


  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <header className="sticky top-0 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 p-4 z-20">
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
                <ChevronLeftIcon className="w-5 h-5"/>
                <span>Home</span>
            </button>
            <h1 className="text-xl font-bold truncate text-center mx-4">{timeline.name}</h1>
            <button onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                {isEditing ? <CheckIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
            </button>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
            <select value={filterPerson} onChange={e => setFilterPerson(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none">
                <option value="">Filter by Person...</option>
                {uniquePeople.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none">
                <option value="">Filter by Tag...</option>
                {uniqueTags.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
        </div>
        {isEditing && (
            <div className="flex gap-2 mt-4">
                <button onClick={onAddEvent} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                    <PlusIcon className="w-5 h-5"/> Add Event
                </button>
                <button onClick={handleDeleteTimeline} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
                    <TrashIcon className="w-5 h-5"/> Delete Timeline
                </button>
            </div>
        )}
      </header>

      <main className="flex-grow overflow-y-auto p-4 relative">
        <div className="absolute top-0 left-1/2 w-0.5 h-full bg-slate-700 -ml-px"></div>
        {filteredAndSortedEvents.length === 0 ? (
            <div className="text-center text-slate-400 mt-20">
                <p>No events to display.</p>
                {isEditing ? <p>Click "Add Event" to get started.</p> : <p>Try clearing filters or adding events in edit mode.</p>}
            </div>
        ) : (
             <div className="relative">
                {filteredAndSortedEvents.map((event, index) => (
                    <div key={event.id} className={`flex items-start my-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                        <div className="w-1/2 px-4">
                           <EventView 
                                event={event} 
                                isEditing={isEditing}
                                onUpdate={(updates) => onUpdateEvent(event.id, updates)}
                                onDelete={() => onDeleteEvent(event.id)}
                                timelineAccent="text-indigo-400"
                            />
                        </div>
                        <div className="w-0 relative flex-shrink-0 flex justify-center items-center h-full">
                            <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-indigo-500 z-10"></div>
                        </div>
                        <div className="w-1/2"></div>
                    </div>
                ))}
            </div>
        )}
      </main>
    </div>
  );
};
