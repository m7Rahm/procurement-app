import React, { useState, useContext, useEffect } from 'react'
import EditOrderTableRow from './EditOrderTableRow'
import { TokenContext } from '../../App'
const EditOrderRequest = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0];
    const ordNumb = props.current;
    const version = props.version;
    const [orderState, setOrderState] = useState([]);
    const [categories, setCategories] = useState({ all: [], main: [] });
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/material-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const main = respJ.filter(category => category.parent_id === 34)
                setCategories({ all: respJ, main: main });
            })
            .catch(err => console.log(err))
    }, [token]);
    useEffect(() => {
        fetch(`http://172.16.3.101:54321/api/get-order-req-data?numb=${ordNumb}&vers=${version}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const orderRows = respJ.map(row => ({...row, id: Math.random().toString()}))
                setOrderState(orderRows)
            })
            .catch(ex => console.log(ex))
    }, [ordNumb, version, token]);
    const handleSendClick = () => {

    }
    return (
        <div className="modal-content-new-order">
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Kateqoriya</div>
                    <div>Alt-Kateqoriya</div>
                    <div>Məhsul</div>
                    <div style={{ width: '170px', maxWidth: '200px' }}>Kod</div>
                    <div style={{ maxWidth: '140px' }}>Say</div>
                    <div>Kurasiya</div>
                    <div>Büccə</div>
                    <div>Əlavə məlumat</div>
                    <div> </div>
                </li>
                {
                    orderState.map((row, index) =>
                        <EditOrderTableRow
                            row={row}
                            key={row.id}
                            index={index}
                            setOrderState={setOrderState}
                            categories={categories}
                            token={token}
                            ordNumb={ordNumb}
                            version={version}
                        />
                    )
                }
            </ul>
            <div className="send-order" onClick={handleSendClick}>
                Göndər
      </div>
        </div>
    )
}
export default EditOrderRequest