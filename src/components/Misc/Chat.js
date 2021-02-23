import React, { useContext, useEffect, useRef, useState } from 'react'
import MessageItem from '../VisaCards/MessageItem'
import { TokenContext } from '../../App'
import { IoMdSend } from 'react-icons/io'
import { WebSocketContext } from '../../pages/SelectModule'
const Chat = (props) => {
    const { loadMessages } = props;
    const tokenContext = useContext(TokenContext);
    const webSocket = useContext(WebSocketContext);
    const userInfo = tokenContext[0].userData.userInfo;
    const messageBoxRef = useRef(null);
    const active = useRef(0);
    const [messages, setMessages] = useState({ all: [], visible: [], height: '250px', count: 0, start: 0, end: 0, lastKnownIndex: 0 });
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        setMessages(prev => {
            const indexStart = prev.all.findIndex(message => message.approxOffset >= offsetTop);
            const bottomEdge = offsetTop + 250;
            const indexTop = prev.all.findIndex(message => message.approxOffset >= bottomEdge);
            const indexEnd = indexTop !== -1 ? indexTop + 1 : prev.all.length;
            const renderedIndexStart = indexStart - 2 < 0 ? 0 : indexStart - 2;
            const visible = prev.all.slice(indexStart === - 1 ? indexEnd - 6 : renderedIndexStart, indexEnd);
            return ({ ...prev, visible, start: indexStart === - 1 ? indexEnd - 6 : renderedIndexStart, end: indexEnd })
        })
    }
    useEffect(() => {
        const addNewMessage = (event) => {
            const { data } = event.detail;
            if (props.documentType === data.docType && props.documentid === data.docid)
                setMessages(prev => {
                    const newMessage = {
                        user_id: data.senderid,
                        self: false,
                        review: data.text,
                        date_time: data.dateTime,
                        count: 0,
                        same: false,
                        id: data.id,
                        offset: 5,
                        approxOffset: 5,
                        processed: true,
                        added: true,
                        full_name: data.full_name
                    };
                    const all = [newMessage, ...prev.all]
                    all[1].same = all[1].user_id === data.senderid ? true : false;
                    all[1].updated = true;
                    const visible = all.slice(prev.start, prev.end);
                    return ({
                        ...prev,
                        all,
                        visible: visible.find(message => message.id === data.id) ? visible : [newMessage, ...visible],
                        count: prev.count + 1
                    })
                })
        }
        window.addEventListener("newMessage", addNewMessage, false);
        return () => {
            window.removeEventListener("newMessage", addNewMessage)
        }
    }, [props.documentType, props.documentid, userInfo.id])
    useEffect(() => {
        loadMessages()
            .then(resp => resp.json())
            .then(respJ => {
                active.current = 0;
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                const all = respJ.map((message, index, messages) => ({
                    ...message,
                    approxOffset: index * 50,
                    processed: false,
                    self: message.user_id === userInfo.id,
                    same: index >= 1 ? messages[index].user_id === messages[index - 1].user_id : false
                }));
                if (all.length !== 0) {
                    all[0].offset = 5;
                    all[0].processed = true;
                }
                const firstFromBottom = all.findIndex(message => message.approxOffset >= 250);
                const indexEnd = firstFromBottom !== -1 ? firstFromBottom + 1 : all.length
                const visible = all.slice(0, indexEnd);
                setMessages({ count: totalCount, all, visible, height: all.length * 50, start: 0, end: indexEnd, lastKnownIndex: 0 });
            })
            .catch(ex => console.log(ex))
    }, [props.token, loadMessages, userInfo.id]);
    const sendMessage = (replyto) => {
        const data = {
            replyto: replyto,
            message: messageBoxRef.current.value,
            docid: props.documentid
        }
        if (messageBoxRef.current.value !== "")
            props.sendMessage(data)
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ) {
                        const { id, date_time: dateTime, participants } = respJ;
                        const text = messageBoxRef.current.value;
                        const message = {
                            message: "newMessage",
                            receivers: participants,
                            data: {
                                id: id,
                                text: text,
                                docType: props.documentType,
                                docid: props.documentid,
                                tranid: props.tranid,
                                senderid: userInfo.id,
                                dateTime: dateTime,
                                full_name: userInfo.fullName
                            }
                        }
                        webSocket.send(JSON.stringify(message));
                        setMessages(prev => {
                            const newMessage = {
                                user_id: userInfo.id,
                                self: true,
                                review: messageBoxRef.current.value,
                                date_time: dateTime,
                                count: 0,
                                id: id,
                                offset: 5,
                                approxOffset: 5,
                                processed: true,
                                added: true
                            };
                            const all = [newMessage, ...prev.all]
                            const visible = all.slice(prev.start, prev.end);
                            return ({
                                ...prev,
                                all,
                                visible: visible.find(message => message.id === newMessage.id) ? visible : [newMessage, ...visible],
                                count: prev.count + 1
                            })
                        })
                        messageBoxRef.current.value = '';
                    }
                })
                .catch(ex => console.log(ex))
    }
    const loadMore = () => {
        active.current += 1;
        const from = active.current * 20;
        loadMessages(from)
            .then(resp => resp.json())
            .then(respJ => {
                setMessages(prev => {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    const all = respJ
                        .filter(message => !prev.all.find(prevMessage => prevMessage.id === message.id))
                        .map((message, index, messages) => ({
                            ...message,
                            approxOffset: prev.height + index * 50,
                            processed: false,
                            self: message.user_id === userInfo.id,
                            same: index >= 1
                                ? messages[index].user_id === messages[index - 1].user_id
                                : messages[index].user_id === prev.all[prev.all.length - 1].user_id
                        }));
                    const newState = [...prev.all, ...all]
                    return { ...prev, count: totalCount, all: newState, height: prev.height + all.length * 50 }
                });
            })
            .catch(ex => console.log(ex))
    }
    return (
        <>
            <div className="chat-container">
                <div style={{ maxHeight: '250px', minHeight: '250px', overflow: 'auto' }} onScroll={handleScroll}>
                    <ul className="chat" style={{ height: `${messages.height}px` }}>
                        {
                            messages.visible.map(message => {
                                const getHeight = !message.height || !message.processed;
                                return (
                                    <MessageItem
                                        key={message.id}
                                        review={message.review}
                                        getHeight={getHeight}
                                        id={message.id}
                                        offset={`${message.offset || message.approxOffset}px`}
                                        setMessages={setMessages}
                                        same={message.same}
                                        message={message}
                                        sendMessage={sendMessage}
                                        self={message.self}
                                        added={message.added}
                                        updated={message.updated}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
                {
                    messages.count > 20 &&
                    <div style={{ cursor: 'pointer', backgroundColor: 'rgb(240, 240, 240)', color: 'white', padding: '4px 0px', marginTop: '4px' }} onClick={loadMore}>Load more..</div>
                }
            </div>
            <div className="chat-footer" style={{ maxWidth: '1206px' }} >
                <textarea ref={messageBoxRef} style={{ flex: 1, resize: 'none', borderRadius: '20px' }} />
                <span style={{ width: '60px' }}>
                    <IoMdSend size="30" cursor="pointer" onClick={() => sendMessage(0)} />
                </span>
            </div>
        </>
    )
}
export default React.memo(Chat)