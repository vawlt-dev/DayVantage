import React from 'react';
import { Clock, CheckCircle, XCircle, Pause } from 'lucide-react';

const FlowSuggestions = ({
                             alarms,
                             currentTime,
                             activeAlarms,
                             onComplete,
                             onSnooze,
                             onCancel
                         }) => {
    // Get next 3 upcoming alarms
    const upcomingAlarms = alarms
        .filter(alarm => !alarm.completed && currentTime < alarm.time)
        .slice(0, 3);

    // Get currently active (triggered) alarms
    const currentlyActive = alarms.filter(alarm =>
        activeAlarms.has(alarm.id) && !alarm.completed
    );

    // Get the next suggested action (next alarm or active alarm)
    const suggestedAction = currentlyActive[0] || upcomingAlarms[0];

    const formatTimeUntil = (time) => {
        const diff = Math.max(0, time - currentTime);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m`;
        return 'Now';
    };

    return (
        <div className="space-y-4">
            {/* Active Alarms Section */}
            {currentlyActive.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                        🚨 Action Required ({currentlyActive.length})
                    </h3>
                    {currentlyActive.map(alarm => (
                        <div key={alarm.id} className="flex items-center justify-between bg-white rounded p-3 mb-2">
                            <div>
                                <p className="font-medium">{alarm.title}</p>
                                <p className="text-sm text-gray-600">Scheduled for {formatTime(new Date(alarm.time))}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onComplete(alarm.id)}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 flex items-center gap-1"
                                >
                                    <CheckCircle className="w-4 h-4" /> Done
                                </button>
                                <button
                                    onClick={() => onSnooze(alarm.id)}
                                    className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700 flex items-center gap-1"
                                >
                                    <Pause className="w-4 h-4" /> +10min
                                </button>
                                <button
                                    onClick={() => onCancel(alarm.id)}
                                    className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 flex items-center gap-1"
                                >
                                    <XCircle className="w-4 h-4" /> Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Flow Section - Upcoming Activities */}
            {upcomingAlarms.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5" /> Coming Up
                    </h3>
                    <div className="space-y-2">
                        {upcomingAlarms.map((alarm, index) => (
                            <div key={alarm.id} className={`flex items-center justify-between p-3 rounded ${
                                index === 0 ? 'bg-blue-100 border border-blue-300' : 'bg-white'
                            }`}>
                                <div className="flex items-center gap-3">
                                    {alarm.priority && <span className="text-orange-500">⚠️</span>}
                                    <div>
                                        <p className="font-medium">{alarm.title}</p>
                                        <p className="text-sm text-gray-600">
                                            {formatTime(new Date(alarm.time))} • in {formatTimeUntil(alarm.time)}
                                        </p>
                                    </div>
                                </div>
                                {index === 0 && (
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-blue-700">Next Suggested Action</p>
                                        <p className="text-xs text-blue-600">Get ready!</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* No upcoming alarms */}
            {upcomingAlarms.length === 0 && currentlyActive.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Clock className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>All caught up! No upcoming activities.</p>
                </div>
            )}
        </div>
    );
};

export default FlowSuggestions;