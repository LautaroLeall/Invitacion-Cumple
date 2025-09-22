// src/components/Background.jsx
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import Lottie from 'lottie-react'
import '../styles/background.css'

export default function Background({ videoSrc = '/fondo-del-mar.mp4', lottieSrc = null, bubbleCount = 12 }) {
    const containerRef = useRef(null)
    const bubblesRef = useRef(null)
    const videoRef = useRef(null)
    const [lottieData, setLottieData] = useState(null)

    // Preparamos datos para las burbujas: posición (left), tamaño (px) y delay inicial
    const [bubbleData] = useState(() => {
        return Array.from({ length: bubbleCount }).map(() => {
            const size = 8 + Math.round(Math.random() * 26) // 8 - 34 px
            const left = Math.round(Math.random() * 92) // 0% - 92%
            const delay = Math.random() * 3
            return { size, left, delay }
        })
    })

    // Cargar Lottie si recibimos lottieSrc
    useEffect(() => {
        if (!lottieSrc) return
        const ac = new AbortController()
        fetch(lottieSrc, { signal: ac.signal })
            .then(r => {
                if (!r.ok) throw new Error('Lottie not found')
                return r.json()
            })
            .then(json => setLottieData(json))
            .catch((err) => {
                if (err.name !== 'AbortError') {
                    console.warn('No se cargó Lottie:', err)
                    setLottieData(null)
                }
            })
        return () => ac.abort()
    }, [lottieSrc])

    // Pausar video en pantallas chicas (opcional, ahorro de datos)
    useEffect(() => {
        const v = videoRef.current
        if (!v) return
        const small = window.innerWidth < 700
        if (small) {
            v.pause()
            v.dataset.pausedForSmall = '1'
        } else {
            if (!v.paused && v.dataset.pausedForSmall !== '1') {
                v.play().catch(() => { })
            }
        }
        let t = null
        const onResize = () => {
            clearTimeout(t)
            t = setTimeout(() => {
                const nowSmall = window.innerWidth < 700
                if (nowSmall && !v.paused) {
                    v.pause()
                    v.dataset.pausedForSmall = '1'
                } else if (!nowSmall && v.dataset.pausedForSmall === '1') {
                    v.play().catch(() => { })
                    delete v.dataset.pausedForSmall
                }
            }, 150)
        }
        window.addEventListener('resize', onResize)
        return () => {
            window.removeEventListener('resize', onResize)
            clearTimeout(t)
        }
    }, [])

    // Animaciones GSAP para las burbujas y parallax por mouse
    useEffect(() => {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

        const ctx = gsap.context(() => {
            const bubbleEls = bubblesRef.current ? Array.from(bubblesRef.current.children) : []

            bubbleEls.forEach((b, i) => {
                const dur = 6 + Math.random() * 6 + (i % 4) * 0.6
                const xShift = (Math.random() - 0.5) * 140
                const rise = 220 + Math.random() * 420

                const data = bubbleData[i] || {}
                if (data.left != null) b.style.left = `${data.left}%`
                if (data.size != null) {
                    b.style.width = `${data.size}px`
                    b.style.height = `${data.size}px`
                }

                gsap.fromTo(b,
                    { y: 0, opacity: 0, x: 0, scale: 0.6 },
                    {
                        y: -rise,
                        opacity: 0.88,
                        x: xShift,
                        scale: 0.6 + Math.random() * 0.9,
                        duration: dur,
                        repeat: -1,
                        repeatDelay: 0.8 + Math.random() * 2.4,
                        delay: data.delay || Math.random() * 1.5,
                        ease: 'sine.inOut'
                    })
            })

            let mouseHandler = null
            if (window.innerWidth > 600) {
                mouseHandler = (e) => {
                    const px = (e.clientX / window.innerWidth - 0.5) * 10
                    const py = (e.clientY / window.innerHeight - 0.5) * 6
                    gsap.to(containerRef.current, { x: px, y: py, duration: 0.9, ease: 'power3.out' })
                }
                window.addEventListener('mousemove', mouseHandler)
            }

            return () => {
                if (mouseHandler) window.removeEventListener('mousemove', mouseHandler)
            }
        }, containerRef)

        return () => {
            try {
                ctx.revert()
            } catch {
                // ignoramos error
            }
        }

    }, [bubbleData])

    // Burbujas renderizadas
    const bubbles = bubbleData.map((d, i) => (
        <div
            key={i}
            className={`bubble b${(i % 8) + 1}`}
            style={{ left: `${d.left}%`, width: `${d.size}px`, height: `${d.size}px` }}
        />
    ))

    return (
        <div className="background-root" ref={containerRef} aria-hidden>
            {/* Si videoSrc es falsy, no renderizamos el video (permite pasar null) */}
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

            <div className="sea-gradient" />
            <div className="sea-texture" />

            <div className="waves">
                <div className="wave wave1" />
                <div className="wave wave2" />
                <div className="wave wave3" />
            </div>

            <div className="bubbles" ref={bubblesRef}>
                {bubbles}
            </div>

            {lottieData && (
                <div className="lottie-caustics" aria-hidden>
                    <Lottie animationData={lottieData} loop autoplay />
                </div>
            )}

            <div className="sea-overlay" />
        </div>
    )
}
