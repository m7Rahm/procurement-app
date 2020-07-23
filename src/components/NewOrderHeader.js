import React, { useEffect, useState } from 'react'

const NewOrderHeader = (props) => {
    const [departments, setDepartments] = useState([]);
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments')
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(err => console.log(err))
    }, [])
    const handleChange = (e) => {
        const type = e.target.name === 'deadline' ? 'setDeadline' : 'setDepid'
        props.dispatch({type: type, payload: { value: e.target.value }})
    }
    return (
        <div>
            <div className="new-order-header">
                <div>
                    <label htmlFor="destination">Təyinatı</label>
                    <br />
                    <select onChange={handleChange} name="assignmentid" value={props.departmentid} type="text">
                        {
                            departments.map((department, index) =>
                                <option key={index} value={department.id}>{department.name}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    <label required={true} htmlFor="deadline">Deadline</label>
                    <br />
                    <input onChange={handleChange} name="deadline" value={props.deadline} required={true} type="date" />
                </div>
            </div>
        </div>
    )
}
export default NewOrderHeader