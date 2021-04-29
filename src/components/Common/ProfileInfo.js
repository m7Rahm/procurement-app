import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import { TokenContext } from '../../App';
import useFetch from '../../hooks/useFetch';
import OperationResult from "../Misc/OperationResult"
const Profile = (props) => {
    const usernameRef = useRef(null);
    const nameRef = useRef(null);
    const prevPassRef = useRef(null);
    const passRef = useRef(null);
    const emailRef = useRef(null);
    const [changePassword, setChangePassword] = useState(false);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' });
    const setProfileData = props.setProfileData;
    const tokenContext = useContext(TokenContext);
    const setTokenContext = tokenContext[1];
    const logout = tokenContext[2];
    const fetchUserData = useFetch("GET")
    const fetchUpdateUserData = useFetch("POST")
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        fetchUserData("http://192.168.0.182:54321/api/user/", abortController)
            .then(resp => {
                if (resp.length && mounted) {
                    usernameRef.current.value = resp[0].username;
                    nameRef.current.value = resp[0].full_name;
                    emailRef.current.value = resp[0].email;
                }
            })
            .catch(ex => {
                console.log(ex)
            })
        return () => {
            mounted = false;
            abortController.abort()
        }
    }, [fetchUserData])
    useEffect(() => {
        const onEscPress = (e) => {
            if (e.keyCode === 27) {
                setProfileData({ visible: false })
            }
        }
        window.addEventListener("keyup", onEscPress, false)
        return () => {
            window.removeEventListener("keyup", onEscPress)
        }
    }, [setProfileData]);
    const closeModal = () => {
        setProfileData({ visible: false })
    }
    const handePasswordChangeClick = () => {
        setChangePassword(prev => !prev)
    }
    const handleSend = () => {
        let mounted = true;
        const abortController = new AbortController();
        if (prevPassRef.current.value) {
            const data = {
                userName: usernameRef.current.value,
                fullName: nameRef.current.value,
                email: emailRef.current.value,
                pass: prevPassRef.current.value
            }
            if (passRef.current)
                data.newPass = passRef.current.value;
            fetchUpdateUserData("http://192.168.0.182:54321/api/user-update-creds", data, abortController)
                .then(resp => {
                    if (resp.length === 0 && mounted) {
                        if (!passRef.current) {
                            const fullName = nameRef.current.value;
                            setTokenContext(prev => {
                                const userInfo = prev.userData.userInfo;
                                userInfo.fullName = fullName;
                                return {
                                    ...prev, userData: {
                                        ...prev.userData,
                                        userInfo
                                    }
                                }
                            })
                        } else {
                            logout()
                        }
                    } else if (mounted) {
                        setOperationResult({ visible: true, desc: resp[0].error })
                    }
                })
                .catch(ex => console.log(ex))
        } else {
            setOperationResult({ visible: true, desc: "Şifrəni daxil edin" })
        }
        return () => {
            mounted = false;
            abortController.abort()
        }
    }
    return (
        <div className="profile-info-container">
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                />
            }
            <div className="profile-info-content">
                <div className="header">
                    {props.fullName}
                    <span onClick={closeModal} style={{ float: "right", color: "gray", cursor: "pointer" }}>
                        <FaTimes size="32" />
                    </span>
                </div>
                <div>
                    <input ref={usernameRef} name="username" placeholder="Istifadəçi adı" />
                    <input ref={nameRef} name="name" placeholder="Ad" />
                    <input ref={emailRef} name="email" placeholder="Email" autoComplete="off" />
                    <input ref={prevPassRef} required autoComplete="off" type="password" name="prev-pass" placeholder={!changePassword ? "Şifrəni daxil edin" : "Öncəki şifrə"} />
                    {
                        changePassword &&
                        <input ref={passRef} required type="password" name="pass" placeholder="Yeni şifrə" />
                    }
                    <input type="submit" onClick={handleSend} value="Yadda saxla" />
                    <div onClick={handePasswordChangeClick}>{!changePassword ? "Şifrəni dəyişdir" : "Gizlət"}</div>
                </div>
            </div>
        </div>
    )
}
export default Profile