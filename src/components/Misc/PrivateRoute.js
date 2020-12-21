import React, { useContext } from 'react'
import {
    Redirect,
    Route
} from 'react-router-dom'
import { TokenContext } from '../../App'
const PrivateRoute = ({ children, ...rest }) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    return (
        token
            ? <Route {...rest}>
                {children}
            </Route>
            : <Redirect to="/login" />
    )
}
export default PrivateRoute