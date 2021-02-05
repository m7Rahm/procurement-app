import React, { useContext, useEffect, useRef, useState } from 'react'
import MessageItem from '../VisaCards/MessageItem'
import { TokenContext } from '../../App'
import { IoMdSend } from 'react-icons/io'
const Chat = (props) => {
    const { loadMessages } = props;
    const tokenContext = useContext(TokenContext);
    const userInfo = tokenContext[0].userData.userInfo;
    const messageBoxRef = useRef(null);
    const active = useRef(0);
    const [messages, setMessages] = useState({ all: [], visible: [], height: '250px', count: 0, start: 0, end: 0 });
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        setMessages(prev => {
            const indexStart = prev.all.findIndex(message => message.offset >= offsetTop - 150);
            const bottomEdge = offsetTop + 350 <= prev.height ? offsetTop + 350 : prev.height;
            const indexes = prev.all.filter(message => message.offset <= bottomEdge);
            const indexEnd = indexes.length - 1;
            const visible = prev.all.slice(indexStart, indexStart + indexEnd);
            return ({ ...prev, visible, start: indexStart, end: indexEnd })
        })
    }
    useEffect(() => {
        loadMessages()
            .then(resp => resp.json())
            .then(respJ => {
                active.current = 0;
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                const all = respJ.map((message, index) => ({ ...message, offset: index * 50, processed: false }));
                if (all.length !== 0)
                    all[0].offset = 0;
                const indexEnd = all.findIndex(message => message.offset >= 250);
                const visible = all.slice(0, indexEnd);
                setMessages({ count: totalCount, all, visible, height: totalCount * 50, start: 0, end: indexEnd });
            })
            .catch(ex => console.log(ex))
    }, [props.token, loadMessages]);
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
                    if (respJ.length !== 0) {
                        setMessages(prev => {
                            const all = [{ user_id: userInfo.id, review: messageBoxRef.current.value, date_time: 'Just Now', count: 0, id: respJ[0].id, processed: false }, ...prev.all].map(message => ({...message, processed: false }))
                            all[0].offset = 0;
                            const visible = all.slice(prev.start, prev.end);
                            return ({
                                ...prev,
                                all,
                                visible,
                                height: prev.height + 50,
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
                    const all = respJ.map((message, index) => ({ ...message, offset: prev.height + index * 50, processed: false }));
                    return { ...prev, count: prev.count + totalCount, all: [...prev.all, ...all], height: prev.height + totalCount * 50 }
                });
            })
            .catch(ex => console.log(ex))
    }
    return (
        <>
            <div className="chat-container">
                <div style={{ maxHeight: '250px', overflow: 'auto' }} onScroll={handleScroll}>
                    <ul className="chat" style={{ height: `${messages.height}px` }}>
                        {
                            messages.visible.map((message, index, messages) => {
                                const getHeight = !message.height || !message.processed;
                                const self = message.user_id === userInfo.id;
                                const same = index - 1 >= 0 ? messages[index].user_id === messages[index - 1].user_id : false
                                return (
                                    <MessageItem
                                        key={message.id}
                                        review={message.review}
                                        getHeight={getHeight}
                                        id={message.id}
                                        offset={`${message.offset}px`}
                                        setMessages={setMessages}
                                        same={same}
                                        message={message}
                                        sendMessage={sendMessage}
                                        self={self}
                                    />
                                )
                            })
                        }
                    </ul>
                </div>
                {
                    messages.count > 20 &&
                    <div onClick={loadMore}>Load more..</div>
                }
            </div>
            <div className="chat-footer" >
                <textarea ref={messageBoxRef} style={{ flex: 1, resize: 'none', borderRadius: '20px' }} />
                <span style={{ width: '60px' }}>
                    <IoMdSend size="30" cursor="pointer" onClick={() => sendMessage(0)} />
                </span>
            </div>
        </>
    )
}
export default React.memo(Chat)