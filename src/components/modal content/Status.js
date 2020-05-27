import React from 'react'
import {
  FaSearch,
  FaBoxOpen,
  FaCheck,
  FaShoppingCart,
  FaTruck
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
    </div>
  )
}
