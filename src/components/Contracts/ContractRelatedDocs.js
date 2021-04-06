import React, { useEffect, useState, useRef } from 'react'
import { FaTimes } from 'react-icons/fa'
import useFetch from '../../hooks/useFetch';
const ContractRelatedDocs = (props) => {
    const [relatedDocs, setRelatedDocs] = useState([]);
    const fetchGet = useFetch("GET");
    const onContractClick = (contract) => {
        setRelatedDocs(prev => {
            const newState = prev.find(cont => cont.id === contract.id) ? prev : [...prev, contract];
            props.stateRef.current.relatedDocs = newState;
            return newState
        })
    }
    useEffect(() => {
        let mounted = true;
        if (props.id !== 0 && mounted)
            fetchGet(`http://192.168.0.182:54321/api/contract-related-docs/${props.id}`)
                .then(respJ => {
                    if (mounted) {
                        props.stateRef.current.relatedDocs = respJ;
                        setRelatedDocs(respJ)
                    }
                })
        return () => mounted = false;
    }, [props.id, fetchGet, props.stateRef]);
    const onRemoveItemClick = (doc) => {
        setRelatedDocs(prev => {
            const newState = prev.filter(document => document.id !== doc.id)
            props.stateRef.current.relatedDocs = newState;
            return newState
        })
    }
    return (
        <div>
            <h1>Əlaqəli sənədlər</h1>
            <ContractsList
                onContractClick={onContractClick}
                fetchGet={fetchGet}
            />
            <div style={{ marginTop: '200px' }}>
                {
                    relatedDocs.map(doc =>
                        <div style={{ borderRadius: '3px', backgroundColor: 'royalblue', color: 'white', padding: '6px' }} key={doc.id}>
                            {doc.number}
                            <FaTimes style={{ float: 'right', cursor: 'pointer' }} onClick={() => onRemoveItemClick(doc)} />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ContractRelatedDocs

const ContractsList = (props) => {
    const [agreements, setAgreements] = useState({ all: [], available: [], visible: [], offset: 2 });
    const listRef = useRef(null);
    const fetchGet = props.fetchGet;
    useEffect(() => {
        let mounted = true
        const controller = new AbortController();
        fetchGet('http://192.168.0.182:54321/api/contract-agreements')
            .then(respJ => {
                if (mounted)
                    setAgreements({ all: respJ, available: respJ, visible: respJ.slice(0, Math.round(200 / 36)), offset: 2 })
            })
            .catch(ex => console.log(ex))
        return () => {
            controller.abort();
            mounted = false;
        }
    }, [fetchGet]);
    const handleVendorSearch = (e) => {
        const value = e.target.value;
        setAgreements(prev => {
            const available = prev.all.filter(agreement => agreement.full_name.toLowerCase().includes(value))
            return ({ ...prev, available: available, visible: available.slice(0, Math.round(200 / 36)), offset: 2 })
        })
    }
    const handleScroll = (e) => {
        const offsetTop = e.target.scrollTop;
        const next = Math.round(200 / 36);
        setAgreements(prev => {
            const offset = Math.round(offsetTop / 36);
            const start = offset > 2 ? offset - 2 : 0;
            const end = start + next + 2 <= prev.available.length ? start + next + 2 : prev.available.length;
            return ({ ...prev, visible: prev.available.slice(start, end), offset: offset > 2 ? offset : 2 })
        })
    }
    const handleInputFocus = () => {
        listRef.current.style.display = "block"
    }
    const handleInputFocusLose = (e) => {
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || relatedTarget.id !== "windowed-list")
            listRef.current.style.display = "none"
    }
    const handleItemBlur = (e) => {
        const relatedTarget = e.relatedTarget;
        if (!relatedTarget || relatedTarget.id !== "windowed-input")
            listRef.current.style.display = "none"
    }
    return (
        <div>
            <div style={{ width: '312px', padding: '5px 4px', position: 'relative' }}>
                <input
                    style={{ display: 'block', width: "100%", padding: '3px' }}
                    type="text"
                    id="windowed-input"
                    onChange={handleVendorSearch}
                    onFocus={handleInputFocus}
                    onBlur={handleInputFocusLose}
                />
                <div tabIndex="1" ref={listRef}
                    onBlur={handleItemBlur}
                    id="windowed-list"
                    style={{ position: 'absolute', zIndex: 1, display: 'none', top: "30px", left: 0, right: 0 }}
                >
                    <div style={{ maxHeight: '200px', position: 'relative', overflow: 'auto', backdropFilter: "blur(3px)", backgroundColor: 'slategray' }} onScroll={handleScroll}>
                        <ul style={{ height: 36 * agreements.available.length, width: '100%' }} className="vendors-list">
                            {
                                agreements.visible.map((agreement, index) =>
                                    <li
                                        key={agreement.id}
                                        onClick={() => props.onContractClick(agreement)}
                                        style={{ top: (agreements.offset + index - 2) * 36 + 'px' }}
                                    >
                                        {agreement.number}
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}