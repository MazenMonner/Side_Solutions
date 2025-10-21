
import React, { useState, useEffect } from 'react';
import type { TEvent } from '../types';
import { TrashIcon } from './icons';

interface EventViewProps {
  event: TEvent;
  isEditing: boolean;
  onUpdate: (updates: Partial<TEvent>) => void;
  onDelete: () => void;
  timelineAccent: string;
}

export const EventView: React.FC<EventViewProps> = ({ event, isEditing, onUpdate, onDelete, timelineAccent }) => {
  const [formData, setFormData] = useState(event);

  useEffect(() => {
    setFormData(event);
  }, [event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleArrayChange = (field: 'tags' | 'people', value: string) => {
    const newArray = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({...prev, [field]: newArray }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'tags' || name === 'people') {
      const newArray = value.split(',').map(item => item.trim()).filter(Boolean);
      onUpdate({ [name]: newArray });
    } else {
        onUpdate({ [name]: value });
    }
  };

  const inputClasses = "w-full bg-slate-700 text-slate-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500";
  const labelClasses = "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1";

  if (isEditing) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 w-full shadow-lg relative flex flex-col gap-4">
        <button onClick={onDelete} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors">
          <TrashIcon className="w-5 h-5" />
        </button>
        <div>
          <label className={labelClasses}>Event Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} onBlur={handleBlur} className={`${inputClasses} text-lg font-bold`} />
        </div>
        <div>
            <label className={labelClasses}>Event Picture URL</label>
            <input type="text" name="pictureUrl" value={formData.pictureUrl} onChange={handleInputChange} onBlur={handleBlur} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} onBlur={handleBlur} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} onBlur={handleBlur} className={`${inputClasses} min-h-[80px]`} />
        </div>
        <div>
          <label className={labelClasses}>People (comma-separated)</label>
          <input type="text" name="people" value={formData.people.join(', ')} onChange={(e) => handleArrayChange('people', e.target.value)} onBlur={handleBlur} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Tags (comma-separated)</label>
          <input type="text" name="tags" value={formData.tags.join(', ')} onChange={(e) => handleArrayChange('tags', e.target.value)} onBlur={handleBlur} className={inputClasses} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden w-full shadow-lg group">
      <img src={event.pictureUrl} alt={event.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <p className={`text-sm font-semibold ${timelineAccent}`}>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
        <h3 className="text-xl font-bold text-white mt-1">{event.name}</h3>
        <p className="text-slate-300 mt-2 text-sm">{event.description}</p>
        
        <div className="mt-4 flex flex-col gap-2 text-xs">
          {event.people.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-400">People:</span>
                {event.people.map(person => <span key={person} className="bg-slate-700 text-slate-200 px-2 py-1 rounded-full">{person}</span>)}
            </div>
          )}
          {event.tags.length > 0 && (
             <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-slate-400">Tags:</span>
                {event.tags.map(tag => <span key={tag} className="bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">{`#${tag}`}</span>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
