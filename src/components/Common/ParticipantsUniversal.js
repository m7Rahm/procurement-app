import React, { useEffect, useState } from 'react'

const getResultText = (result) => {
    if (result === 0)
        return 'Baxılır..'
    else if (result === -1)
        return 'Etiraz Edildi'
    else if (result === 1)
        return 'Təsdiq Edildi'
    else if (result === 2)
        return 'Redaytəyə Qaytarıldı'
    else if (result === 3)
        return 'Redaktə Edildi'
}

const ParticipantsUniversal = (props) => {
    const [participants, setParticipants] = useState([]);
    const fetchParticipants = props.fetchParticipants;
    useEffect(() => {
        fetchParticipants()
            .then(respJ => setParticipants(respJ))
            .catch(err => console.log(err))
    }, [fetchParticipants])
    return (
        participants.length !== 0 &&
        <>
            <ul className='participants'>
                <li>
                    <div>Ad Soyad</div>
                    <div>Status</div>
                    <div>Tarix</div>
                    <div style={{ textAlign: 'left' }}>Qeyd</div>
                </li>
                {
                    participants.map((participant, index) =>
                        <li key={index}>
                            <div>{participant.full_name}
                                <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{participant.department_name}</div>
                            </div>
                            <div>{getResultText(participant.result)}</div>
                            <div>{participant.action_date_time}</div>
                            <div style={{ textAlign: 'left' }}>{participant.comment}</div>
                        </li>
                    )
                }
            </ul>
        </>
    )
}

export default ParticipantsUniversal