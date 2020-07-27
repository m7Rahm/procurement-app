import React from 'react'

const NewOrderHeader = (props) => {
    // const [departments, setDepartments] = useState([]);
    // useEffect(() => {
    //     fetch('http://172.16.3.101:54321/api/departments')
    //         .then(resp => resp.json())
    //         .then(respJ => setDepartments(respJ))
    //         .catch(err => console.log(err))
    // }, [])
    const handleChange = (e) => {
        const type = e.target.name === 'deadline' ? 'setDeadline' : 'setAssign'
        props.dispatch({type: type, payload: { value: e.target.value }})
    }
    return (
        <div>
            <div className="new-order-header">
                <div>
                    <label htmlFor="destination">Təyinatı</label>
                    <br />
                    <input type="text" placeholder="Təyinat.." name="assignment" onChange={handleChange} value={props.assignment}></input>
                    {/* <select onChange={handleChange} name="assignment" value={props.assignment} type="text">
                        {
                            departments.map((department, index) =>
                                <option key={index} value={department.id}>{department.name}</option>
                            )
                        }
                    </select> */}
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