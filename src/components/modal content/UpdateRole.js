import React, { useState, useRef } from 'react'
import {
    IoMdClose,
    IoMdAdd
} from 'react-icons/io'
import { availableLinks, availableOperations } from '../../data/data'

const UpdateRole = (props) => {
    const [roleData, setRoleData] = useState(props.role);
    const [menus, setMenus] = useState(props.role.available_menus === '' ? [] : props.role.available_menus.split(','));
    const [previliges, setPreviliges] = useState(props.role.previliges === '' ? [] : props.role.previliges.split(','));
    const selectPrevRef = useRef(null);
    const selectMenusRef = useRef(null);
    console.log(roleData)
    const saveChanges = () => {
        fetch('http://172.16.3.101:54321/api/update-role', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + props.token,
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(roleData).length
            },
            body: JSON.stringify(roleData)
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success') {
                    if (roleData.id !== -1)
                        props.setRoles(prev => prev.map(role => role.id === roleData.id ? roleData : role));
                    else
                        props.setRoles(prev => [...prev, { ...roleData, id: respJ[0].id }]);
                    props.closeModal();
                }
            })
            .catch(ex => console.log(ex))
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setRoleData(prev => ({...prev, [name]: value}))
    }
    const removeMenu = (menu) => {
        setMenus(prev => {
            const newMenus = prev.filter(prevMenu => prevMenu !== menu);
            const reduced = newMenus.reduce((sum, current, index) => {
                const last = index !== newMenus.length - 1 ? ',' : '';
                return sum + current + last
            }, '');
            setRoleData(prev => ({...prev, available_menus: reduced }))
            return newMenus
        })
    }
    const removePrevilige = (previlige) => {
        setPreviliges(prev => {
            const newPrevs = prev.filter(prevPrevilige => prevPrevilige !== previlige);
            const reduced = newPrevs.reduce((sum, current, index) => {
                const last = index !== newPrevs.length - 1 ? ',' : '';
                return sum + current + last
            }, '');
            setRoleData(prev => ({...prev, previliges: reduced }))
            return newPrevs
        })
    }
    const addMenu = () => {
        const menu = selectMenusRef.current.value;
        setMenus(prev => {
            const newPrevs = [...prev, menu];
            const reduced = newPrevs.reduce((sum, current, index) => {
                const last = index !== newPrevs.length - 1 ? ',' : '';
                return sum + current + last
            }, '');
            setRoleData(prev => ({...prev, available_menus: reduced }))
            return newPrevs
        })
    }
    const addPrev = () => {
        const previlige = selectPrevRef.current.value;
        setPreviliges(prev => {
            const newMenus = [...prev, previlige];
            const reduced = newMenus.reduce((sum, current, index) => {
                const last = index !== newMenus.length - 1 ? ',' : '';
                return sum + current + last
            }, '');
            setRoleData(prev => ({...prev, previliges: reduced }))
            return newMenus
        })
    }
    return (
        <div>
            <div className="update-role">
                <input value={roleData.name} name="name" onChange={handleChange} />

                <p>
                    Menular
                    <IoMdAdd size="20" onClick={addMenu} />
                    <select ref={selectMenusRef}>
                        {
                            availableLinks.map(link => {
                                if (menus.indexOf(link) < 0)
                                    return (
                                        <option key={link}>{link}</option>
                                    )
                                else
                                    return null;
                            })
                        }
                    </select>
                </p>
                <div className="role-block">
                    {
                        menus.map((menu, index) =>
                            <div key={index}>{menu}<IoMdClose onClick={() => removeMenu(menu)} /></div>
                        )
                    }
                </div>
                <p>
                    Yetkilər
                    <IoMdAdd size="20" onClick={addPrev} />
                    <select ref={selectPrevRef}>
                        {
                            availableOperations.map(previlige => {
                                if (previliges.indexOf(previlige) < 0)
                                    return (
                                        <option key={previlige} value={previlige}>{previlige}</option>
                                    )
                                else
                                    return null;
                            })
                        }
                    </select>
                </p>
                <div className="role-block">
                    {
                        previliges.map((previlige, index) =>
                            <div key={index}>{previlige}<IoMdClose onClick={() => removePrevilige(previlige)} /></div>
                        )
                    }
                </div>
                <div
                    style={{backgroundColor: '#F4B400'}}
                    className='save-button'
                    onClick={saveChanges}
                >Yadda saxla</div>
            </div>
        </div>
    )
}

export default UpdateRole