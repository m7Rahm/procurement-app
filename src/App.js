import React, { useState, Suspense } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import jwt from 'jsonwebtoken'
import PrivateRoute from './components/Misc/PrivateRoute'
import SelectModule from './pages/SelectModule'
import './styles/App.css'
import { modules } from './data/data'
import Loading from './components/Misc/Loading'
const Login = React.lazy(() => import('./pages/Login'));

const getUserData = () => {
  if (localStorage.getItem('token')) {
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
  return (
    <BrowserRouter>
      <TokenContext.Provider value={[token, setToken]}>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path="/login" render={() => !token.token ?
              <Login setToken={setToken} />
              : <Redirect to="/" />}>
            </Route>
            <PrivateRoute token={token.token} path="/">
              <SelectModule />
            </PrivateRoute>
          </Switch>
        </Suspense>
      </TokenContext.Provider>
    </BrowserRouter>
  );
}
export default App
export const TokenContext = React.createContext();
