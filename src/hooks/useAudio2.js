// hooks/useAudio2.js
import { useState, useRef, useCallback } from 'react';

export const useAudio2 = (src) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    const playAlarm = useCallback(() => {
        if (isPlaying) return;

        if (!audioRef.current) {
            audioRef.current = new Audio(src);
            audioRef.current.loop = true; // keep repeating until stopped
        }

        audioRef.current.play();
        setIsPlaying(true);
    }, [isPlaying, src]);

    const stopAlarm = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    }, []);

    return { playAlarm, stopAlarm, isPlaying };
};
