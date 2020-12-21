import React, { useEffect, useState, useContext } from 'react'
import { UserDataContext } from '../../../pages/SelectModule'
const NewOrderHeader = (props) => {
    const { state, dispatch, token } = props;
    const [structures, setStructures] = useState([]);
    const userDataContext = useContext(UserDataContext);
    const userData = userDataContext[0];
    const structureid = userData.userInfo.structureid;
    const dependents = structures.filter(structure => structure.dependent_id === structureid);
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setStructures(respJ))
            .catch(ex => console.log(ex))
    }, [token])
    const handleChange = (e) => {
        const type = e.target.name;
        const value = (e.target.value)
        dispatch({ type: type, payload: { value: value } })
    }
    return (
        <div>
            <div className="new-order-header">
                {
                    dependents.length !== 0 &&
                    <div>
                        <label htmlFor="category">Təyinat</label>
                        <br />
                        <select value={state.structure} onChange={handleChange} name="setStructure">
                            <option value="-1">-</option>
                            {
                                dependents.map(structure =>
                                    <option key={structure.id} value={structure.id}>{structure.name}</option>
                                )
                            }
                        </select>
                    </div>
                }
                <div style={{ float: 'right' }}>
                    <label htmlFor="setOrderType">Sifariş növü</label>
                    <br />
                    <select name="setOrderType" value={state.orderType} onChange={handleChange}>
                        <option value={0}>Mal-Material</option>
                        <option value={1}>Xidmət</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
export default NewOrderHeader