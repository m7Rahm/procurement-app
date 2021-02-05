import React, { useEffect, useRef } from 'react'
import { FaAngleDown } from 'react-icons/fa'
const MessageItem = (props) => {
    const ref = useRef(null);
    const calcHeight = props.getHeight;
    const setMessages = props.setMessages;
    useEffect(
        () => {
            if (calcHeight) {
                setMessages(prev => {
                    const height = prev.all.reduce((sum, item) => sum += item.height || 50, 0);
                    const all = prev.all.map((message, index, arr) => {
                        if (index >= prev.start - 2 && index <= prev.end + 2) {
                            const prevOffset = index - 1 >= 0 ? arr[index - 1].offset : 0;
                            const prevHeight = index - 1 >= 0 ? arr[index - 1].height : 0
                            const offset = prevHeight + prevOffset + 5;
                            return message.id === props.id ? ({ ...message, height: ref.current.clientHeight, offset, processed: true }) : ({ ...message, offset: offset, processed: true });
                        }
                        else {
                            return message
                        }
                    });
                    return { ...prev, all, visible: all.slice(prev.start, prev.end), height: height };
                })
            }
        }, [calcHeight, setMessages, props.id]);
    return (
        <li ref={ref} style={{ position: 'absolute', top: props.offset }}>
            <div className="message" style={{ clear: 'both', float: props.self ? 'right' : 'left', backgroundColor: props.self && 'rgb(5, 97, 98)' }}>
                <FaAngleDown />
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
