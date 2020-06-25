import React from 'react'
import {
  IoMdClose
} from 'react-icons/io'
const Participants = (props) => {
  const closeModal = props.changeModalState
  return (
    <div className='modal-content'>
      <div>
        Sifarişiniz təsdiq edilmişdir
        <IoMdClose onClick={() => closeModal(false)} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
      </div>
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
    </div>
  )
}
export default Participants