import React from 'react'

export default (props) => {
    return (
        <div className='modal-content'>
            <div>
                Sifariş № {props.number}
            </div>
            <ul>
                <li>
                    <div>Ad Soyad</div>
                    <div>Çatma Tarixi</div>
                    <div>Baxılma Tarixi</div>
                    <div>Status</div>
                </li>
                {props.participants.map((participant, index) =>
                    <li key={index}>
                        <div>{participant.fullname}
                            <div style={{fontWeight: '600', fontSize: 11, color: '#777777'}}>{'Mütəxəssis'}</div>
                        </div>
                        <div>{new Date().toString().substring(4, 15)}</div>
                        <div>{new Date().toString().substring(4, 15)}</div>
                        <div>{'Təsdiq edilib'}</div>
                    </li>
                )}
            </ul>
        </div>
    )
}
