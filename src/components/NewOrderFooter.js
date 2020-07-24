import React, { useEffect, useState, useRef } from 'react'
import VisaForwardPerson from './VisaForwardPerson'
const NewOrderFooter = (props) => {
    const [empListState, setEmpListState] = useState([]);
    // const listRef = useRef(null);
    const wrapperRef = useRef(null);
    const empListRef = useRef(null);
    const [searchKey, setSearchKey] = useState('');
    const [receivers, setReceivers] = useState([]);
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/emplist')
            .then(resp => resp.json())
            .then(respJ => {
                setEmpListState(respJ);
                empListRef.current = respJ;
            })
            .catch(err => console.log(err));
        const handleOnOuterClick = (e) => {
            const target = e.target.closest('div');
            
            if(target.id !== 'emp-list-container' && target.id !== 'emp-list-upper' &&  wrapperRef.current.style.overflow === 'visible'){
                wrapperRef.current.style.overflow = 'hidden';
            }
        }
        document.addEventListener('click', handleOnOuterClick, false);
        return () => document.removeEventListener('click', handleOnOuterClick, false)
    }, []);
    const handleTextAreaChange = (e) => {
        props.dispatch({
            action: e.target.name,
            payload: {
                value: e.target.value
            }
        })
    }
    const handleSelectChange = (empid) => {
        props.dispatch({
            action: 'setRec',
            payload: {
                value: empid
            }
        });
        const receiver = empListRef.current.find(emp => emp.id === empid);
        setSearchKey('');
        setReceivers(prev => [...prev, receiver])
    }
    const displayList = () => {
        wrapperRef.current.style.overflow = 'visible';
    }
    const handleSearch = (e) => {
        const str = e.target.value.toLowerCase();
        const searchResult = empListRef.current.filter(emp => emp.full_name.toLowerCase().includes(str));
        setSearchKey(str);
        setEmpListState(searchResult);
    }
    return (
        <div className="new-order-footer-wrapper">
            <div>
                <textarea onChange={handleTextAreaChange} name="comment" value={props.comment} placeholder="Sifariş barədə əlavə qeydlər..." />
                <div className="forwarded-person">
                    <label htmlFor="forwardedPerson">Rəy üçün yönəlt</label>
                    <br />
                    <div id="emp-list-container" ref={wrapperRef} onClick={displayList}>
                        <div id="emp-list-upper">
                            <input type="text" placeholder="İşçinin adını daxil edin.." value={searchKey} onChange={handleSearch}></input>
                        </div>
                        <ul>
                            {
                                empListState.map(employee =>
                                    <li key={employee.id} value={employee.id} onClick={() => handleSelectChange(employee.id)}>
                                        {employee.full_name}
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
            <div>
                {
                    receivers.map((elem, index) => <VisaForwardPerson key={index} id={elem.id} name={elem.full_name} setReceivers={setReceivers} />)
                }
            </div>
        </div>
    )
}
export default React.memo(NewOrderFooter)