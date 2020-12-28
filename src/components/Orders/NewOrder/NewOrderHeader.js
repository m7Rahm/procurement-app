import React, { useEffect, useState, useContext } from 'react'
import { TokenContext } from '../../../App'
const NewOrderHeader = (props) => {
    const { orderInfo, setOrderInfo, parentGlCategories } = props;
    const [structures, setStructures] = useState([]);
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const userData = tokenContext[0].userData;
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
        const name = e.target.name;
        const value = (e.target.value)
        setOrderInfo(prev => ({ ...prev, [name]: value }))
    }
    return (
        <div>
            <div className="new-order-header">
                {
                    dependents.length !== 0 &&
                    <div>
                        <label htmlFor="category">Təyinat</label>
                        <br />
                        <select value={orderInfo.structure} onChange={handleChange} name="setStructure">
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
                    <label htmlFor="orderType">Sifariş növü</label>
                    <br />
                    <select name="orderType" value={orderInfo.orderType} onChange={handleChange}>
                        <option value={0}>Mal-Material</option>
                        <option value={1}>Xidmət</option>
                    </select>
                </div>
                <div style={{ float: 'left' }}>
                    <label htmlFor="glCategory">Gl kateqoriya</label>
                    <br />
                    <select onChange={handleChange} name="glCategory" value={orderInfo.glCategory}>
                        <option value="-1">-</option>
                        {
                            parentGlCategories.map(category =>
                                <option key={category.id} value={category.id}>{category.name}</option>
                            )
                        }
                    </select>
                </div>
            </div>
        </div>
    )
}
export default NewOrderHeader