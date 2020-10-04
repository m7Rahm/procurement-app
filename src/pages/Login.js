import React, { useState, useRef } from 'react'
import {
    useHistory
} from 'react-router-dom'
import {
    IoIosCloseCircle
} from 'react-icons/io'
const Login = (props) => {
    const [userCreds, setUserCreds] = useState({username: '', password: ''});
    const history = useHistory();
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
    const operationResultDiv = useRef(null);
    const handleLoginCheck = () => {
        fetch('http://172.16.3.101:54321/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(userCreds).length
            },
            body: JSON.stringify(userCreds)
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (!respJ.token)
                    setIsPasswordCorrect(false);
                else {
                    localStorage.setItem('token', respJ.token);
                    props.setToken(respJ.token);
                    // localStorage.setUserData(JSON.stringify(respJ.data));
                    history.push('/');
                }
            })
            .catch(ex => console.log(ex))
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserCreds(prev => ({...prev, [name]: value}))
    }
    return (
        <div className="login-container">
            <div className="login">
                <div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="username">Username</label>
                        <input onChange={handleChange} value={userCreds.username} name="username" type="text" />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="password">Password</label>
                        <input onChange={handleChange} value={userCreds.password} name="password" type="password" />
                    </div>
                    <div tabIndex="0" onClick={handleLoginCheck} className="log-in-button">login</div>
                </div>
            </div>
            {
                !isPasswordCorrect &&
                <div ref={operationResultDiv} style={{backgroundColor: '#D93404'}} className="operation-result">
                    <div>
                        <IoIosCloseCircle size="88" />
                    </div>
                Daxil etdiyiniz şifrə yanlışdır
			    </div>
            }
        </div>
    )
}
export default Login