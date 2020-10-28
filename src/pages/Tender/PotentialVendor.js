import React, { useState, Suspense, useEffect, useRef } from 'react'
import {
    IoIosAdd
} from 'react-icons/io'
import PontentialVendorRow from '../../components/PotentialVendorRow'
import OfferPictures from '../../components/modal content/OfferPictures'
import VisaForwardPerson from '../../components/VisaForwardPerson'
const vendorDataInit = {
    key: Date.now(),
    className: '',
    name: '',
    voen: '',
    sphere: '',
    ordNumb: '',
    comment: '',
    files: []
}
const PotentialVendor = (props) => {
    const { token } = props;
    const [potentialVendors, setPotentialVendors] = useState([vendorDataInit]);
    const [modalState, setModalState] = useState({ display: false, vendor: null });
    const [empList, setEmpList] = useState([]);
    const [receivers, setReceivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const empListRef = useRef(null);
    const textareaRef = useRef(null);
    useEffect(() => {
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
    }, [token]);
    const addNewVendor = () => {
        const newVendor = { ...vendorDataInit, className: 'new-row', key: Date.now() }
        setPotentialVendors(prev => [...prev, newVendor])
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
    const handleSendClick = () => {

    }
    return (
        <div style={{ paddingTop: '50px', clear: 'both', width: 'auto' }} className="wrapper">
            {
                modalState.display &&
                <Suspense fallback="">
                    <OfferPictures
                        setModalState={setModalState}
                        vendor={modalState.vendor}
                        setPotentialVendors={setPotentialVendors}
                    />
                </Suspense>
            }
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Name</div>
                    <div>VOEN</div>
                    <div>Sphere</div>
                    <div>Comment</div>
                    <div>Attachment</div>
                    <div></div>
                </li>
                {
                    potentialVendors.map((vendor, index) =>
                        <PontentialVendorRow
                            vendor={vendor}
                            key={vendor.key}
                            index={index + 1}
                            setModalState={setModalState}
                            setPotentialVendors={setPotentialVendors}
                        />
                    )
                }
                <li style={{ height: '25px', backgroundColor: 'transparent' }}>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}></div>
                    <div style={{ padding: '0px' }}>
                        <IoIosAdd title="Əlavə et" cursor="pointer" onClick={addNewVendor} size="25" style={{ margin: 'auto' }} />
                    </div>
                </li>
            </ul>
            <div style={{ marginTop: '20px' }} id="procurement-edit-section">
                <textarea ref={textareaRef} >
                </textarea>
                <div style={{ minHeight: '231px' }}>
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
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="send-order" onClick={handleSendClick}>
                    Göndər
                    </div>
            </div>
            <div style={{ padding: '0px 20px' }}>
                <div style={{ marginTop: '20px', overflow: 'hidden', padding: '15px', border: '1px solid gray' }}>
                    {
                        receivers.map(emp => <VisaForwardPerson key={Math.random()} emp={emp} handleSelectChange={handleSelectChange} />)
                    }
                </div>
            </div>
        </div>
    )
}
export default PotentialVendor