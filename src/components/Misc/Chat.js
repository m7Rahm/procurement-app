import React, { useContext, useEffect, useRef, useState } from 'react'
import MessageItem from '../VisaCards/MessageItem'
import { TokenContext } from '../../App'
import { IoMdSend } from 'react-icons/io'
const Chat = (props) => {
    const [messages, setMessages] = useState({ count: 0, content: [] });
    const { loadMessages } = props;
    const tokenContext = useContext(TokenContext);
    const userInfo = tokenContext[0].userData.userInfo;
    const messageBoxRef = useRef(null);
    const sendMessage = (replyto) => {
        const data = {
            replyto: replyto,
            message: messageBoxRef.current.value,
            docid: props.documentid
        }
        props.sendMessage(data)
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ.length === 0) {
                    setMessages(prev =>
                    (
                        {
                            count: prev.count + 1,
                            content: [...prev.content, { user_id: userInfo.id, review: messageBoxRef.current.value, date_time: 'Just Now', count: 0, id: Date.now() }]
                        }
                    ))
                    messageBoxRef.current.value = '';
                }
            })
    }
    useEffect(() => {
        if(props.documentid)
            loadMessages()
                .then(resp => resp.json())
                .then(respJ => {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    setMessages({ count: totalCount, content: respJ });
                })
                .catch(ex => console.log(ex))
    }, [loadMessages, props.documentid]);
    return (
        <>
            <div className="chat-container">
                <ul className="chat">
                    {
                        messages.content.map((message, index, messages) => {
                            const self = message.user_id === userInfo.id;
                            const same = index - 1 >= 0 ? messages[index].user_id === messages[index - 1].user_id : false
                            return (
                                <MessageItem
                                    key={message.id}
                                    same={same}
                                    message={message}
                                    sendMessage={sendMessage}
                                    self={self}
                                />
                            )
                        })
                    }
                </ul>
                {
                    messages.totalCount > 20 &&
                    <div>Load more..</div>
                }
            </div>
            <div style={{ position: 'relative', paddingRight: '60px' }}>
                <textarea ref={messageBoxRef} style={{ width: '100%', resize: 'none' }} />
                <IoMdSend size="30" cursor="pointer" style={{ position: 'absolute', right: '10px' }} onClick={() => sendMessage(0)} />
            </div>
        </>
    )
}
export default React.memo(Chat)