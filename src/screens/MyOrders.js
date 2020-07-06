import React, { useRef, useEffect } from 'react';
import '../App.css';
import Table from '../components/Table'
import Search from '../components/Search'
import NewOrderButton from '../components/NewOderButton';

const MyOrders = () => {
  const wrapperRef = useRef(null);
  useEffect(() => {
    //todo: create socket and connect
  }, [])
  return (
    <>
      <Search />
      <div className="wrapper" ref={wrapperRef}>
        <Table wrapperRef={wrapperRef} orders={orders} />
      </div>
      <NewOrderButton wrapperRef={wrapperRef} />
    </>
  )
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
export default MyOrders