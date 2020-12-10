import React from 'react'
import {
    Redirect,
    Route
} from 'react-router-dom'
const PrivateRoute = ({ children, ...rest }) => {
    const token = localStorage.getItem('token');
    // console.log(token)
    return (
        token
            ? <Route {...rest}>
                {children}
            </Route>
            : <Redirect to="/login" />
    )
}
export default PrivateRoute