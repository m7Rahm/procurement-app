import React, { useEffect, useRef, useState, useContext } from 'react'
import {
    IoMdRemoveCircle,
    IoIosAdd,
    IoIosLock,
    IoIosUnlock
} from 'react-icons/io'
import Attachments from '../PriceOffers/Attachments'
import { expressVendorInit } from '../../data/data'
import { TokenContext } from '../../App'
import { riskZones, taxTypes, workSectors, vendorTypes } from '../../data/data'
const ExpressVendorInfo = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const attachmentsRef = useRef(null);
    const attachmentsRefInit = useRef(null);
    const { potentialVendor, vendorid, setExpressVendors } = props;
    const [disabled, setDisabled] = useState(props.disabled);
    const [vendorData, setVendorData] = useState({ ...expressVendorInit, ...potentialVendor });
    const handleClick = () => {
        const url = vendorid ? '/update-express-vendor' : '/new-express-vendor'
        sendData(url)
    }
    const sendData = (url) => {
        const formData = new FormData();
        const phoneNumbs = vendorData.phone_numbers.reduce((sum, current) => sum += `${current.val},`, '');
        const emails = vendorData.emails.reduce((sum, current) => sum += `${current.val},`, '')
        formData.append('name', vendorData.name);
        formData.append('voen', vendorData.voen);
        formData.append('saa', vendorData.saa);
        formData.append('residency', vendorData.residency);
        formData.append('tax_type', vendorData.tax_type);
        formData.append('legal_address', vendorData.legal_address);
        formData.append('actual_address', vendorData.actual_address);
        formData.append('risk_zone', vendorData.risk_zone);
        formData.append('reg_date', vendorData.reg_date);
        formData.append('phone_numbers', phoneNumbs.substring(0, phoneNumbs.length - 1));
        formData.append('sphere', vendorData.sphere);
        formData.append('emails', emails.substring(0, emails.length - 1));
        formData.append('tax_percentage', vendorData.tax_percentage);
        formData.append('vendor_type', vendorData.vendor_type);
        formData.append('is_closed', vendorData.is_closed);
        formData.append('close_date', vendorData.close_date);
        formData.append('close_reason', vendorData.close_reason);
        formData.append('id', vendorData.id);
        if (!vendorid)
            for (let i = 0; i < attachmentsRef.current.length; i++)
                formData.append('files', attachmentsRef.current[i])
        else {
            const newFiles = [];
            let oldFiles = '';
            let contains = false;
            for (let i = 0; i < attachmentsRef.current.length; i++) {
                contains = false;
                for (let j = 0; j < attachmentsRefInit.current.length; j++)
                    if (attachmentsRef.current[i].val.name === attachmentsRefInit.current[j].val.name) {
                        contains = true;
                        oldFiles += `${attachmentsRef.current[i].val.name},`
                        break;
                    }
                if (!contains)
                    newFiles.push(attachmentsRef.current[i].val)
            }
            formData.append('filesMetaData', oldFiles.substring(0, oldFiles.length - 1))
            for (let i = 0; i < newFiles.length; i++)
                formData.append('files', newFiles[i])
        }
        fetch(`http://172.16.3.101:54321/api${url}`, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token
            },
            body: formData
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].peration_result === 'success') {
                    const data = JSON.stringify({
                        from: 0,
                        reg_date: '',
                        vendor_type: '',
                        voen: '',
                        sphere: 0,
                        residency: 0,
                        tax_type: 0,
                        name: '',
                        risk_zone: 0,
                        is_closed: 0
                    });
                    fetch('http://172.16.3.101:54321/api/get-express-vendors', {
                        method: 'POST',
                        headers: {
                            'Authorization': 'Bearer ' + token,
                            'Content-Type': 'application/json',
                            'Content-Length': data.length
                        },
                        body: data
                    })
                        .then(resp => resp.json())
                        .then(respJ => {
                            console.log(respJ)
                            const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                            setExpressVendors({ count: totalCount, vendors: respJ });
                        })
                        .catch(ex => console.log(ex))
                }
            })
            .catch(ex => console.log(ex))
    }
    useEffect(() => {
        if (vendorid) {
            fetch(`http://172.16.3.101:54321/api/get-express-vendor/${vendorid}`, {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    const emails = respJ[0].emails.split(',').map(email => ({ key: Math.random(), val: email }));
                    const phone_numbers = respJ[0].phone_numbers.split(',').map(phoneNumb => ({ key: Math.random(), val: phoneNumb }));
                    const files = respJ[0].files.length !== 0 ? respJ[0].files.split(',').map(file => ({ key: Math.random(), val: file })): [];
                    attachmentsRef.current = files;
                    attachmentsRefInit.current = files;
                    setVendorData(({ ...respJ[0], emails, phone_numbers, files }))
                })
                .catch(ex => console.log(ex))
        }
    }, [token, vendorid])
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setVendorData(prev => ({ ...prev, [name]: value }))
    }
    const addNewPhoneNumber = () => {
        if (!disabled)
            setVendorData(prev => ({ ...prev, phone_numbers: [...prev.phone_numbers, { key: Date.now(), val: '' }] }))
    }
    const handlePhoneDel = (key) => {
        if (!disabled)
            setVendorData(prev => ({ ...prev, phone_numbers: prev.phone_numbers.filter(phoneNumb => phoneNumb.key !== key) }))
    }
    const handleEmailDel = (key) => {
        if (!disabled)
            setVendorData(prev => ({ ...prev, emails: prev.emails.filter(email => email.key !== key) }))
    }
    const addNewEmail = () => {
        if (!disabled)
            setVendorData(prev => ({ ...prev, emails: [...prev.emails, { key: Date.now(), val: '' }] }))
    }
    const handleProtectionChange = () => {
        setDisabled(prev => !prev)
    }
    return (
        <div className="express-vendor-info">
            <div>
                {
                    disabled
                        ? <IoIosLock cursor="pointer" size="40" onClick={handleProtectionChange} />
                        : <IoIosUnlock cursor="pointer" size="40" onClick={handleProtectionChange} />
                }
            </div>
            <div>
                <Attachments
                    vendorid={vendorid}
                    disabled={disabled}
                    vendorFiles={vendorData.files}
                    ref={attachmentsRef}
                />
            </div>
            <div>
                <h1 style={{ width: '100%', margin: '10px 0px', fontSize: '20px', color: 'gray' }}>Ümumi məlumat</h1>
                <div style={{ width: '100%', paddingLeft: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <div className="form-card">
                        <label>Kontragentin adı</label>
                        <input placeholder="Name" disabled={disabled} name="name" onChange={handleChange} defaultValue={vendorData.name} />
                    </div>
                    <div className="form-card">
                        <label>Xidmət Sahəsi</label>
                        <select disabled={disabled} name="sphere" onChange={handleChange} defaultValue={vendorData.sphere} >
                            {
                                workSectors.map(workSector =>
                                    <option key={workSector.val} value={workSector.val}>{workSector.text}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="form-card">
                        <label>Kontragentin tipi</label>
                        <select disabled={disabled} name="vendor_type" onChange={handleChange} value={vendorData.vendor_type} >
                            {
                                vendorTypes.map(vendorType =>
                                    <option key={vendorType.val} value={vendorType.val}>{vendorType.text}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="form-card">
                        <label>Rezident</label>
                        <select disabled={disabled} name="residency" onChange={handleChange} value={vendorData.residency} >
                            <option value="11">Fiziki şəxs</option>
                            <option value="2">Hüquqi şəxs</option>
                        </select>
                    </div>
                    <div className="form-card">
                        <label>VÖEN</label>
                        <input placeholder="VOEN" disabled={disabled} name="voen" onChange={handleChange} defaultValue={vendorData.voen} />
                    </div>
                </div>
            </div>
            <div style={{ justifyContent: 'flex-start', paddingLeft: '20px' }}>
                <div className="form-card" style={{ marginRight: '20px' }}>
                    <label>Vergi növü</label>
                    <select disabled={disabled} name="tax_type" onChange={handleChange} value={vendorData.tax_type} >
                        {
                            taxTypes.map(taxType =>
                                <option value={taxType.val} key={taxType.val}>{taxType.text}</option>
                            )
                        }
                    </select>
                </div>
                <div className="form-card">
                    <label>Faiz dərəcəsi</label>
                    <input
                        disabled={disabled}
                        name="tax_percentage"
                        placeholder="%"
                        onChange={handleChange}
                        value={vendorData.tax_percentage}
                        style={{ width: '50px' }}
                    />
                </div>
            </div>
            <div style={{ paddingLeft: '20px' }}>
                <div className="form-card">
                    <label>Hüquqi Address</label>
                    <input
                        disabled={disabled}
                        name="legal_address"
                        placeholder="Legal Address"
                        onChange={handleChange}
                        defaultValue={vendorData.legal_address}
                        style={{ width: '400px' }}
                    />
                </div>
                <div className="form-card">
                    <label>Faktiki Address</label>
                    <input
                        disabled={disabled}
                        name="actual_address"
                        placeholder="Actual Address"
                        onChange={handleChange}
                        defaultValue={vendorData.actual_address}
                        style={{ width: '400px' }}
                    />
                </div>
            </div>
            <div>
                <h1 style={{ width: '100%', marginBottom: '20px', fontSize: '20px', color: 'gray' }}>Cavabdeh şəxs</h1>
                <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', alignItems: 'flex-start' }}>
                    <div className="form-card">
                        <h2>SAA</h2>
                        <input
                            placeholder="SAA"
                            name="saa"
                            disabled={disabled}
                            onChange={handleChange}
                            defaultValue={vendorData.saa}
                            style={{ width: '250px' }}
                        />
                    </div>
                    <div style={{ width: '225px' }}>
                        <h3>
                            Əlaqə Nömrələri
                            <IoIosAdd
                                color="green"
                                size="18"
                                onClick={addNewPhoneNumber}
                                cursor="pointer"
                                style={{ verticalAlign: 'center' }}
                            />
                        </h3>
                        {
                            vendorData.phone_numbers.map((phoneNumber) =>
                                <ContactCard
                                    disabled={disabled}
                                    key={phoneNumber.key}
                                    value={phoneNumber}
                                    handleDelete={() => handlePhoneDel(phoneNumber.key)}
                                />
                            )
                        }
                    </div>
                    <div style={{ width: '225px' }}>
                        <h3>
                            Email
                            <IoIosAdd
                                color="green"
                                cursor="pointer"
                                onClick={addNewEmail}
                                size="18"
                                style={{ verticalAlign: 'center' }}
                            />
                        </h3>
                        {
                            vendorData.emails.map((email) =>
                                <ContactCard
                                    key={email.key}
                                    disabled={disabled}
                                    value={email}
                                    handleDelete={() => handleEmailDel(email.key)}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
            <div style={{ paddingLeft: '20px' }}>
                <div className="form-card">
                    <label>Risk Zonası</label>
                    <select disabled={disabled} name="risk_zone" onChange={handleChange} value={vendorData.risk_zone} >
                        {
                            riskZones.map(riskZone =>
                                <option key={riskZone.val} value={riskZone.val}>{riskZone.text}</option>
                            )
                        }
                    </select>
                </div>
                <div className="form-card">
                    <label>Registrasiya tarixi</label>
                    <input type="date" disabled={disabled} name="reg_date" onChange={handleChange} defaultValue={vendorData.reg_date} />
                </div>
            </div>
            <div style={{ paddingLeft: '20px' }}>
                {
                    vendorData.is_closed === 1 &&
                    <>
                        <textarea style={{ flex: 1, marginRight: '20px' }} defaultValue={vendorData.close_reason} />
                        <div className="form-card">
                            <label>Bağlanma tarixi</label>
                            <input type="date" disabled={disabled} name="close_date" onChange={handleChange} defaultValue={vendorData.close_date} />
                        </div>
                    </>
                }
            </div>
            <div className="send-order" onClick={handleClick}>
                {vendorid ? 'Yadda Saxla' : 'Əlavə et'}
            </div>
        </div>
    )
}

export default ExpressVendorInfo

const ContactCard = (props) => {
    const { value, handleDelete, disabled } = props;
    const rowRef = useRef(null);

    const handleDel = () => {
        if (!disabled) {
            rowRef.current.classList.add('delete-row');
            rowRef.current.addEventListener('animationend', () => {
                console.log('finished');
                handleDelete()
            })
        }
    }
    return (
        <div ref={rowRef} className="contact-card" >
            <input
                placeholder="phone number"
                name="phone"
                disabled={disabled}
                defaultValue={value.val}
            />
            <IoMdRemoveCircle onClick={handleDel} color="red" />
        </div>
    )
}