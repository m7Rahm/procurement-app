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
import useFetch from '../../hooks/useFetch'
const ExpressVendorInfo = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const attachmentsRef = useRef({ new: [], fetched: [] });
    const { vendorid, onFinish } = props;
    const [disabled, setDisabled] = useState(props.disabled);
    const namRef = useRef(null);
    const voenRef = useRef(null);
    const taxTypeRef = useRef(null);
    const residencyRef = useRef(null);
    const workSectorRef = useRef(null);
    const closeDateRef = useRef(null);
    const taxPercentageRef = useRef(null);
    const riskZoneRef = useRef(null);
    const regDateRef = useRef(null);
    const vendorTypeRef = useRef(null);
    const actualAddressRef = useRef(null);
    const legalAddressRef = useRef(null);
    const saaRef = useRef(null);
    const closeReasonRef = useRef(null)
    const [vendorData, setVendorData] = useState(expressVendorInit);
    const handleClick = () => {
        const url = vendorid ? '/update-express-vendor' : '/new-express-vendor'
        sendData(url)
    }
    const sendData = (url) => {
        const formData = new FormData();
        const phoneNumbs = vendorData.phone_numbers.reduce((sum, current) => sum += `${current.val},`, '');
        const emails = vendorData.emails.reduce((sum, current) => sum += `${current.val},`, '')
        if (!/\d+\.?\d{0,2}/.test(taxPercentageRef.current.value)) {
            taxPercentageRef.current.style.boxShadow = "0px 0px 3px 1px red"
        } else if (!/\d{4}-\d{2}-\d{2}/.test(regDateRef.current.value)) {
            regDateRef.current.style.boxShadow = "0px 0px 3px 1px red"
        } else {
            formData.append('name', namRef.current.value);
            formData.append('voen', voenRef.current.value);
            formData.append('saa', saaRef.current.value);
            formData.append('residency', residencyRef.current.value);
            formData.append('tax_type', taxTypeRef.current.value);
            formData.append('legal_address', legalAddressRef.current.value);
            formData.append('actual_address', actualAddressRef.current.value);
            formData.append('risk_zone', riskZoneRef.current.value);
            formData.append('reg_date', regDateRef.current.value);
            formData.append('phone_numbers', phoneNumbs.substring(0, phoneNumbs.length - 1));
            formData.append('sphere', workSectorRef.current.value);
            formData.append('emails', emails.substring(0, emails.length - 1));
            formData.append('tax_percentage', taxPercentageRef.current.value);
            formData.append('vendor_type', vendorTypeRef.current.value);
            formData.append('is_closed', vendorData.is_closed);
            const closeDate = closeDateRef.current ? closeDateRef.current.value : vendorData.close_date
            if (closeDate)
                formData.append('close_date', closeDate);
            formData.append('close_reason', closeReasonRef.current ? closeReasonRef.current.value : vendorData.close_reason);
            formData.append('id', vendorData.id);
            const newFiles = attachmentsRef.current.new;
            const oldFiles = attachmentsRef.current.fetched.reduce((sum, current) => sum += `${current.val},`, '');
            formData.append('filesMetaData', oldFiles.substring(0, oldFiles.length - 1))
            for (let i = 0; i < newFiles.length; i++)
                formData.append('files', newFiles[i].val);
            fetch(`http://192.168.0.182:54321/api${url}`, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                body: formData
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (!respJ.length) {
                        onFinish();
                    }
                })
                .catch(ex => console.log(ex))
        }
    }
    const fetchGet = useFetch("GET");
    useEffect(() => {
        if (vendorid) {
            fetchGet(`http://192.168.0.182:54321/api/get-express-vendor/${vendorid}`)
                .then(respJ => {
                    const emails = respJ[0].emails ? respJ[0].emails.split(',').map(email => ({ key: Math.random(), val: email })) : [];
                    const phone_numbers = respJ[0].phone_numbers ? respJ[0].phone_numbers.split(',').map(phoneNumb => ({ key: Math.random(), val: phoneNumb })) : [];
                    const files = respJ[0].files ? respJ[0].files : ''
                    const filesArray = files.length !== 0
                        ? respJ[0].files.split(',').map(file => ({ key: file, val: file }))
                        : [];
                    attachmentsRef.current.fetched = filesArray;
                    attachmentsRef.current.new = [];
                    taxTypeRef.current.value = respJ[0].tax_type;
                    const { tax_percentage, tax_type, residency, sphere, vendor_type, risk_zone } = respJ[0];
                    residencyRef.current.value = residency;
                    taxPercentageRef.current.value = tax_percentage;
                    taxTypeRef.current.value = tax_type;
                    workSectorRef.current.value = sphere;
                    vendorTypeRef.current.value = vendor_type;
                    riskZoneRef.current.value = risk_zone;
                    setVendorData(({ ...respJ[0], emails, phone_numbers, files: filesArray }))
                })
                .catch(ex => console.log(ex))
        }
    }, [fetchGet, vendorid]);
    const handleCardChange = (key, value, type) => {
        setVendorData(prev => ({ ...prev, [type]: prev[type].map(preVal => preVal.key === key ? ({ ...preVal, val: value }) : preVal) }))
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
                        <input placeholder="Name" disabled={disabled} ref={namRef} name="name" defaultValue={vendorData.name} />
                    </div>
                    <div className="form-card">
                        <label>Xidmət Sahəsi</label>
                        <select ref={workSectorRef} disabled={disabled} name="sphere" >
                            {
                                workSectors.map(workSector =>
                                    <option key={workSector.val} value={workSector.val}>{workSector.text}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="form-card">
                        <label>Kontragentin tipi</label>
                        <select ref={vendorTypeRef} disabled={disabled} name="vendor_type" >
                            {
                                vendorTypes.map(vendorType =>
                                    <option key={vendorType.val} value={vendorType.val}>{vendorType.text}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="form-card">
                        <label>Rezident</label>
                        <select disabled={disabled} name="residency" ref={residencyRef} >
                            <option value="11">Fiziki şəxs</option>
                            <option value="2">Hüquqi şəxs</option>
                        </select>
                    </div>
                    <div className="form-card">
                        <label>VÖEN</label>
                        <input placeholder="VOEN" disabled={disabled} name="voen" ref={voenRef} defaultValue={vendorData.voen} />
                    </div>
                </div>
            </div>
            <div style={{ justifyContent: 'flex-start', paddingLeft: '20px' }}>
                <div className="form-card" style={{ marginRight: '20px' }}>
                    <label>Vergi növü</label>
                    <select
                        disabled={disabled}
                        name="tax_type"
                        ref={taxTypeRef}
                    >
                        {
                            taxTypes.map(taxType =>
                                <option value={taxType.val} key={taxType.val}>{taxType.text}</option>
                            )
                        }
                    </select>
                </div>
                <div className="form-card">
                    <label>Faiz dərəcəsi*</label>
                    <input
                        disabled={disabled}
                        name="tax_percentage"
                        placeholder="%"
                        required
                        title="Xahiş olunur xananı düzgün formatda doldurun"
                        ref={taxPercentageRef}
                        style={{ width: '50px' }}
                    />
                </div>
            </div>
            <div style={{ paddingLeft: '20px' }}>
                <div className="form-card">
                    <label>Hüquqi Ünvan</label>
                    <input
                        disabled={disabled}
                        name="legal_address"
                        ref={legalAddressRef}
                        placeholder="Hüquqi Ünvan"
                        defaultValue={vendorData.legal_address}
                        style={{ width: '400px' }}
                    />
                </div>
                <div className="form-card">
                    <label>Faktiki Ünvan</label>
                    <input
                        disabled={disabled}
                        name="actual_address"
                        placeholder="Faktiki Ünvan"
                        ref={actualAddressRef}
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
                            ref={saaRef}
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
                            vendorData.phone_numbers.map((phoneNumber) => {
                                const handleChange = (val) => handleCardChange(phoneNumber.key, val, "phone_numbers")
                                return (
                                    <ContactCard
                                        disabled={disabled}
                                        key={phoneNumber.key}
                                        value={phoneNumber}
                                        placeholder="əlaqə nömrəsi"
                                        handleChange={handleChange}
                                        handleDelete={() => handlePhoneDel(phoneNumber.key)}
                                    />
                                )
                            })
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
                            vendorData.emails.map((email) => {
                                const handleChange = (val) => handleCardChange(email.key, val, "emails")
                                return (
                                    <ContactCard
                                        key={email.key}
                                        disabled={disabled}
                                        value={email}
                                        placeholder="email ünvanı"
                                        handleChange={handleChange}
                                        handleDelete={() => handleEmailDel(email.key)}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            </div>
            <div style={{ paddingLeft: '20px' }}>
                <div className="form-card">
                    <label>Risk Zonası</label>
                    <select disabled={disabled} name="risk_zone" ref={riskZoneRef} >
                        {
                            riskZones.map(riskZone =>
                                <option key={riskZone.val} value={riskZone.val}>{riskZone.text}</option>
                            )
                        }
                    </select>
                </div>
                <div className="form-card">
                    <label>Qeydiyyat tarixi*</label>
                    <input type="date" disabled={disabled} required name="reg_date" ref={regDateRef} defaultValue={vendorData.reg_date} />
                </div>
            </div>
            <div style={{ paddingLeft: '20px' }}>
                {
                    vendorData.is_closed === 1 &&
                    <>
                        <textarea
                            style={{ flex: 1, marginRight: '20px' }}
                            name="close_reason"
                            defaultValue={vendorData.close_reason}
                            ref={closeReasonRef}
                        />
                        <div className="form-card">
                            <label>Bağlanma tarixi</label>
                            <input
                                type="date"
                                disabled={disabled}
                                name="close_date"
                                ref={closeDateRef}
                                defaultValue={vendorData.close_date}
                            />
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
    const { value, handleDelete, disabled, handleChange, placeholder } = props;
    const rowRef = useRef(null);
    const handleDel = () => {
        if (!disabled) {
            rowRef.current.classList.add('delete-row');
            rowRef.current.addEventListener('animationend', () => {
                handleDelete()
            })
        }
    };
    const handleInputChange = (e) => {
        const value = e.target.value;
        handleChange(value)
    }
    return (
        <div ref={rowRef} className="contact-card" >
            <input
                placeholder={placeholder}
                name="phone"
                onChange={handleInputChange}
                disabled={disabled}
                defaultValue={value.val}
            />
            <IoMdRemoveCircle onClick={handleDel} color="red" />
        </div>
    )
}