
import { useState, useCallback } from 'react';
import type { TTimeline, TEvent } from '../types';

const initialTimelines: TTimeline[] = [
  {
    id: 'proj-1',
    name: 'Apollo Program',
    description: 'A chronological history of the NASA program that landed the first humans on the Moon.',
    events: [
      { id: 'ev-1-1', name: 'Apollo 1 Tragedy', date: '1967-01-27', description: 'A cabin fire during a launch rehearsal tragically killed all three crew members.', pictureUrl: 'https://picsum.photos/seed/apollo1/800/400', people: ['Gus Grissom', 'Ed White', 'Roger B. Chaffee'], tags: ['tragedy', 'nasa'] },
      { id: 'ev-1-2', name: 'Apollo 11 Moon Landing', date: '1969-07-20', description: 'Neil Armstrong and Buzz Aldrin become the first humans to walk on the Moon.', pictureUrl: 'https://picsum.photos/seed/apollo11/800/400', people: ['Neil Armstrong', 'Buzz Aldrin', 'Michael Collins'], tags: ['milestone', 'space', 'moon'] },
      { id: 'ev-1-3', name: 'Apollo 13 Crisis', date: '1970-04-13', description: 'An oxygen tank explosion onboard forced the crew to abort their Moon mission and return safely to Earth.', pictureUrl: 'https://picsum.photos/seed/apollo13/800/400', people: ['Jim Lovell', 'Jack Swigert', 'Fred Haise'], tags: ['crisis', 'engineering', 'nasa'] },
    ]
  },
  {
    id: 'proj-2',
    name: 'Personal University Journey',
    description: 'A timeline of key moments from my four years at university.',
    events: [
        { id: 'ev-2-1', name: 'First Day of Classes', date: '2019-09-02', description: 'Moved into the dorms and attended my first lecture, "Introduction to Computer Science".', pictureUrl: 'https://picsum.photos/seed/uniday1/800/400', people: ['Me', 'Dr. Smith'], tags: ['milestone', 'academics'] },
        { id: 'ev-2-2', name: 'Joined the Coding Club', date: '2019-10-15', description: 'Met a great group of people and started working on our first collaborative project.', pictureUrl: 'https://picsum.photos/seed/uniclub/800/400', people: ['Me', 'Jane Doe', 'John Smith'], tags: ['social', 'club', 'coding'] },
        { id: 'ev-2-3', name: 'Final Year Project Defense', date: '2023-04-25', description: 'Successfully defended my thesis project on machine learning applications.', pictureUrl: 'https://picsum.photos/seed/unidefense/800/400', people: ['Me', 'Thesis Advisor'], tags: ['academics', 'milestone', 'graduation'] },
    ]
  },
];

export const useTimelines = () => {
  const [timelines, setTimelines] = useState<TTimeline[]>(initialTimelines);

  const createTimeline = useCallback(() => {
    const newId = `proj-${Date.now()}`;
    const newTimeline: TTimeline = {
      id: newId,
      name: 'New Timeline',
      description: 'A brief description of your new timeline.',
      events: []
    };
    setTimelines(prev => [...prev, newTimeline]);
    return newId;
  }, []);

  const deleteTimeline = useCallback((timelineId: string) => {
    setTimelines(prev => prev.filter(t => t.id !== timelineId));
  }, []);

  const updateTimeline = useCallback((timelineId: string, updates: Partial<Omit<TTimeline, 'id' | 'events'>>) => {
    setTimelines(prev => prev.map(t => t.id === timelineId ? { ...t, ...updates } : t));
  }, []);

  const addEvent = useCallback((timelineId: string) => {
    setTimelines(prev => prev.map(t => {
      if (t.id === timelineId) {
        const newEvent: TEvent = {
          id: `ev-${t.id}-${Date.now()}`,
          name: 'New Event',
          date: new Date().toISOString().split('T')[0],
          description: '',
          pictureUrl: `https://picsum.photos/seed/${Date.now()}/800/400`,
          people: [],
          tags: [],
        };
        return { ...t, events: [...t.events, newEvent] };
      }
      return t;
    }));
  }, []);

  const updateEvent = useCallback((timelineId: string, eventId: string, updates: Partial<TEvent>) => {
    setTimelines(prev => prev.map(t => {
      if (t.id === timelineId) {
        return {
          ...t,
          events: t.events.map(e => e.id === eventId ? { ...e, ...updates } : e)
        };
      }
      return t;
    }));
  }, []);

  const deleteEvent = useCallback((timelineId: string, eventId: string) => {
    setTimelines(prev => prev.map(t => {
      if (t.id === timelineId) {
        return { ...t, events: t.events.filter(e => e.id !== eventId) };
      }
      return t;
    }));
  }, []);

  return { timelines, createTimeline, deleteTimeline, updateTimeline, addEvent, updateEvent, deleteEvent };
};
