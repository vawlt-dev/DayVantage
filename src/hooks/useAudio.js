// hooks/useAudio.js
import { useState, useRef, useCallback } from 'react';

export const useAudio = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);
    const audioContextRef = useRef(null);

    // Generate alarm sound using Web Audio API (no external files needed)
    const createBeepSound = useCallback(() => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);

        return { oscillator, audioContext };
    }, []);

    const playAlarm = useCallback((priority = false) => {
        if (isPlaying) return;

        setIsPlaying(true);

        // Different sound patterns for priority vs normal alarms
        const beepCount = priority ? 5 : 3;
        const interval = priority ? 300 : 500;

        let beepIndex = 0;
        const beepInterval = setInterval(() => {
            const { oscillator, audioContext } = createBeepSound();
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 1);

            beepIndex++;
            if (beepIndex >= beepCount) {
                clearInterval(beepInterval);
                // Repeat the pattern every 10 seconds until stopped
                const repeatTimeout = setTimeout(() => {
                    if (isPlaying) playAlarm(priority);
                }, 10000);
                audioRef.current = { type: 'timeout', ref: repeatTimeout };
            }
        }, interval);

        audioRef.current = { type: 'interval', ref: beepInterval };
    }, [isPlaying, createBeepSound]);

    const stopAlarm = useCallback(() => {
        setIsPlaying(false);
        if (audioRef.current) {
            if (audioRef.current.type === 'interval') {
                clearInterval(audioRef.current.ref);
            } else if (audioRef.current.type === 'timeout') {
                clearTimeout(audioRef.current.ref);
            }
            audioRef.current = null;
        }
    }, []);

    return { playAlarm, stopAlarm, isPlaying };
};