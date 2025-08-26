import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { formatTime } from '../utils/timeUtils';


const AlarmItem = ({ alarm, onDelete, currentTime }) => {
    const isExpired = currentTime >= alarm.time;
    const isAlmostDue = !isExpired && (alarm.time - currentTime) <= 5 * 60 * 1000; // 5 minutes

    return (
        <div
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                isExpired
                    ? 'bg-red-100 border-red-400 shadow-lg animate-pulse'
                    : isAlmostDue
                        ? 'bg-yellow-100 border-yellow-400'
                        : 'bg-white border-gray-300'
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {alarm.priority && (
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-800">{alarm.title}</h3>
                        <p className="text-sm text-gray-600">
                            {formatTime(new Date(alarm.time))}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isExpired && (
                        <span className="text-red-600 font-bold text-sm">EXPIRED</span>
                    )}
                    <button
                        onClick={() => onDelete(alarm.id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlarmItem;