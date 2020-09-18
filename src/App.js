import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'
import AppComponent from './components/App'
// import useWebSocket from './hooks/useWebSocket'

const App = () => {
  const token = localStorage.getItem('token');
  // console.log(token);
  // localStorage.removeItem('token')
  return (
    // wSockConnected &&

    <BrowserRouter>
      <Switch>
        <Route path="/login" render={() => !token ? <Login /> : <Redirect to="/"/>}>
        </Route>
        <PrivateRoute path="/">
          <AppComponent/>
        </PrivateRoute>
      </Switch>
    </BrowserRouter>
  );
}
export default App