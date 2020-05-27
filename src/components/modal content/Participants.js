import React from 'react'
import {
  IoMdClose
} from 'react-icons/io'
export default (props) => {
  const closeModal = props.changeModalState
  return (
    <div className='modal-content'>
      <div>
        Sifariş № {props.number}
        <IoMdClose onClick={() => closeModal(false)} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
      </div>
      <ul>
        <li>
          <div>Ad Soyad</div>
          <div>Status</div>
          <div>Tarix</div>
          <div>Qeyd</div>
        </li>
        {props.participants.map((participant, index) =>
          <li key={index}>
            <div>{participant.fullname}
              <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{'Mütəxəssis'}</div>
            </div>
            <div>{'Təsdiq'}</div>
            <div>{new Date().toString().substring(4, 15)}</div>
            <div>ABCSDW</div>
          </li>
        )}
      </ul>
    </div>
  )
}
