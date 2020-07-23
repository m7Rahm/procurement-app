import React, { useEffect, useState } from 'react'

const NewOrderFooter = (props) => {
    const [empList, setEmpList] = useState([])
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/emplist')
            .then(resp => resp.json())
            .then(respJ => setEmpList(respJ))
            .catch(err => console.log(err))
    }, []);
    const handleChange = (e) => {
        const type = e.target.name === 'comment' ? 'setComment' : 'setRec';
        props.dispatch({
            type,
            payload: {
                value: e.target.value
            }
        })
    }
    return (
        <div className="new-order-footer-wrapper">
            <textarea onChange={handleChange} name="comment" value={props.comment} placeholder="Sifariş barədə əlavə qeydlər..." />
            <div className="forwarded-person">
                <label htmlFor="forwardedPerson">Yönləndirilən şəxs</label>
                <br />
                <select value={props.receiverid} onChange={handleChange} name="receiverid">
                    {
                        empList.map((group, index) =>
                            <optgroup key={index} >
                                {
                                    Object.values(group).map(arrs => arrs.map(person =>
                                        <option key={person.id} value={person.id}>{person.full_name}</option>
                                    ))
                                }
                            </optgroup>
                        )
                    }
                </select>
            </div>
        </div>
    )
}
export default React.memo(NewOrderFooter)