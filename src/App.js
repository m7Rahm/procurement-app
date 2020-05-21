import React, { lazy, useState, Suspense, useCallback } from 'react';
import './App.css';
import logo from './logo.svg'
import Table from './components/Table'
const Modal = lazy(() => import('./components/Modal'))
// import SideBar from './components/SideBar'
export default () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [content, setModalContent] = useState('')
  const setModalVisibilityCallback = useCallback(setIsModalOpen, [])
  const setModalContentCallback = useCallback(setModalContent, [])
  console.log('App.js')
  return (
    <div className="app">
      <nav>
        <ul>
          <li>
            <a style={{ display: 'block', height: '50px' }} href='https://reactjs.org/'>
              <img style={{ height: '100%' }} src={logo} alt='user pic'></img>
            </a>
          </li>
        </ul>
      </nav>
      <div className="wrapper" style={{ filter: isModalOpen ? 'blur(4px)' : '' }}>
        <Table orders={orders} setModalVisibility={setModalVisibilityCallback} setModalContent={setModalContentCallback} />
      </div>
      {
        isModalOpen ?
          <Suspense fallback={<div>loading..</div>}>
            <Modal changeModalState={setModalVisibilityCallback} content={content} />
          </Suspense> :
          ''
      }
    </div>
  );
}
const orders = [
  {
    status: 'Etiraz',
    number: '12',
    category: 'A',
    participants: [{ fullname: 'A', name: 'Linonel', surname: 'Messi' }],
    deadline: '17/05/2020',
    remark: ' ',
    action: ' ',
  },
  {
    status: 'Gözlənilir',
    number: '123',
    category: 'B',
    participants: [{ fullname: 'Lala Musaeva', name: 'Lala', surname: 'Musayeva' },
    { fullname: 'Mustafayev Rahman', name: 'Rahman', surname: 'Mustafayev' },
    { fullname: 'Baghirov Emin', name: 'Emin', surname: 'Baghirov' },
    { fullname: 'Cristiano Ronaldo', name: 'Cristiano', surname: 'Ronaldo' }],
    deadline: '18/05/2020',
    remark: ' ',
    action: ' ',
  },
  {
    status: 'Təsdiqlənib',
    number: '1234',
    category: 'C',
    participants: [{ fullname: 'A', name: 'Rahman', surname: 'Mustafayev' },
    { fullname: 'B', name: 'Cesc', surname: 'Fabregas' },
    { fullname: 'C', name: 'Gabriel', surname: 'Martinelli' }],
    deadline: '19/05/2020',
    remark: ' ',
    action: ' ',
  },
  {
    status: 'Baxılır',
    number: '12345',
    category: 'D',
    participants: [{ fullname: 'Mustafayev Rahman', name: 'Rahman', surname: 'Mustafayev' }],
    deadline: '20/05/2020',
    remark: ' ',
    action: ' ',
  },
  {
    status: 'Anbarda',
    number: '123456',
    category: 'E',
    participants: [{ fullname: 'Sergio Ramos', name: 'Sergio', surname: 'Ramos' }],
    deadline: '21/05/2020',
    remark: ' ',
    action: ' ',
  },
]