import React, { useState, useEffect, useRef } from 'react'
import VisaForwardPerson from '../VisaForwardPerson'
import { token } from '../../data/data'
const AcceptDecline = (props) => {
    const [comment, setComment] = useState('');
    const [empList, setEmpList] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const empListRef = useRef(null);
    const placeholder = props.accept
        ? "Əlavə qeydlərinizi daxil edin.."
        : "Etirazın səbəbini göstərin";
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/emplist', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                setEmpList(respJ);
                empListRef.current = respJ;
            })
            .catch(err => console.log(err));
    }, []);
    const handleClick = () => {
        const data = {
            receivers,
            action: props.accept ? 1 : 0,
            empVersion: props.version,
            comment,
            forwardedVersion: props.version
        }
        fetch(`http://172.16.3.101:54321/api/accept-decline/${props.current}`,
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
                if(respJ[0].result === 'success')
                props.closeModal([...receivers, respJ[0].head_id], respJ[1])
            })
            .catch(err => console.log(err))
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
                <textarea style={{ minHeight: '231px' }} required={!props.accept} placeholder={placeholder} value={comment} onChange={handleTextChange}>

                </textarea>
                {
                    props.accept &&
                    <div>
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
                props.accept &&
                <div>
                    {
                        receivers.map(emp => <VisaForwardPerson key={Math.random()} emp={emp} handleSelectChange={handleSelectChange} />)
                    }
                </div>
            }
            <div onClick={handleClick} style={{ backgroundColor: props.backgroundColor }}>
                Göndər
            </div>
        </div>
    )
}
export default AcceptDecline