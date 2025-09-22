// src/components/Background.jsx
import { useEffect, useRef, useState } from 'react'
import Lottie from 'lottie-react'
import '../styles/background.css'

export default function Background({ videoSrc = '/fondo-del-mar.mp4', lottieSrc = null, poster = null }) {
    const videoRef = useRef(null)
    const [lottieData, setLottieData] = useState(null)

    useEffect(() => {
        if (!lottieSrc) return
        const ac = new AbortController()
        fetch(lottieSrc, { signal: ac.signal })
            .then(r => {
                if (!r.ok) throw new Error('Lottie not found')
                return r.json()
            })
            .then(json => setLottieData(json))
            .catch(err => {
                // comprobación segura de dev
                if (import.meta && import.meta.env && import.meta.env.MODE !== 'production') {
                    console.debug('No se cargó Lottie:', err)
                }
                setLottieData(null)
            })
        return () => ac.abort()
    }, [lottieSrc])

    useEffect(() => {
        const v = videoRef.current
        if (!v) return

        v.muted = true
        v.loop = true
        v.preload = 'auto'
        v.playsInline = true

        try {
            v.setAttribute('playsinline', '')
            v.setAttribute('webkit-playsinline', '')
        } catch (error) {
            if (import.meta && import.meta.env && import.meta.env.MODE !== 'production') {
                console.debug('No se pudieron setear attributes playsinline:', error)
            }
        }

        const tryPlay = async () => {
            try {
                await v.play()
            } catch (playError) {
                if (import.meta && import.meta.env && import.meta.env.MODE !== 'production') {
                    console.debug('Autoplay impedido:', playError)
                }
            }
        }

        tryPlay()

        const onUserGesture = () => {
            tryPlay()
        }
        window.addEventListener('touchstart', onUserGesture, { passive: true, once: true })
        window.addEventListener('click', onUserGesture, { passive: true, once: true })

        return () => {
            window.removeEventListener('touchstart', onUserGesture)
            window.removeEventListener('click', onUserGesture)
        }
    }, [videoSrc])

    return (
        <div className="background-root" aria-hidden>
            {videoSrc && (
                <video
                    ref={videoRef}
                    className="bg-video"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={poster || undefined}
                >
                    <source src={videoSrc} type="video/mp4" />
                    Tu navegador no soporta video.
                </video>
            )}

            <div className="sea-overlay" />

            {lottieData && (
                <div className="lottie-caustics" aria-hidden>
                    <Lottie animationData={lottieData} loop autoplay />
                </div>
            )}
        </div>
    )
}
