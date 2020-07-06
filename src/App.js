import React, { useRef, useState } from 'react';
import Visas from './screens/Visas'
import MyOrders from './screens/MyOrders'
import logo from './logo.svg'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import {
  IoMdMenu
} from 'react-icons/io'
import LeftSidePane from './components/LefSidePane';

const App = () => {
  const leftPaneRef = useRef(null);
  const [backgroundVisibility, setBackgroundVisibility] = useState(false)

  const handleNavClick = () => {
    leftPaneRef.current.classList.toggle('left-side-pane-open');
    setBackgroundVisibility(prev => !prev)
  }
  return (
    <BrowserRouter>
      <div className="app">
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
          <div style={{ position: 'fixed', height: '100%', width: '100%', top: 0, left: 0, background: 'rgba(0, 0, 0, 0.6)', zIndex: 1 }}>
          </div>
        }
      </div>
      <LeftSidePane ref={leftPaneRef} handleNavClick={handleNavClick} />
      <Switch>
        <Route path="/visas">
          <Visas />
        </Route>
        <Route path="/">
          <MyOrders />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}
export default App