import { useState, useRef } from "react";

const useWebSocket = (state) => {
    const webSocketRef = useRef(null);
    const [open, setOpen] = useState(state);

    const changeState = (state, webSocket) => {
        setOpen(state);
        webSocketRef.current = webSocket
    }

    return [webSocketRef, changeState];
}

export default useWebSocket;