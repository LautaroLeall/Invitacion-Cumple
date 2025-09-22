import React, { useState } from 'react'
import Background from '../components/Background'
import InvitationCard from '../components/InvitationCard'
import FormPresencia from '../components/FormPresencia'
import AudioToggle from '../components/AudioToggle'
import '../styles/background.css'
import '../styles/audioToggle.css'

export default function Home() {
    const [openForm, setOpenForm] = useState(false)
    const [attending, setAttending] = useState('yes')

    const handleOpenForm = (value) => { setAttending(value); setOpenForm(true) }

    return (
        <>
            <Background videoSrc="/assets/sea-loop.webm" lottieSrc="/assets/caustics.json" bubbleCount={12} />
            <AudioToggle src="Parte de tu Mundo  La Sirenita.mp3" initialMuted={true} />
            <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: '100vh', padding: '2rem' }}>
                <InvitationCard onOpenForm={handleOpenForm} />
            </div>
            {openForm && <FormPresencia attending={attending} onClose={() => setOpenForm(false)} />}
        </>
    )
}
