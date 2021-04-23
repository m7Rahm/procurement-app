import React, { useLayoutEffect, useRef } from 'react'
import { FaAngleDown } from 'react-icons/fa'
const MessageItem = (props) => {
    const ref = useRef(null);
    const calcHeight = props.getHeight;
    const setMessages = props.setMessages;
    useLayoutEffect(() => {
        if (calcHeight && !props.added) {
            setMessages(prev => {
                const height = prev.all.reduce((sum, item) => sum += (item.height || 50) + 5, 5);
                const lastKnownIndex = prev.all.reduce((prev, current, index) => current.offset && index > prev ? index : prev, prev.lastKnownIndex);
                let currentIndex = prev.all.length;
                const all = prev.all.map((message, index, arr) => {
                    if (message.id === props.id) {
                        currentIndex = index;
                        const offset = arr.slice(lastKnownIndex, index).reduce((_, current) => current.offset + current.height + 5, 0);
                        const approxOffset = arr.slice(0, index).reduce((sum, item) => sum += (item.height || 50) + 5, 5);
                        return ({
                            ...message,
                            height: ref.current.clientHeight,
                            approxOffset: offset !== 0 && !isNaN(offset) ? offset : approxOffset,
                            offset: offset !== 0 && !isNaN(offset) ? offset : message.offset,
                            processed: true
                        })
                    }
                    else {
                        return {
                            ...message,
                            approxOffset: index > currentIndex
                                ? message.approxOffset + ref.current.clientHeight - 50
                                : message.approxOffset
                        }
                    }
                });
                return { ...prev, all, visible: all.slice(prev.start, prev.end), height: height, lastKnownIndex: lastKnownIndex };
            })
        }
        else if (props.added)
            setMessages(prev => {
                const end = prev.height + ref.current.clientHeight < 350 ? prev.end + 1 : prev.end;
                const all = prev.all.map(message => ({
                    ...message,
                    offset: message.id !== props.id ? message.offset + ref.current.clientHeight + 5 : 5,
                    approxOffset: message.id !== props.id ? message.approxOffset + ref.current.clientHeight + 5 : 5,
                    height: message.id === props.id ? ref.current.clientHeight : message.height,
                    added: false
                }));
                return { ...prev, all, visible: all.slice(prev.start, end), height: prev.height + ref.current.clientHeight + 5, end: end };
            })
        else if (props.updated)
            setMessages(prev => {
                const end = prev.height + ref.current.clientHeight < 350 ? prev.end + 1 : prev.end;
                const currentIndex = prev.all.findIndex(message => message.id === props.id);
                const diff = ref.current.clientHeight - prev.all[currentIndex].height;
                const all = prev.all.map((message, index) => ({
                    ...message,
                    offset: index > currentIndex ? message.offset + diff : message.offset,
                    approxOffset: index > currentIndex ? message.approxOffset + diff : message.approxOffset,
                    height: message.id === props.id ? ref.current.clientHeight : message.height,
                    updated: false
                }));
                return { ...prev, all, visible: all.slice(prev.start, end), height: prev.height + diff, end: end };
            })
    }, [calcHeight, setMessages, props.id, props.added, props.updated]);
    const rightOrLeft = props.self ? { right: '5px' } : { left: '5px' }
    return (
        <li ref={ref} style={{ position: 'absolute', transform: `translateY(${props.offset})`, ...rightOrLeft, overflow: 'hidden' }}>
            <div className="message" style={{ clear: 'both', float: 'right', backgroundColor: props.self && 'rgb(5, 97, 98)' }}>
                <FaAngleDown />
                {
                    !props.same && !props.self &&
                    <h1 style={{ textAlign: props.self ? 'right' : 'left', margin: '10px' }}>{props.message.full_name}</h1>
                }
                <div>
                    <div style={{ textAlign: 'left', padding: '5px', minWidth: '120px' }}>{props.message.review}</div>
                    <span style={{ fontSize: '10px', float: 'right', padding: '2px 5px', width: '100px' }}>{props.message.date_time}</span>
                </div>
            </div>
        </li>
    )
}
export default MessageItem
