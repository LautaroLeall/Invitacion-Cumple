// src/components/InvitationCard.jsx
import React from 'react'
import { FaMapMarkerAlt, FaCalendarAlt, FaClock } from 'react-icons/fa'
import '../styles/invitationCard.css'

export default function InvitationCard({ onOpenForm = null, data = null }) {
    const details = data || {
        name: 'Olivia',
        age: 5,
        date: 'Jueves 2 de octubre',
        time: '18:30 - 20:30',
        place: 'Patio de Comidas - Hiper Libertad',
        address: 'Av Roca 3450',
    }

    const handleRsvp = (value) => {
        if (typeof onOpenForm === 'function') {
            onOpenForm(value) // se espera que el contenedor abra el FormPresencia con el modo (yes/no)
        } else {
            // comportamiento por defecto: avisar al dev / usuario
            const msg = `Llamada RSVP: ${value}. Pasa una función onOpenForm(attending) al componente para abrir el formulario.`
            console.warn(msg)
            // en UI mostramos un pequeño alert para pruebas
            alert(msg)
        }
    }

    return (
        <div className="card invitation-card shadow-lg">
            <div className="card-body p-4 position-relative">
                <div className="decorative-top" aria-hidden="true" />

                <div className="row align-items-center">
                    {/* Usamos col-12 para mobile y col-md-5 para desktop */}
                    <div className="col-12 col-md-5 text-center mb-3 mb-md-0">
                        <div className="sirenita-box" aria-hidden="true">
                            <div className="sirenita-img-wrapper text-center mb-2">
                                <img src="/sirenita.jpg" alt="Sirenita" className="sirenita-img img-fluid" />
                            </div>
                        </div>
                    </div>

                    <div className="col-12 col-md-7">
                        <h1 className="display-6 fw-bold mb-0">{details.name}</h1>
                        <p className="lead text-muted">¡Cumple {details.age} años!</p>
                        <div className="info-list mb-3">
                            <p className="mb-1">
                                <FaCalendarAlt className="me-2 icn" />
                                <strong>{details.date}</strong>
                            </p>
                            <p className="mb-1">
                                <FaClock className="me-2 icn" />
                                <strong>{details.time}</strong>
                            </p>
                            <p className="mb-1">
                                <FaMapMarkerAlt className="me-2 icn" />
                                <strong>{details.place}</strong>
                            </p>
                            <p className="mb-0 small text-muted">{details.address}</p>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                            <button className="btn btn-primary btn-lg rsvp-btn" onClick={() => handleRsvp('yes')}>Confirmo asistencia</button>
                            <button className="btn btn-outline-secondary btn-lg rsvp-btn" onClick={() => handleRsvp('no')}>No podré asistir</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}