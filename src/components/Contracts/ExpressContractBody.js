import React, { useContext, useEffect, useRef, useState } from 'react'
import { TokenContext } from '../../App'
import useFetch from '../../hooks/useFetch'
import { VendorsList } from '../Tender/AgreementVendors'
import ContractRelatedDocs from './ContractRelatedDocs'
import ExpressContractFiles from './ExpressContractFiles'
const ExpressContractBody = (props) => {
    const [contractState, setContractState] = useState([]);
    const fetchGet = useFetch("GET");
    const stateRef = useRef({
        files: { new: [], fetched: [] },
        vendorid: null,
        relatedDocs: []
    });
    const token = useContext(TokenContext)[0].token
    const numberRef = useRef(null);
    const dateRef = useRef(null);
    const textareaRef = useRef(null);
    const exists = contractState[0] ? true : false
    const number = exists ? contractState[0].number : ''
    const date = exists ? contractState[0].contract_date : ''
    const comment = exists ? contractState[0].comment : ''
    const createContract = () => {
        const formData = new FormData();
        const relatedDocs = JSON.stringify(stateRef.current.relatedDocs.map(relatedDoc => [relatedDoc.id, 2]));
        formData.append("number", numberRef.current.value);
        formData.append("vendorid", stateRef.current.vendorid);
        formData.append("comment", textareaRef.current.value);
        formData.append("date", dateRef.current.value);
        formData.append("relatedDocs", relatedDocs);
        for (let i = 0; i < stateRef.current.files.new.length; i++)
            formData.append("files", stateRef.current.files.new[i]);
        fetch("http://192.168.0.182:54321/api/new-express-contract", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ.length === 0) {
                    props.closeModal();
                    props.updateContent();
                }
            })
            .catch(ex => console.log(ex))
    }
    const updateContract = () => {
        const formData = new FormData();
        const relatedDocs = JSON.stringify(stateRef.current.relatedDocs.map(relatedDoc => [relatedDoc.id, 2]));
        const activeFiles = JSON.stringify(stateRef.current.files.fetched.map(file => [file.id]));
        formData.append("id", props.id);
        formData.append("number", numberRef.current.value);
        formData.append("vendorid", contractState[0].vendor_id);
        formData.append("comment", textareaRef.current.value);
        formData.append("date", dateRef.current.value);
        formData.append("relatedDocs", relatedDocs);
        formData.append("activeFiles", activeFiles)
        for (let i = 0; i < stateRef.current.files.new.length; i++)
            formData.append("files", stateRef.current.files.new[i]);
        fetch("http://192.168.0.182:54321/api/update-express-contract", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: formData
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ.length === 0) {
                    props.setContracts(prev => {
                        return ({
                            ...prev,
                            content: prev.content.map(row =>
                                row.id === props.id
                                    ? ({
                                        ...row,
                                        number: numberRef.current.value,
                                        vendor_name: contractState[0].vendor_name,
                                        sphere: contractState[0].sphere,
                                        contract_date: dateRef.current.value
                                    })
                                    : row
                            )
                        })
                    });
                    props.closeModal()
                }
            })
            .catch(ex => console.log(ex))
    }
    const buttonText = props.id === 0 ? "Müqavilə yarat" : "Yadda saxla";
    const action = props.id === 0 ? createContract : updateContract
    useEffect(() => {
        if (props.id !== 0) {
            fetchGet(`http://192.168.0.182:54321/api/express-contract/${props.id}`)
                .then(respJ => {
                    setContractState(respJ)
                })
                .catch(ex => console.log(ex))
        }
        return () => {
            window.history.replaceState(null, "", window.location.pathname)
        }
    }, [fetchGet, props.id])
    const onVendorSelect = (vendor, inputRef, vendorsListRef) => {
        inputRef.current.value = vendor.name;
        vendorsListRef.current.style.display = "none";
        setContractState(prev => {
            stateRef.current.vendorid = vendor.id;
            if (prev.length !== 0)
                return prev.map(row => ({ ...row, vendor_name: vendor.name, voen: vendor.voen, sphere: vendor.sphere }))
            else
                return ([...prev, { vendor_id: vendor.id, vendor_name: vendor.name, voen: vendor.voen, sphere: vendor.sphere }])
        })
    }
    return (
        <div className="contract-container" style={{ minHeight: '300px' }}>
            <div className="contract-header-container">
                <div>
                    <label htmlFor="number">Müqavilə Nömrəsi</label>
                    <br />
                    <input ref={numberRef} id="number" defaultValue={number} name="number" placeholder="Müqavilə nömrəsi" />
                </div>
                <div>
                    <label>Müqavilənin bağlanma tarixi</label>
                    <br />
                    <input id="date" ref={dateRef} defaultValue={date} name="date" type="date" placeholder="Tarix" />
                </div>
            </div>
            <div style={{ float: 'left', marginTop: '10px' }}>
                <h1 style={{ fontSize: '14px' }}>Vendor</h1>
                <div style={{ float: 'left' }}>
                    <VendorsList
                        addVendor={onVendorSelect}
                        headerVisible={false}
                    />
                </div>
                {
                    contractState.length !== 0 &&
                    <>
                        <div style={{ fontWeight: '550', color: 'royalblue', fontSize: '18px', clear: 'both', marginTop: '5px' }}>{contractState[0].vendor_name}</div>
                        <span style={{ fontWeight: '550', color: 'slategray' }}>{contractState[0].voen}</span>
                    </>
                }
            </div>
            <div style={{ float: 'right', marginTop: '10px' }}>
                <ContractRelatedDocs
                    id={props.id}
                    stateRef={stateRef}
                />
            </div>
            <div style={{ clear: 'both' }}>
                <ExpressContractFiles
                    id={props.id}
                    stateRef={stateRef}
                />
            </div>
            <textarea defaultValue={comment} ref={textareaRef} placeholder="Əlavə qeydlər" />
            <div
                style={{
                    backgroundColor: 'royalblue',
                    color: 'white',
                    fontWeight: '550',
                    padding: '10px 20px',
                    float: 'right',
                    margin: '10px ',
                    cursor: "pointer"
                }}
                onClick={action}
            >
                {buttonText}
            </div>
        </div>
    )
}
export default ExpressContractBody

