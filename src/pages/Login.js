import React, { useState, useRef, useEffect } from 'react'
import {
    useHistory
} from 'react-router-dom'
import {
    IoIosCloseCircle
} from 'react-icons/io'
import jwt from 'jsonwebtoken'
import { modules } from '../data/data'
const Login = (props) => {
    const [userCreds, setUserCreds] = useState({ username: '', password: '' });
    const history = useHistory();
    const [isPasswordCorrect, setIsPasswordCorrect] = useState(true);
    const operationResultDiv = useRef(null);
    const count = useRef(0)
    useEffect(() => {
        if (operationResultDiv.current)
            operationResultDiv.current.addEventListener('animationend', () => {
                count.current += 1;
                if (count.current === 2) {
                    count.current = 0;
                    setIsPasswordCorrect(true)
                }
            }, false)
    }, [isPasswordCorrect])
    const handleLoginCheck = () => {
        fetch('http://192.168.0.182:54321/api/login', {
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
                    const decoded = jwt.decode(respJ.token);
                    const id = decoded.data.id;
                    const userModules = decoded.data.modules.split(',');
                    const previliges = decoded.data.previliges.split(',');
                    const userMods = modules.filter(module => userModules.find(userModule => userModule === module.text));
                    const structureid = decoded.data.structureid;
                    const fullName = decoded.data.fullName;
                    const userData = {
                        modules: userMods, previliges: previliges, userInfo: {
                            id,
                            structureid,
                            fullName
                        }
                    }
                    props.setToken({ token: respJ.token, userData: userData });
                    history.replace('/');
                }
            })
            .catch(ex => console.log(ex))
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserCreds(prev => ({ ...prev, [name]: value }))
    }
    const handleKeyUp = (e) => {
        if (e.keyCode === 13)
            handleLoginCheck()
    }
    return (
        <div className="login-container">
            <div className="login">
                <div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={handleChange}
                            onKeyUp={handleKeyUp}
                            value={userCreds.username}
                            id="username"
                            name="username"
                            type="text"
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={handleChange}
                            value={userCreds.password}
                            onKeyUp={handleKeyUp}
                            id="password"
                            name="password"
                            type="password"
                        />
                    </div>
                    <div tabIndex="3" onClick={handleLoginCheck} className="log-in-button">login</div>
                </div>
            </div>
            {
                !isPasswordCorrect &&
                <div ref={operationResultDiv} style={{ backgroundColor: '#D93404' }} className="operation-result">
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