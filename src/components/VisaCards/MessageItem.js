import React, { useLayoutEffect, useRef, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import { IoMdImage } from "react-icons/io"
import styles from "../../styles/App.module.css"
const MessageItem = (props) => {
    const ref = useRef(null);
    const [show_context_menu, set_show_context_menu] = useState(false);
    const calcHeight = props.getHeight;
    const setMessages = props.setMessages;
    const type = props.message.review.slice(0, 3) === ":f:" ? 1 : 0;
    const delete_message = () => {
        setMessages(prev => {
            const m_index = prev.all.findIndex(m => m.id === props.id);
            const all = prev.all.map((m, index) => index > m_index ? ({ ...m, offset: m.offset - ref.current.clientHeight }) : m).filter(mes => mes.id !== props.id)
            return {
                ...prev,
                height: prev.height - ref.current.clientHeight,
                count: prev.count - 1,
                all: all,
                visible: all.slice(prev.start, prev.end)
            }
        })
    }
    const handle_cmenu_click = () => {
        set_show_context_menu(prev => !prev)
    }
    const hide_menu = (e) => {
        if (e.relatedTarget?.classList.contains("menu-item")) {
            delete_message()
        }
        set_show_context_menu(false)
    }
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
                {
                    props.self &&
                    <span tabIndex="0" onClick={handle_cmenu_click} onBlur={hide_menu}>
                        <FaAngleDown />
                    </span>
                }
                {
                    show_context_menu &&
                    <div className={styles["message-context-container"]}>
                        <div className="menu-item" tabIndex="0" onClick={delete_message}>Sil</div>
                    </div>
                }
                {
                    !props.same && !props.self &&
                    <h1 style={{ textAlign: props.self ? 'right' : 'left', margin: '10px 10px 10px 5px' }}>{props.message.full_name}</h1>
                }
                <div>
                    <div style={{ textAlign: 'left', padding: '5px', minWidth: '120px' }}>
                        {
                            type !== 0
                                ? <Files fileString={props.message.review} />
                                : props.message.review
                        }
                    </div>
                    <span style={{ fontSize: '10px', float: 'right', padding: '2px 5px', width: '100px' }}>{props.message.date_time}</span>
                </div>
            </div>
        </li>
    )
}
export default MessageItem

const Files = (props) => {
    const textStart = props.fileString.indexOf(":t:");
    const files = props.fileString.slice(3, textStart).split(",");
    const text = textStart !== -1 ? props.fileString.substring(textStart + 3) : props.fileString;
    return (
        <div>
            {
                files.map(file =>
                    <a target="blank" className="chat-file" key={file} title={file} href={`http://192.168.0.182:54321/original/${file}`}>
                        <IoMdImage cursor="pointer" size="2.5rem" />
                    </a>
                )
            }
            <br />
            {text}
        </div>
    )
}