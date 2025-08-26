import React, { useState } from 'react';
import { Plus } from 'lucide-react';

const AlarmForm = ({ onAddAlarm }) => {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [priority, setPriority] = useState(false);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = () => {
        if (!title || !time) return;

        const [hours, minutes] = time.split(':');
        const alarmTime = new Date();
        alarmTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        // If time is in the past, set for tomorrow
        if (alarmTime <= new Date()) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }

        onAddAlarm({
            id: Date.now(),
            title,
            time: alarmTime.getTime(),
            priority,
            completed: false,
        });

        setTitle('');
        setTime('');
        setPriority(false);
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-5 h-5" />
                Add New Alarm
            </button>
        );
    }

    return (
        <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="space-y-3">
                <input
                    type="text"
                    placeholder="Alarm title (e.g., Take medication)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    // Shows picker no matter where the input is clicked.
                    onClick={(e) => e.target.showPicker?.()}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={priority}
                        onChange={(e) => setPriority(e.target.checked)}
                        className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-sm">High Priority</span>
                </label>
                <div className="flex gap-2">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                        Add Alarm
                    </button>
                    <button
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlarmForm;