import React from 'react'
import {
  FaSearch,
  FaBoxOpen,
  FaCheck,
  FaShoppingCart,
  FaTruck,
  FaCircle
} from 'react-icons/fa'
const Status = () => {
  return (
    <>
      <div className='status-container'>
        <div className='icon-container'>
          <FaSearch size='30' color='white' />
        </div>
        <div></div>
        <div className='icon-container'>
          <FaShoppingCart size='30' color='white' />
        </div>
        <div></div>
        <div className='icon-container'>
          <FaTruck size='30' color='white' />
        </div>
        <div></div>
        <div className='icon-container'>
          <FaBoxOpen size='30' color='white' />
        </div>
        <div></div>
        <div className='icon-container'>
          <FaCheck size='30' color='white' />
        </div>
      </div>
      <span style={{ fontWeight: 'bold', marginBottom: '10px', float: 'left', clear: 'right', fontSize: '14px', marginLeft: '20px' }}>Tarixçə</span>
      <ul className='history'>
        <li style={{ backgroundColor: '#eeeeee', fontWeight: 'bold', padding: '2px', paddingLeft: '20px', marginRight: '20px', textAlign: 'left' }}>
          {new Date().toDateString()}
        </li>
        <li>
          <div className='blinking' style={{ width: '40px' }}>
            <FaCircle size='10' />
          </div>
          <div style={{ width: '20%', textAlign: 'left', marginLeft: '15%' }}>
            {
              new Date().toLocaleTimeString()
            }
          </div>
          <div style={{ textAlign: 'left' }}>
            Asif Bağırov tərəfindən sifarişə baxılır
          </div>
        </li>
        <li>
          <div style={{ width: '40px' }}>
            <FaCircle color='green' size='10' />
          </div>
          <div style={{ width: '20%', textAlign: 'left', marginLeft: '15%' }}>
            {
              new Date().toLocaleTimeString()
            }
          </div>
          <div style={{ textAlign: 'left' }}>
            Antonio sifarişi təsdiq etdi
          </div>
        </li>
        <li>
          <div style={{ width: '40px' }}>
            <FaCircle color='green' size='10' />
          </div>
          <div style={{ width: '20%', textAlign: 'left', marginLeft: '15%' }}>
            {
              new Date().toLocaleTimeString()
            }
          </div>
          <div style={{ textAlign: 'left' }}>
            Sənəd yaradıldı
          </div>
        </li>
        <li style={{ backgroundColor: '#eeeeee', fontWeight: 'bold', padding: '2px', paddingLeft: '20px', marginRight: '20px', textAlign: 'left' }}>
          {'Fri May 29 2020'}
        </li>
        <li>
          <div style={{ width: '40px' }}>
            <FaCircle color='green' size='10' />
          </div>
          <div style={{ width: '20%', textAlign: 'left', marginLeft: '15%' }}>
            {
              new Date().toLocaleTimeString()
            }
          </div>
          <div style={{ textAlign: 'left' }}>
            Pellegrini sifarişi təsdiq etdi
          </div>
        </li>
      </ul>
      </>
  )
}
export default Status
