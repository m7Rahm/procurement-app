import React from 'react'
import ListItem from './ListItem'
export default (props) => {
  // const [isBlur, setIsBlur] = useState(false);
  // console.log(isBlur);
  // const setBlurCallback = useCallback(setIsBlur,[]);
  return (
    <ul className='table'>
      <li key={-1}>
        <div style={{ width: '25px' }}> #</div>
        <div style={{ width: '15%', paddingLeft: '30px' }}> Status</div>
        <div style={{ width: '20%' }}> Katqoriya</div>
        <div style={{ width: '15%' }}> Nömrə</div>
        <div style={{ width: '20%', paddingLeft: '30px' }}> İştirakçılar</div>
        <div style={{ width: '15%' }}> Deadline</div>
        <div style={{ width: '5%' }}> Qeyd</div>
        <div style={{ overflow: 'hidden' }}>  </div>
      </li>
      {
        props.orders.map((order, index) =>
          <ListItem
            // changeBlur={setBlurCallback}
            setModalContent={props.setModalContent}
            setModalVisibility={props.setModalVisibility}
            index={index}
            key={index}
            rowNumber={index + 1}
            status={order.status}
            number={order.number}
            category={order.category}
            participants={order.participants}
            deadline={order.deadline}
            remark=''
            action=''
          />)
      }
    </ul>
  )
}

