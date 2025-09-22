// src/components/Background.jsx
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Lottie from 'lottie-react'
import '../styles/background.css'

export default function Background({ videoSrc = '/assets/sea-loop.webm', lottieSrc = null, bubbleCount = 12 }) {
    const containerRef = useRef(null)
    const bubblesRef = useRef(null)
    const videoRef = useRef(null)
    const [lottieData, setLottieData] = useState(null)

    useEffect(() => {
        if (lottieSrc) {
            fetch(lottieSrc).then(r => r.json()).then(json => setLottieData(json)).catch(() => setLottieData(null))
        }
    }, [lottieSrc])

    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
        const ctx = gsap.context(() => {
            const bubbleEls = bubblesRef.current ? Array.from(bubblesRef.current.children) : []
            bubbleEls.forEach((b, i) => {
                const dur = 5 + Math.random() * 5 + (i % 3) * 0.6
                const delay = Math.random() * 2 + i * 0.12
                const xShift = (Math.random() - 0.5) * 120
                gsap.fromTo(b, { y: 0, opacity: 0, x: 0, scale: 0.6 },
                    { y: -(220 + Math.random() * 420), opacity: 0, x: xShift, scale: 0.6 + Math.random() * 0.9, duration: dur, repeat: -1, delay, ease: 'sine.inOut' })
            })

            // sutil parallax por mouse (desktop)
            if (window.innerWidth > 600) {
                const handler = (e) => {
                    const px = (e.clientX / window.innerWidth - 0.5) * 12
                    const py = (e.clientY / window.innerHeight - 0.5) * 8
                    gsap.to(containerRef.current, { x: px, y: py, duration: 0.9, ease: 'power3.out' })
                }
                window.addEventListener('mousemove', handler)
                return () => window.removeEventListener('mousemove', handler)
            }
        }, containerRef)

        return () => ctx.revert()
    }, [bubbleCount])

    // render bubbles
    const bubbles = Array.from({ length: bubbleCount }).map((_, i) => <div key={i} className={`bubble b${(i % 8) + 1}`} />)

    return (
        <div className="background-root" ref={containerRef} aria-hidden>
            {/* VIDEO de fondo (loop, muted por defecto) */}
            {videoSrc && (
                <video
                    ref={videoRef}
                    className="bg-video"
                    src={videoSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                />
            )}

            {/* overlay y textura */}
            <div className="sea-gradient" />
            <div className="sea-texture" />

            {/* waves / soft shapes (mejoradas en css) */}
            <div className="waves">
                <div className="wave wave1" />
                <div className="wave wave2" />
                <div className="wave wave3" />
            </div>

            {/* burbujas animadas */}
            <div className="bubbles" ref={bubblesRef}>
                {bubbles}
            </div>

            {/* lottie optional (causticas) */}
            {lottieData && <div className="lottie-caustics"><Lottie animationData={lottieData} loop autoplay /></div>}

            {/* overlay oscuro para legibilidad del contenido */}
            <div className="sea-overlay" />
        </div>
    )
}
