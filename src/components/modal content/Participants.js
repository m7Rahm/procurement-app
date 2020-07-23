import React, { useEffect, useState } from 'react'

const Participants = (props) => {
  // console.log(props.number)
  const [participants, setParticipants] = useState(null)
  useEffect(() => {
    fetch(`http://172.16.3.101:54321/api/participants/${props.number}`)
      .then(resp => resp.json())
      .then(respJ => setParticipants(respJ)
      )
      .catch(err => console.log(err))
  }, [props.number])
  return (
    participants &&
    <ul className='participants'>
      <li>
        <div>Ad Soyad</div>
        <div>Status</div>
        <div>Tarix</div>
        <div style={{ textAlign: 'left' }}>Qeyd</div>
      </li>
      {participants.map((participant, index) =>
        <li key={index}>
          <div>{participant.full_name}
            <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{'Mütəxəssis'}</div>
          </div>
          <div>{participant.result === 1 ? 'Təsdiq' : participant.result === 0 ? 'Etiraz' : 'Baxılır'}</div>
          <div>{participant.date_time}</div>
          <div style={{ textAlign: 'left' }}>{participant.comment}</div>
        </li>
      )}
    </ul>
  )
}
export default Participants