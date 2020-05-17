import React from 'react';
import './App.css';
import logo from './logo.svg'
import Table from './components/Table'
// import SideBar from './components/SideBar'
export default () => {
  return (
    <div className="app">
      <nav>
        <ul>
          <li>
            <a style={{ display: 'block', height: '50px' }} href='#'>
              <img style={{ height: '100%' }} src={logo} alt='user pic'></img>
            </a>
          </li>
        </ul>
      </nav>
      <div className="wrapper">
        <Table orders = {orders}/>
      </div>
    </div>
  );
}
const orders = [
  {
      status: 'Waiting',
      number: '12',
      category: 'A',
      participants: 'A, B, C, ..',
      deadline: '17/05/2020',
      remark: ' ',
      action: ' ',
  },
  {
      status: 'Ready',
      number: '123',
      category: 'B',
      participants: 'A, B, C, ..',
      deadline: '18/05/2020',
      remark: ' ',
      action: ' ',
  },
  {
      status: 'Waiting',
      number: '1234',
      category: 'C',
      participants: 'A, B, C, ..',
      deadline: '19/05/2020',
      remark: ' ',
      action: ' ',
  },
  {
      status: 'Waiting',
      number: '12345',
      category: 'D',
      participants: 'A, B, C, ..',
      deadline: '20/05/2020',
      remark: ' ',
      action: ' ',
  },
]