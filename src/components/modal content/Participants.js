import React from 'react'

const Participants = (props) => {
  return (

      <ul className='participants'>
        <li>
          <div>Ad Soyad</div>
          <div>Status</div>
          <div>Tarix</div>
          <div style={{ textAlign: 'left' }}>Qeyd</div>
        </li>
        {props.participants.map((participant, index) =>
          <li key={index}>
            <div>{participant.fullname}
              <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{'Mütəxəssis'}</div>
            </div>
            <div>{'Təsdiq'}</div>
            <div>{new Date().toString().substring(4, 15)}</div>
            <div style={{ textAlign: 'left' }}>ABCSDW</div>
          </li>
        )}
      </ul>
  )
}
export default Participants