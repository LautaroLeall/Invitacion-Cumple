// src/components/FormPresencia.jsx
import React, { useState } from 'react'
import '../styles/formPresencia.css'

export default function FormPresencia({ attending = 'yes', onClose = () => { }, whatsappNumber = null }) {
    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [asistira, setAsistira] = useState(attending === 'yes' ? 'yes' : 'no')
    const [submitting, setSubmitting] = useState(false)

    // Número que pasaste (formato digits-only). Se usará si no está en env ni en prop.
    const DEFAULT_WA = '5493815535408'
    const WA_NUMBER = whatsappNumber || import.meta.env.VITE_WHATSAPP_TO || DEFAULT_WA

    function validate() {
        if (!nombre.trim()) {
            alert('Por favor ingresá tu nombre.')
            return false
        }
        if (!apellido.trim()) {
            alert('Por favor ingresá tu apellido.')
            return false
        }
        if (!WA_NUMBER) {
            alert('Número de WhatsApp no configurado. Configurá VITE_WHATSAPP_TO o pasá whatsappNumber al componente.')
            return false
        }
        const digitsOnly = WA_NUMBER.replace(/\D/g, '')
        if (digitsOnly.length < 6) {
            alert('El número de WhatsApp parece inválido. Revisalo (ej: 54911XXXXXXXX).')
            return false
        }
        return true
    }

    function buildMessage() {
        const asistenciaTexto = asistira === 'yes' ? 'podré asistir' : 'no podré asistir'
        const msg = `Hola Rocio soy ${nombre} ${apellido}, ${asistenciaTexto} al cumpleaños de Olivia, en el Patio de Comidas - Hiper Libertad a las 18:30 - 20:30 el Jueves 2 de octubre. Gracias por la invitación!!`
        return msg
    }

    function handleSubmit(e) {
        e.preventDefault()
        if (!validate()) return

        setSubmitting(true)
        const text = buildMessage()
        const digits = WA_NUMBER.replace(/\D/g, '')
        const url = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`

        window.open(url, '_blank')

        setTimeout(() => {
            setSubmitting(false)
            onClose?.()
        }, 450)
    }

    return (
        <div className="fp-modal" role="dialog" aria-modal="true" aria-label="Formulario de confirmación">
            <div className="fp-card p-3 rounded shadow-sm">
                <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="mb-0">Confirmación de asistencia</h5>
                    <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
                </div>

                <form onSubmit={handleSubmit} className="fp-form">
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <label className="form-label">Nombre</label>
                            <input
                                type="text"
                                className="form-control"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-2">
                            <label className="form-label">Apellido</label>
                            <input
                                type="text"
                                className="form-control"
                                value={apellido}
                                onChange={(e) => setApellido(e.target.value)}
                                required
                            />
                        </div>

                        <div className="col-12 mb-3">
                            <label className="form-label">¿Vas a asistir?</label>
                            <select className="form-select" value={asistira} onChange={(e) => setAsistira(e.target.value)}>
                                <option value="yes">Sí, podré asistir</option>
                                <option value="no">No podré asistir</option>
                            </select>
                        </div>
                    </div>

                    <div className="d-flex gap-2 justify-content-end">
                        <button type="button" className="btn btn-outline-secondary" onClick={onClose} disabled={submitting}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn btn-success" disabled={submitting}>
                            {submitting ? 'Abriendo WhatsApp...' : 'Enviar por WhatsApp'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )
}
