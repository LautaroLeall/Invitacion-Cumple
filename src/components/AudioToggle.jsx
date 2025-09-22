// src/components/AudioToggle.jsx
import { useState, useRef, useEffect } from "react";
import { MdMusicNote, MdMusicOff } from "react-icons/md";
import "../styles/audioToggle.css";

export default function AudioToggle({ src }) {
    const [muted, setMuted] = useState(true); // comienza silenciado
    const audioRef = useRef(null);
    const [userInteracted, setUserInteracted] = useState(false);

    useEffect(() => {
        const audio = new Audio(src);
        audio.loop = true;
        audio.preload = "auto";
        audio.muted = true; // empieza silenciado
        audioRef.current = audio;

        // Intenta reproducir silenciado (la mayoría de los navegadores permiten autoplay silenciado)
        audio.play().catch(() =>
            console.warn("⚠️ Autoplay bloqueado hasta interacción del usuario")
        );

        // Función que se activa al primer click de usuario
        const handleUserInteraction = () => {
            if (audioRef.current && !userInteracted) {
                audioRef.current.muted = false; // desmutea
                audioRef.current.play().catch(() =>
                    console.warn("⚠️ No se pudo reproducir tras la interacción")
                );
                setMuted(false); // actualiza el estado para el botón
                setUserInteracted(true); // evita que se repita
                document.removeEventListener("click", handleUserInteraction);
                document.removeEventListener("keydown", handleUserInteraction);
                document.removeEventListener("touchstart", handleUserInteraction);
            }
        };

        // Escucha cualquier interacción
        document.addEventListener("click", handleUserInteraction);
        document.addEventListener("keydown", handleUserInteraction);
        document.addEventListener("touchstart", handleUserInteraction);

        return () => {
            audio.pause();
            audio.src = "";
            audioRef.current = null;
            document.removeEventListener("click", handleUserInteraction);
            document.removeEventListener("keydown", handleUserInteraction);
            document.removeEventListener("touchstart", handleUserInteraction);
        };
    }, [src, userInteracted]);

    // Control de mute/play manual
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = muted;
            if (!muted) {
                audioRef.current
                    .play()
                    .catch(() => console.warn("⚠️ Autoplay bloqueado hasta interacción"));
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
