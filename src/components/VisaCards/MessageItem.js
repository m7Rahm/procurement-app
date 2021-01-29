import React from 'react'
import { FaAngleDown } from 'react-icons/fa'
const MessageItem = (props) => {
    return (
        <li>
            <div className="message" style={{ clear: 'both', float: props.self ? 'right' : 'left', backgroundColor: props.self && 'rgb(5, 97, 98)' }}>
                <FaAngleDown/>
                {
                    !props.same && !props.self &&
                    <h1 style={{ textAlign: props.self ? 'right' : 'left', margin: '10px' }}>{props.message.full_name}</h1>
                }
                <div>
                    <div style={{ textAlign: 'left', padding: '5px', minWidth: '120px' }}>{props.message.review}</div>
                    <span style={{ fontSize: '10px', float: 'right', padding: '2px 5px', width: '100px' }}>{props.message.date_time}</span>
                </div>
                {
                    props.message.count !== 0 &&
                    <span style={{ clear: 'both', float: props.self ? 'right' : 'left', paddingBottom: '5px', marginRight: '10px', cursor: 'pointer' }}>
                        {props.message.count} Cavab 
                    </span>
                }
            </div>
        </li>
    )
}
export default MessageItem
