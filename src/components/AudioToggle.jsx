// src/components/AudioToggle.jsx
import { useState, useRef, useEffect } from "react";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import "../styles/audioToggle.css";

export default function AudioToggle({ src }) {
    const [muted, setMuted] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio(src);
        audio.loop = true;
        audio.preload = "auto";
        audioRef.current = audio;

        return () => {
            audio.pause();
            audio.src = "";
            audioRef.current = null;
        };
    }, [src]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = muted;
            if (!muted) {
                audioRef.current
                    .play()
                    .catch(() => console.warn("El navegador bloqueó autoplay"));
            } else {
                audioRef.current.pause();
            }
        }
    }, [muted]);

    const toggleMute = () => setMuted((m) => !m);

    return (
        <button
            className={`audio-toggle ${muted ? "muted" : "playing"}`}
            onClick={toggleMute}
        >
            {muted ? <MdMusicOff size={28} /> : <MdMusicNote size={28} />}
        </button>
    );
}
