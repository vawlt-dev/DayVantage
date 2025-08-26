import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import AlarmItem from './components/AlarmItem';
import AlarmForm from './components/AlarmForm';
import { formatTime } from './utils/timeUtils';
import { useAudio2 } from './hooks/useAudio2';
import { useNotifications } from './hooks/useNotifications';
import DBNO from './assets/DBNO.mp3';

export default function AlarmClockApp() {
    const [alarms, setAlarms] = useState([]);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [activeAlarms, setActiveAlarms] = useState(new Set());

    const { playAlarm, stopAlarm, isPlaying } = useAudio2(DBNO);
    const { showNotification, hasPermission } = useNotifications();

    // Check for triggered alarms
    useEffect(() => {
        const triggeredAlarms = alarms.filter(alarm => {
            const isTriggered = currentTime >= alarm.time && !alarm.completed;
            const wasAlreadyActive = activeAlarms.has(alarm.id);
            return isTriggered && !wasAlreadyActive;
        });

        if (triggeredAlarms.length > 0) {
            // Add to active alarms
            setActiveAlarms(prev => {
                const newSet = new Set(prev);
                triggeredAlarms.forEach(alarm => newSet.add(alarm.id));
                return newSet;
            });

            // Play sound for the highest priority alarm
            const priorityAlarm = triggeredAlarms.find(a => a.priority) || triggeredAlarms[0];
            playAlarm(priorityAlarm.priority);

            // Show notifications
            triggeredAlarms.forEach(alarm => {
                showNotification(`⏰ ${alarm.title}`, {
                    body: `Scheduled for ${formatTime(new Date(alarm.time))}`,
                    data: { alarmId: alarm.id }
                });
            });
        }
    }, [currentTime, alarms, activeAlarms, playAlarm, showNotification]);

    const completeAlarm = (alarmId) => {
        setAlarms(prev => prev.map(alarm =>
            alarm.id === alarmId ? { ...alarm, completed: true } : alarm
        ));
        setActiveAlarms(prev => {
            const newSet = new Set(prev);
            newSet.delete(alarmId);
            if (newSet.size === 0) stopAlarm();
            return newSet;
        });
    };
    // Update current time every second
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const addAlarm = (alarm) => {
        setAlarms((prev) => [...prev, alarm].sort((a, b) => a.time - b.time));
    };

    const deleteAlarm = (id) => {
        setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
        stopAlarm();
    };

    const upcomingAlarms = alarms.filter((alarm) => !alarm.completed);
    const expiredAlarms = upcomingAlarms.filter(
        (alarm) => currentTime >= alarm.time
    );

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto">
                <header className="text-center mb-8">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-8 h-8 text-blue-600" />
                        <h1 className="text-3xl font-bold text-gray-800">DayVantage</h1>
                    </div>
                    <p className="text-gray-600">Your routine management companion</p>
                    <div className="mt-4 text-2xl font-mono text-gray-800">
                        {formatTime(new Date(currentTime))}
                    </div>
                </header>

                {expiredAlarms.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded">
                        <h2 className="font-bold text-red-800 mb-2">
                            ⚠️ {expiredAlarms.length} Alarm
                            {expiredAlarms.length > 1 ? 's' : ''} Need Attention!
                        </h2>
                    </div>
                )}

                <div className="space-y-4">
                    <AlarmForm onAddAlarm={addAlarm} />

                    {upcomingAlarms.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>No alarms set. Add one to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Upcoming Activities ({upcomingAlarms.length})
                            </h2>
                            {upcomingAlarms.map((alarm) => (
                                <AlarmItem
                                    key={alarm.id}
                                    alarm={alarm}
                                    onDelete={deleteAlarm}
                                    currentTime={currentTime}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}