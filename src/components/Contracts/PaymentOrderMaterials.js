import React, { useState, useRef, useEffect } from 'react'
import { FaPlus, FaTimes, FaTrash } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch'
import { VendorsList } from '../Tender/AgreementVendors'
const PaymentOrderMaterials = (props) => {
    const handleChange = (e, material) => {
        const value = e.target.value;
        props.setOrderState(prev => {
            return {
                ...prev,
                materials: prev.materials.map(mat => mat.id === material.id ? ({ ...material, amount: value }) : mat)
            }
        })
    }
    const addVendor = (material, vendor, inputRef, vendorsListRef) => {
        inputRef.current.value = vendor.name;
        vendorsListRef.current.style.display = "none";
        props.setOrderState(prev => {
            return {
                ...prev,
                materials: prev.materials.map(mat => mat.id === material.id ? ({ ...mat, vendor_id: vendor.id }) : mat)
            }
        })
    }
    const removeMaterial = (material) => {
        props.setOrderState(prev => {
            return {
                ...prev,
                materials: material.parent
                    ? prev.materials.filter(mat => mat.id !== material.id)
                    : prev.materials.filter(mat => Math.trunc(mat.order) !== material.id)
            }
        })
    }
    const removeOrder = (number) => {
        props.setOrderState(prev => {
            const current = prev.all[number.number];
            const newState = prev.materials.map(material => {
                const element = current.find(mat => mat.material_id === material.material_id);
                return { ...material, amount: element ? material.amount - element.amount : material.amount }
            })
            const all = { ...prev.all }
            delete all[number.number];
            return { ...prev, materials: newState.filter(material => material.amount > 0), numbers: prev.numbers.filter(num => num.id !== number.id), all }
        })
    }
    const addDecendant = (material) => {
        props.setOrderState(prev => ({ ...prev, materials: [...prev.materials, { ...material, contract_id: 0, id: Date.now(), parent: material.id, order: material.id + Math.random() }].sort((a, b) => a.order - b.order) }))
    }
    const handleContractClick = (contract, containerRef, inputRef, material) => {
        containerRef.current.style.display = "none";
        inputRef.current.value = contract.number;
        props.setOrderState(prev => {
            return {
                ...prev,
                materials: prev.materials.map(mat => mat.id === material.id ? ({ ...mat, contract_id: contract.id }) : mat)
            }
        })
    }
    return (
        <>
            <div style={{ overflow: 'hidden', clear: 'left' }}>
                {
                    props.numbers.map(number =>
                        <div className="forwarded-person-card" style={{ minWidth: '50px', lineHeight: '28px' }} key={number.id}>
                            <span style={{ verticalAlign: 'baseline', marginLeft: '10px' }}>
                                {number.number}
                            </span>
                            <span style={{ float: 'right', verticalAlign: 'baseline', marginRight: '4px' }}>
                                <FaTimes onClick={() => removeOrder(number)} />
                            </span>
                        </div>
                    )
                }
            </div>
            <ul className="new-order-table">
                <li>
                    <div>#</div>
                    <div>Ad</div>
                    <div style={{ maxWidth: "50px" }}>Say</div>
                    <div style={{ minWidth: "200px" }}>Vendor</div>
                    <div>Müqavilə</div>
                    <div></div>
                </li>
                {
                    props.materials.map((material, index) =>
                        <li key={material.id}>
                            <div style={{ position: "relative" }}>
                                {
                                    !material.parent &&
                                    <div style={{ position: "absolute", left: "-20px" }}>
                                        <FaPlus onClick={() => addDecendant(material)} cursor="pointer" />
                                    </div>
                                }
                                {
                                    material.parent
                                        ? "*"
                                        : index + 1
                                }
                            </div>
                            <div>{material.material_name}</div>
                            <div style={{ maxWidth: "50px" }}>
                                <input value={material.amount} onChange={(e) => handleChange(e, material)} />
                            </div>
                            <div style={{ minWidth: "200px" }}>
                                <VendorsList
                                    token={props.token}
                                    headerVisible={false}
                                    addVendor={(vendor, inputRef, vendorsListRef) => addVendor(material, vendor, inputRef, vendorsListRef)}
                                    uid={material.id}
                                />
                            </div>
                            <div style={{ position: "relative" }}>
                                <ContractsList
                                    token={props.token}
                                    handleClick={(contract, containerRef, inputRef) => handleContractClick(contract, containerRef, inputRef, material)}
                                    vendorid={material.vendor_id}
                                    uid={material.id}
                                />
                            </div>
                            <div>
                                <FaTrash cursor="pointer" onClick={() => removeMaterial(material)} />
                            </div>
                        </li>
                    )
                }
            </ul>
        </>
    )
}
export default React.memo(PaymentOrderMaterials)
const ContractsList = React.memo((props) => {
    const [documents, setDocuments] = useState({ all: [], available: [], visible: [], offset: 2 });
    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();
        if (props.vendorid)
            fetchGet("http://192.168.0.182:54321/api/vendor-contracts/" + props.vendorid, controller)
                .then(respJ => {
                    if (mounted)
                        setDocuments({ all: respJ, available: respJ, visible: respJ.slice(0, Math.round(200 / 36)), offset: 2 })
                })
                .catch(ex => console.log(ex))
        return () => {
            controller.abort();
            mounted = false;
        }
    }, [fetchGet, props.vendorid]);
    const handleVendorSearch = (e) => {
        const value = e.target.value;
        containerRef.current.scrollTop = 0;
        setDocuments(prev => {
            const available = prev.all.filter(document => document.number.toLowerCase().includes(value))
            return ({ ...prev, available: available, visible: available.slice(0, Math.round(200 / 36)), offset: 2 })
        })
    }
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        const next = Math.round(200 / 36);
        setDocuments(prev => {
            const offset = Math.round(offsetTop / 36);
            const start = offset > 2 ? offset - 2 : 0;
            const end = start + next + 2 <= prev.available.length ? start + next + 2 : prev.available.length;
            return ({ ...prev, visible: prev.available.slice(start, end), offset: offset > 2 ? offset : 2 })
        })
    }
    const handleInputFocus = () => {
        containerRef.current.style.display = "block"
    }
    const handleInputFocusLose = (e) => {
        if (!e.relatedTarget || e.relatedTarget.id !== "contracts-list-" + props.uid)
            containerRef.current.style.display = "none"
    }
    return (
        <div style={{ maxWidth: '200px', padding: '5px 4px' }}>
            <input
                style={{ display: 'block', width: "100%", padding: '3px' }}
                type="text"
                onChange={handleVendorSearch}
                onFocus={handleInputFocus}
                onBlur={handleInputFocusLose}
                ref={inputRef}
            />
            <div style={{ maxHeight: '200px', display: "none", position: 'absolute', right: 0, left: 0, zIndex: 1 }} ref={containerRef} onScroll={handleScroll}>
                <ul tabIndex="0" id={"contracts-list-" + props.uid} style={{ height: 36 * documents.available.length, width: '100%' }} className="vendors-list">
                    {
                        documents.visible.map((document, index) =>
                            <li
                                key={`${document.id}-${props.type}`}
                                onClick={() => props.handleClick(document, containerRef, inputRef)}
                                style={{ top: (documents.offset + index - 2) * 36 + 'px' }}
                            >
                                {document.number}
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
})
