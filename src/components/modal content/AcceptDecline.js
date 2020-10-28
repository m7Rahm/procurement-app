import React, { useState, useRef, useEffect } from 'react'
import VisaForwardPerson from '../VisaForwardPerson'
const token = localStorage.getItem('token');
const AcceptDecline = (props) => {
    const tranid = props.tranid;
    const backgroundColor = props.backgroundColor;
    const action = props.action;
    const [comment, setComment] = useState('');
    const [empList, setEmpList] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const empListRef = useRef(null);
    const placeholder = action
        ? "Əlavə qeydlərinizi daxil edin.."
        : "Səbəb göstərin";
    useEffect(() => {
        if (action === 5) {
            fetch('http://172.16.3.101:54321/api/emplist', {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    empListRef.current = respJ;
                    setEmpList(respJ);
                })
                .catch(err => console.log(err));
        }
    }, [action]);
    const handleClick = () => {
        if (comment !== '' || action !== -1) {
            const data = {
                // receivers: [],
                action: action,
                // empVersion: props.version,
                comment,
                // forwardedVersion: props.version
            }
            fetch(`http://172.16.3.101:54321/api/accept-decline/${tranid}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': JSON.stringify(data).length,
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(data)
                })
                .then(resp => resp.json())
                .then(respJ => {
                    console.log(respJ);
                    if (respJ[0].result === 'success')
                        props.handleModalClose([respJ[0].head_id], respJ[1])
                })
                .catch(err => console.log(err))
        }
    }
    const handleForwardOrder = () => {
        const data = {
            receivers: receivers.map(receiver => [receiver.id]),
            comment
        }
        fetch(`http://172.16.3.101:54321/api/forward-order/${tranid}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(data).length,
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success')
                    props.handleModalClose([respJ[0].head_id], respJ[1])
            })
            .catch(ex => console.log(ex))
    }
    const handleTextChange = (e) => {
        setComment(e.target.value);
    }
    const handleSearchChange = (e) => {
        const str = e.target.value.toLowerCase();
        const searchResult = empListRef.current.filter(emp => emp.full_name.toLowerCase().includes(str));
        setSearchQuery(str);
        setEmpList(searchResult);
    }

    const handleSelectChange = (employee) => {
        const res = receivers.find(emp => emp.id === employee.id);
        const newReceivers = !res ? [...receivers, employee] : receivers.filter(emp => emp.id !== employee.id);
        setReceivers(newReceivers);
        setSearchQuery('');
    }
    return (
        <div className="accept-decline">
            <div>
                <textarea style={{ minHeight: '150px' }} placeholder={placeholder} value={comment} onChange={handleTextChange}>
                </textarea>
                {
                    action === 5 &&
                    <div style={{minHeight: '231px'}}>
                        <div>
                            <input type="text" className="search-with-query" placeholder="İşçinin adını daxil edin.." value={searchQuery} onChange={handleSearchChange}></input>
                        </div>
                        <ul className="employees-list">
                            {
                                empList.map(employee =>
                                    <li key={employee.id} value={employee.id} onClick={() => handleSelectChange(employee)}>
                                        {employee.full_name}
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                }
            </div>
            {
                action === 5 &&
                <div>
                    {
                        receivers.map(emp => <VisaForwardPerson key={Math.random()} emp={emp} handleSelectChange={handleSelectChange} />)
                    }
                </div>
            }
            <div onClick={action !== 5 ? handleClick : handleForwardOrder} style={{ backgroundColor: backgroundColor }}>
                Göndər
            </div>
        </div>
    )
}
export default AcceptDecline