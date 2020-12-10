import React, { useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import PrivateRoute from './components/Misc/PrivateRoute'
import SelectModule from './pages/SelectModule'
import './App.css'

export const TokenContext = React.createContext();
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  // localStorage.removeItem('token');
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login" render={() => !token ? <Login setToken={setToken} /> : <Redirect to="/"/>}>
        </Route>
        <PrivateRoute path="/">
          <TokenContext.Provider value={[token, setToken]}>
            <SelectModule/>
          </TokenContext.Provider>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}
export default App