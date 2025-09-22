// src/components/AudioToggle.jsx
import { useState, useRef, useEffect } from "react";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import "../styles/audioToggle.css";

export default function AudioToggle({ src }) {
    const [muted, setMuted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        const audio = new Audio(src);
        audio.loop = true;
        audio.preload = "auto";
        audioRef.current = audio;

        // Intentar reproducir de una
        audio
            .play()
            .catch(() => console.warn("⚠️ Autoplay bloqueado hasta interacción del usuario"));

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
                    .catch(() => console.warn("⚠️ Autoplay bloqueado hasta interacción del usuario"));
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
