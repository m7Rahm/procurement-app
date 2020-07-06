<<<<<<< HEAD
import React, { useRef, useEffect, useState } from 'react';
=======
import React, { useRef, useEffect } from 'react';
>>>>>>> e47ef4b8e4b4ab45eeccc2ac7deabd6cf5421022
import './App.css';
import logo from './logo.svg'
import Table from './components/Table'
import Search from './components/Search'
import NewOrderButton from './components/NewOderButton';
import {
  IoMdMenu
} from 'react-icons/io'
import LeftSidePane from './components/LefSidePane';
// import SideBar from './components/SideBar'
const App =  () => {
  const wrapperRef = useRef(null);
  const leftPaneRef = useRef(null);
  const [backgroundVisibility, setBackgroundVisibility] = useState(false)
  useEffect(() => {
    //todo: create socket and connect
  }, [])
  const handleNavClick = () => {
    leftPaneRef.current.classList.toggle('left-side-pane-open');
    setBackgroundVisibility(prev => !prev)
  }
  return (
    <div className="app">
      <nav>
        <ul>
          <li>
            <div>
              <div className="left-side-toggle">
              <IoMdMenu size="24" cursor="pointer" color="#606060" onClick={handleNavClick} />
              </div>
              <div>
              <img style={{ height: '32px' }} src={logo} alt='user pic'></img>
              </div>
            </div>
          </li>
        </ul>
      </nav>
      {backgroundVisibility && <div style={{position:'fixed', height: '100%', width: '100%', top: 0, left: 0, background: 'rgba(0, 0, 0, 0.6)', zIndex: 1}}></div>}
      <LeftSidePane ref={leftPaneRef} handleNavClick={handleNavClick}/>
      <Search />
      <div className="wrapper" ref={wrapperRef}>
        <Table wrapperRef={wrapperRef} orders={orders} />
      </div>
      <NewOrderButton wrapperRef={wrapperRef} />
    </div>
  );
}
const orders = [
  {
    status: 'Etiraz',
    number: '12',
    category: 'İnformasiya Texnologiyaları',
    participants: [{ fullname: 'A', name: 'Linonel', surname: 'Messi' }],
    deadline: '17/05/2020',
    remark: ' ',
    action: ' ',
  },
  {
    status: 'Gözlənilir',
    number: '123',
    category: 'Elektronika',
    participants: [{ fullname: 'Lala Musaeva', name: 'Lala', surname: 'Musayeva' },
    { fullname: 'Mustafayev Rahman', name: 'Rahman', surname: 'Mustafayev' },
    { fullname: 'Baghirov Emin', name: 'Emin', surname: 'Baghirov' },
    { fullname: 'Cristiano Ronaldo', name: 'Cristiano', surname: 'Ronaldo' }],
    deadline: '18/05/2020',
    remark: ' ',
    action: ' ',
  },
  {
    status: 'Təsdiq edilib',
    number: '1234',
    category: 'Kadrlar',
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
    category: 'Energetika',
    participants: [{ fullname: 'Mustafayev Rahman', name: 'Rahman', surname: 'Mustafayev' }],
    deadline: '20/05/2020',
    remark: ' ',
    action: ' ',
  },
  {
    status: 'Anbarda',
    number: '123456',
    category: 'Təsərüfat',
    participants: [{ fullname: 'Sergio Ramos', name: 'Sergio', surname: 'Ramos' }],
    deadline: '21/05/2020',
    remark: ' ',
    action: ' ',
  },
  {
    status: 'Tamamlanmışdır',
    number: '1234567',
    category: 'Digər',
    participants: [{ fullname: 'Sergio Ramos', name: 'Sergio', surname: 'Ramos' }],
    deadline: '21/05/2020',
    remark: ' ',
    action: ' ',
  }
]
export default App