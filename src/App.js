import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import jwt from 'jsonwebtoken'
import PrivateRoute from './components/Misc/PrivateRoute'
import SelectModule from './pages/SelectModule'
import './App.css'
import { modules } from './data/data'
export const TokenContext = React.createContext();
const getUserData = () => {
  if (localStorage.getItem('token')){
    const decoded = jwt.decode(localStorage.getItem('token'));
    const id = decoded.data.id;
    const userModules = decoded.data.modules.split(',');
    const previliges = decoded.data.previliges.split(',');
    const userMods = modules.filter(module => userModules.find(userModule => userModule === module.text));
    const structureid = decoded.data.structureid;
    const fullName = decoded.data.fullName;
    return {
      modules: userMods, previliges: previliges, userInfo: {
        id,
        structureid,
        fullName
      }
    }
  }
  else return {}
}
const App = () => {
  const [token, setToken] = useState({ token: localStorage.getItem('token'), userData: getUserData() });
  // localStorage.removeItem('token');
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" render={() => !token.token ? <Login setToken={setToken} /> : <Redirect to="/" />}>
        </Route>
        <PrivateRoute path="/">
          <TokenContext.Provider value={[token, setToken]}>
            <SelectModule />
          </TokenContext.Provider>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}
export default App