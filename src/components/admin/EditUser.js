import React, { useEffect, useState, useRef, useContext } from "react"
import {
    FaLock,
    FaUnlock
} from "react-icons/fa"
import {
    IoMdCheckmarkCircle
} from "react-icons/io"
import { TokenContext } from "../../App"
const userDataInit = {
    username: "",
    full_name: "",
    email: "",
    passport_data: "",
    fin: "",
    structure_dependency_id: "",
    role_id: "-1",
    modules: "",
    position_id: "0",
    filial_id: "",
    id: ""
}
const EditUser = (props) => {
    const { id, closeModal } = props;
    const [userData, setUserData] = useState(userDataInit);
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [isProtected, setIsProtected] = useState(id !== undefined);
    const [resetPasswordVisibility, setResetPasswordVisibility] = useState(false);
    const [password, setPassword] = useState("");
    const [showAlertModal, setShowAlertModal] = useState(false);
    const repeatPass = useRef(null);
    const positionRef = useRef(null);
    const updateUserData = () => {
        const data = JSON.stringify({
            username: userData.username,
            fullName: userData.full_name,
            email: userData.email,
            passportData: userData.passport_data,
            fin: userData.fin,
            structureid: userData.structure_dependency_id,
            role: userData.role_id,
            id: id,
            vezifeN: positionRef.current.value
        });
        fetch("http://192.168.0.182:54321/api/update-user-data", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json",
                "Content-Length": data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === "success")
                    closeModal()
            })
            .catch(ex => console.log(ex))
    }
    const addNewUser = () => {
        const data = JSON.stringify({ ...userData, vezifeN: positionRef.current.value });
        fetch('http://192.168.0.182:54321/api/add-new-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'Authorization': 'Bearer ' + token
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success') {
                    props.updateList(0);
                    props.closeModal();
                }
            })
    }
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        if (id !== undefined)
            fetch(`http://192.168.0.182:54321/api/user/${id}`, {
                signal: abortController.signal,
                headers: {
                    "Authorization": "Bearer " + token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ.length && mounted) {
                        setUserData(respJ[0]);
                        const vezife = respJ[0].vezife_n;
                        positionRef.current.value = vezife || ""
                    }
                })
                .catch(ex => console.log(ex))
        return () => {
            mounted = false;
            abortController.abort()
        }
    }, [id, token]);

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setUserData(prev => ({ ...prev, [name]: value }));
    }
    const handleProtectionChange = () => {
        setIsProtected(prev => !prev);
        setResetPasswordVisibility(false);
    }
    const handlePasswordReset = () => {
        setResetPasswordVisibility(true)
    }
    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password)
    }
    const changePassword = () => {
        if (password === repeatPass.current.value) {
            const data = JSON.stringify({
                password: password,
                id: id
            })
            fetch("http://192.168.0.182:54321/api/reset-password", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                    "Content-Length": data.length
                },
                body: data
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (respJ[0].result === "success")
                        setResetPasswordVisibility(false);
                    setShowAlertModal(true);
                })
                .catch(ex => console.log(ex))
        }
        else
            alert("Şifrəni təkrar yığan zaman səhvə yol vermisiniz")
    }
    return (
        <div className="edit-user">
            {
                id !== undefined &&
                <>
                    {
                        isProtected
                            ? <FaLock onClick={handleProtectionChange} />
                            : <FaUnlock onClick={handleProtectionChange} />
                    }
                </>
            }
            <div>
                <h1>Şəxsi məlumatlar</h1>
                <div>
                    <div className="section-row">
                        <div>
                            <label>Ad, Soyad, Ata adı</label>
                            <input
                                disabled={isProtected}
                                value={userData.full_name}
                                name="full_name"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label>ID</label>
                            <input disabled={isProtected} value={userData.passport_data} name="passport_data" onChange={handleChange} />
                        </div>
                        <div>
                            <label>FIN</label>
                            <input disabled={isProtected} value={userData.fin || ""} name="fin" onChange={handleChange} />
                        </div>
                    </div>
                    <div className="section-row">
                        <div>
                            <label>Email</label>
                            <input disabled={isProtected} value={userData.email} name="email" onChange={handleChange} />
                        </div>
                        <div>
                            <label>Vəzifə</label>
                            <input disabled={isProtected} ref={positionRef} name="vezife" />
                        </div>
                        <StructureInfo
                            token={token}
                            isProtected={isProtected}
                            handleChange={handleChange}
                            userData={userData}
                        />
                    </div>
                </div>
            </div>
            <Roles token={token} userData={userData} isProtected={isProtected} setUserData={setUserData} />
            <div style={{ paddingBottom: "20px", overflow: "hidden" }}>
                <h1>Təhlükəsizlik</h1>
                <div>
                    <div className="security">
                        <input disabled={isProtected} value={userData.username} name="username" onChange={handleChange} />
                        {
                            !isProtected && id !== undefined ?
                                <>
                                    <div onClick={handlePasswordReset}>Şifrəni bərpa et</div>
                                    {
                                        resetPasswordVisibility &&
                                        <>
                                            <input
                                                placeholder="yeni şifrə"
                                                style={{ margin: "20px 0px" }}
                                                value={password}
                                                name="password"
                                                type="password"
                                                onChange={handlePasswordChange}
                                            />
                                            <input
                                                placeholder="şifrəni təkrar daxil edin"
                                                style={{ margin: "20px 0px" }}
                                                name="repeat-pass"
                                                ref={repeatPass}
                                                type="password"
                                            />
                                            <div onClick={changePassword}>Done</div>
                                        </>
                                    }
                                </>
                                : id === undefined &&
                                <input value={userData.password} placeholder="password" type="password" name="password" onChange={handleChange} />
                        }
                    </div>
                </div>
                {
                    !isProtected &&
                    <div onClick={id !== undefined ? updateUserData : addNewUser} className="save-button">Yadda saxla</div>
                }
            </div>
            {
                showAlertModal &&
                <div className="operation-result">
                    <div>
                        <IoMdCheckmarkCircle size="88" />
                    </div>
                Əməliyyat uğurla tamamlandı
			</div>
            }
        </div >
    )
}
export default EditUser
const Roles = (props) => {
    const { token, userData, isProtected, setUserData } = props;
    const [roles, setRoles] = useState([]);
    const availableModules = userData.modules.length !== 0 ? userData.modules.split(",") : []
    const handleRoleChange = (e) => {
        const value = e.target.value;
        const role = roles.find(role => role.id.toString() === value)
        const availableModules = role ? role.modules : "";
        setUserData(prev => ({ ...prev, role_id: value, modules: availableModules }))
    }
    useEffect(() => {
        let mounted = true;
        const abortController = new AbortController();
        fetch(`http://192.168.0.182:54321/api/roles`, {
            signal: abortController.signal,
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (mounted)
                    setRoles(respJ)
            })
            .catch(ex => console.log(ex));
        return () => {
            abortController.abort();
            mounted = false
        }
    }, [token])
    return (
        <div style={{ minHeight: "250px" }}>
            <h1>Yetkilər</h1>
            <div>
                <div>
                    <label>Status</label>
                    <select
                        value={userData.role_id}
                        onChange={handleRoleChange}
                        disabled={isProtected}
                    >
                        <option value={-1}>-</option>
                        {
                            roles.map(role =>
                                <option value={role.id} key={role.id}>{role.name}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    <label>Yektisi olduğu menular</label>
                    <ul>
                        {
                            availableModules.map(menu =>
                                <li className="menu-item" key={menu}>{menu}</li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}
const StructureInfo = (props) => {
    const { token, isProtected, userData, handleChange } = props;
    const [departments, setStructures] = useState([]);
    useEffect(() => {
        fetch(`http://192.168.0.182:54321/api/departments`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                setStructures(respJ)
            })
            .catch(ex => console.log(ex));
    }, [token]);
    return (
        <>
            <div>
                <label>Struktur</label>
                <select
                    disabled={isProtected}
                    value={userData.structure_dependency_id || ""}
                    name="structure_dependency_id"
                    onChange={handleChange}
                >
                    <option value={-1}>-</option>
                    {
                        departments.map(department =>
                            <option value={department.id} key={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </div>
        </>
    )
}