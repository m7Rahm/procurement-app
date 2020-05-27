import React from 'react'
import {
  FaSearch,
  FaBoxOpen,
  FaCheck,
  FaShoppingCart,
  FaTruck,
  FaCircle
} from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
export default (props) => {
  const closeModal = props.changeModalState
  return (
    <div className='modal-content'>
      <div style={{ marginBottom: '20px' }}>
        Sifariş № {props.number}
        <IoMdClose onClick={() => closeModal(false)} size='18' style={{ verticalAlign: 'baseline', float: 'right' }} />
      </div>
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
      <span style={{fontWeight: 'bold', marginBottom: '10px' , float: 'left', clear: 'right', fontSize: '14px' , marginLeft: '20px'}}>Tarixçə</span>
      <ul className='history'>
      <li>
          <div className='blinking' style={{width: '40px'}}>
            <FaCircle size='10'/>
          </div>
          <div style={{width: '20%', textAlign: 'left'}}>
            {
              new Date().toLocaleString()
            }
          </div>
          <div style={{textAlign: 'left'}}>
            Asif Bağırov tərəfindən sifarişə baxılır
          </div>
        </li>
      <li>
          <div style={{width: '40px'}}>
            <FaCircle color='green' size='10'/>
          </div>
          <div style={{width: '20%', textAlign: 'left'}}>
            {
              new Date().toLocaleString()
            }
          </div>
          <div style={{textAlign: 'left'}}>
            Antonio sifarişi təsdiq etdi
          </div>
        </li>
        <li>
          <div style={{width: '40px'}}>
            <FaCircle color='green' size='10'/>
          </div>
          <div style={{width: '20%', textAlign: 'left'}}>
            {
              new Date().toLocaleString()
            }
          </div>
          <div style={{textAlign: 'left'}}>
            Sənəd yaradıldı
          </div>
        </li>
      </ul>
    </div>
  )
}
