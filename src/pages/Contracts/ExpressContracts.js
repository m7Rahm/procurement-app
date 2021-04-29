import React, { useEffect, useState, lazy, useRef } from 'react'
import { workSectors } from '../../data/data'
import { IoIosMore, IoIosAddCircle } from 'react-icons/io'
import ExpressContractBody from '../../components/Contracts/ExpressContractBody'
import SearchExpressContracts from '../../components/Contracts/SearchExpressContracts'
import useFetch from '../../hooks/useFetch'
const Modal = lazy(() => import('../../components/Misc/Modal'));

const ExpressContracts = () => {
    const [contracts, setContracts] = useState({ count: 0, content: [] });
    const numberRef = useRef(null);
    const vendorsListRef = useRef([]);
    const activePageRef = useRef(0);
    const fetchPost = useFetch("POST");
    const updateContent = () => {
        const data = {
            vendors: vendorsListRef.current.length !== 0 ? vendorsListRef.current.map(vendor => [vendor.id]) : null,
            from: activePageRef.current,
            number: numberRef.current.value
        };
        fetchPost('http://192.168.0.182:54321/api/get-express-contracts', data)
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setContracts({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))

    }
    const [modalState, setModalState] = useState({
        visible: false,
        content: ExpressContractBody,
        updateContent,
        setContracts,
        title: "",
    })
    useEffect(() => {
        const idStartIndex = window.location.search.indexOf("i=")
        const defaultid = idStartIndex !== -1 ? window.location.search.substring(idStartIndex + 2) : 0
        const apiData = defaultid ? { id: defaultid } : {}
        fetchPost('http://192.168.0.182:54321/api/get-express-contracts', apiData)
            .then(respJ => {
                if (respJ) {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    setContracts({ count: totalCount, content: respJ });
                    if (Number(defaultid))
                        setModalState(prev => ({ ...prev, visible: true, id: defaultid, number: respJ[0].number }))
                }
            })
            .catch(ex => console.log(ex))
    }, [fetchPost]);
    const handleMoreClick = (contract) => {
        if (contract.id !== 0)
            window.history.replaceState(null, "", window.location.pathname + `?i=${contract.id}`)
        setModalState(prev => ({
            ...prev,
            visible: true,
            id: contract.id,
            number: contract.number,
            title: contract.id === 0 ? "Yeni Müqavilə" : "Müqavilə № "
        }))
    }
    const closeModal = () => {
        setModalState(prev => ({ ...prev, visible: false }))
    }
    return (
        <div style={{ paddingTop: '56px' }}>
            <div>
                {
                    modalState.visible &&
                    <Modal
                        changeModalState={closeModal}
                        title={modalState.title}
                        number={modalState.number}
                        style={{ width: "400px" }}
                        childProps={modalState}
                    >
                        {ExpressContractBody}
                    </Modal>
                }
                <SearchExpressContracts
                    activePageRef={activePageRef}
                    vendorsListRef={vendorsListRef}
                    numberRef={numberRef}
                    count={contracts.count}
                    setContracts={setContracts}
                />
                <div style={{ position: "fixed", right: '50px', bottom: "86px", }}>
                    <IoIosAddCircle size="50" cursor="pointer" color="#D93404" onClick={() => handleMoreClick({ id: 0, number: "" })} />
                </div>
                <ul className="potential-vendors">
                    <li>
                        <div style={{ textAlign: 'center' }}>#</div>
                        <div>Müqavilə №</div>
                        <div>Vendor</div>
                        <div style={{ width: '100px' }}>Xidmət sahəsi</div>
                        <div style={{ width: '100px', textAlign: 'center' }}>Tarix</div>
                        <div></div>
                    </li>
                    {
                        contracts.content.map((contract, index) => {
                            const workSector = workSectors.find(workSector => workSector.val === contract.sphere)
                                ? workSectors.find(workSector => workSector.val === contract.sphere).text
                                : ''
                            return (
                                <li key={contract.id}>
                                    <div>{index + 1}</div>
                                    <div>{contract.number}</div>
                                    <div>{contract.vendor_name}</div>
                                    <div style={{ width: '100px' }}>{workSector}</div>
                                    <div style={{ width: '100px', textAlign: 'center' }}>{contract.contract_date}</div>
                                    <div><IoIosMore onClick={() => handleMoreClick(contract)} /></div>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default ExpressContracts