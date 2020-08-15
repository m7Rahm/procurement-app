import React, { useRef, useState, useEffect } from 'react';
import Visas from './pages/Visas'
import MyOrders from './pages/MyOrders'
import logo from './logo.svg'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {
  IoMdMenu
} from 'react-icons/io'
import LeftSidePane from './components/LeftSidePane';
import Drafts from './pages/Drafts';
import Archived from './pages/Archived';
import Inbox from './pages/Inbox'
// import useWebSocket from './hooks/useWebSocket'

const App = () => {
  const leftPaneRef = useRef(null);
  const [backgroundVisibility, setBackgroundVisibility] = useState(false);
  const [wSockConnected, setWSockConnected] = useState(false);
  const webSocketRef = useRef(null)

  useEffect(() => {
    const webSocket = new WebSocket('ws://172.16.3.101:12345');
    webSocket.onopen = () => {
      const data = {
        action: "recognition",
        person: 73 // todo: get from session
      }
      console.log('connected');
      webSocket.send(JSON.stringify(data));
      // setWebSocketRef(webSocket);
      webSocketRef.current = webSocket
      setWSockConnected(true);
    }
    return () => {
      webSocket.close();
      setWSockConnected(false);
      console.log('connection closed');
      // setWebSocketRef(null);
    }
  }, [])
  const handleNavClick = () => {
    leftPaneRef.current.classList.toggle('left-side-pane-open');
    setBackgroundVisibility(prev => !prev)
  }
  useEffect(() => {
    const closeNav = (e) => {
      if (e.keyCode === 27 && leftPaneRef.current.classList.contains('left-side-pane-open')) {
        leftPaneRef.current.classList.toggle('left-side-pane-open');
        setBackgroundVisibility(prev => !prev)
      }
    }
    document.addEventListener('keyup', closeNav, false);
    return () => document.removeEventListener('keyup', closeNav, false)
  }, []);
  return (
    wSockConnected &&
    <BrowserRouter>
        <>
          <nav>
            <ul>
              <li>
                <div>
                  <div className="left-side-toggle">
                    <IoMdMenu size="24" cursor="pointer" color="#606060" onClick={handleNavClick} />
                  </div>
                  <div>
                    <img style={{ height: '32px' }} src={logo} alt='user pic'></img>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
          {
            backgroundVisibility &&
            <div onClick={handleNavClick} style={{ position: 'fixed', height: '100%', width: '100%', top: 0, left: 0, background: 'rgba(0, 0, 0, 0.6)', zIndex: 2 }}>
            </div>
          }
        </>
        <LeftSidePane ref={leftPaneRef} handleNavClick={handleNavClick} />
        <Switch>
          <Route path="/visas">
            <Visas webSocketRef={webSocketRef} />
          </Route>
          <Route path="/archived">
            <Archived />
          </Route>
          <Route path="/drafts">
            <Drafts webSocketRef={webSocketRef} />
          </Route>
          <Route path="/inbox">
            <Inbox webSocketRef={webSocketRef} />
          </Route>
          <Route path="/">
            <MyOrders webSocketRef={webSocketRef} />
          </Route>
        </Switch>
    </BrowserRouter>
  );
}
export default App