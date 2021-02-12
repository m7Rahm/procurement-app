import React, { useEffect, useState, useRef } from 'react'

const VarSizedList = (props) => {
    const [messages, setMessages] = useState({ all: [], visible: [], height: '200px', count: 0, start: 0, end: 0 });
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        setMessages(prev => {
            const indexStart = prev.all.findIndex(message => message.offset >= offsetTop - 50);
            const bottomEdge = offsetTop + 250 <= prev.height ? offsetTop + 250 : prev.height;
            const indexes = prev.all.filter(message => message.offset <= bottomEdge);
            const indexEnd = indexes.length - 1;
            const visible = prev.all.slice(indexStart, indexStart + indexEnd);
            return ({ ...prev, visible, start: indexStart, end: indexEnd })
        })
    }
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/messages/1?from=0&replyto=0&doctype=1&next=0', {
            headers: {
                "Authorization": "Bearer " + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setMessages(prev => {
                    const all = [...prev.all, ...respJ].map((message, index) => ({ ...message, offset: index * 20 }));
                    all[0].offset = 0;
                    const indexEnd = all.findIndex((_, index) => index * 20 >= 250);
                    const visible = all.slice(0, indexEnd);
                    return ({ count: totalCount, all, visible, height: totalCount * 20, start: 0, end: indexEnd })
                });
            })
            .catch(ex => console.log(ex))
    }, [props.token]);
    return (
        <div style={{ maxHeight: '200px', overflow: 'auto' }} onScroll={handleScroll}>
            <ul style={{ position: 'relative', height: `${messages.height}px` }}>
                {
                    messages.visible.map(message => {
                        const getHeight = message.height ? false : true;
                        return (
                            <Item
                                key={message.id}
                                review={message.review}
                                getHeight={getHeight}
                                id={message.id}
                                offset={`${message.offset}px`}
                                setMessages={setMessages}
                            />
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default VarSizedList;

const Item = (props) => {
    const ref = useRef(null);
    const calcHeight = props.getHeight;
    const setMessages = props.setMessages;
    useEffect(
        () => {
            if (calcHeight) {
                setMessages(prev => {
                    const height = prev.all.reduce((sum, item) => sum += item.height || 20, 0);
                    const all = prev.all.map((message, index, arr) => {
                        if (index >= prev.start - 2 && index <= prev.end + 2) {
                            const prevOffset = index - 1 >= 0 ? arr[index - 1].offset : 0;
                            const prevHeight = index - 1 >= 0 ? arr[index - 1].height : 0
                            const offset = prevHeight + prevOffset;
                            return message.id === props.id ? ({ ...message, height: ref.current.clientHeight, offset }) : ({ ...message, offset: offset });
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
        <li ref={ref} style={{ position: 'absolute', top: props.offset }}>{props.review}</li>
    )
}