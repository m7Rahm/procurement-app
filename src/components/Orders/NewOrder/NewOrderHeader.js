import React, { useEffect, useState, useContext } from 'react'
import { TokenContext } from '../../../App'
const NewOrderHeader = (props) => {
    const { orderInfo, setOrderInfo } = props;
    const [structures, setStructures] = useState([]);
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const userData = tokenContext[0].userData;
    const structureid = userData.userInfo.structureid;
    const dependents = structures.filter(structure => structure.parent_id === structureid);
    useEffect(() => {
        fetch('http://192.168.0.182:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setStructures(respJ))
            .catch(ex => console.log(ex))
    }, [token])
    const handleChange = (e) => {
        const name = e.target.name;
        const value = (e.target.value)
        setOrderInfo(prev => ({ ...prev, [name]: value }))
    }
    return (
        <div>
            <div className="new-order-header">
                {
                    dependents.length !== 0 &&
                    <div style={{ margin: "0px 10px"}}>
                        <label htmlFor="category">Təyinat</label>
                        <br />
                        <select value={orderInfo.structure} onChange={handleChange} name="structure">
                            <option value="-1">-</option>
                            {
                                dependents.map(structure =>
                                    <option key={structure.id} value={structure.id}>{structure.name}</option>
                                )
                            }
                        </select>
                    </div>
                }
                <div style={{ float: "right", marginRight: "1px" }}>
                    <label htmlFor="orderType">Sifariş növü</label>
                    <br />
                    <select name="orderType" value={orderInfo.orderType} onChange={handleChange}>
                        <option value={0}>Mal-Material</option>
                        <option value={1}>Xidmət</option>
                    </select>
                </div>
            </div>
        </div>
    )
}
export default NewOrderHeader