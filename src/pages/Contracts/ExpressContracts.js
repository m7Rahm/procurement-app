import React, { useEffect, useState, lazy, useRef } from 'react'
import { workSectors } from '../../data/data'
import { IoIosMore, IoIosAddCircle } from 'react-icons/io'
import ExpressContractBody from '../../components/Contracts/ExpressContractBody'
import SearchExpressContracts from '../../components/Contracts/SearchExpressContracts'
import useFetch from '../../hooks/useFetch'
const Modal = lazy(() => import('../../components/Misc/Modal'));

const ExpressContracts = () => {
    const [contracts, setContracts] = useState({ count: 0, content: [] });
    const [modalState, setModalState] = useState({ visible: false, content: ExpressContractBody })
    const numberRef = useRef(null);
    const vendorsListRef = useRef([]);
    const activePageRef = useRef(0);
    const fetchPost = useFetch("POST");
    const fetchGet = useFetch("GET");
    useEffect(() => {
        fetchPost('http://192.168.0.182:54321/api/get-express-contracts', {})
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setContracts({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }, [fetchPost]);
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
    const handleMoreClick = (id) => {
        setModalState({
            visible: true,
            content: ExpressContractBody,
            id,
            fetchGet,
            updateContent,
            setContracts
        })
    }
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    return (
        <div style={{ paddingTop: '56px' }}>
            <div>
                {
                    modalState.visible &&
                    <Modal changeModalState={closeModal} width="400px" childProps={modalState}>
                        {modalState.content}
                    </Modal>
                }
                <SearchExpressContracts
                    activePageRef={activePageRef}
                    vendorsListRef={vendorsListRef}
                    numberRef={numberRef}
                    count={contracts.count}
                    fetchPost={fetchGet}
                    setContracts={setContracts}
                />
                <div style={{ position: "fixed", right: '50px', bottom: "86px", }}>
                    <IoIosAddCircle size="50" cursor="pointer" color="#D93404" onClick={() => handleMoreClick(0)} />
                </div>
                <ul className="potential-vendors">
                    <li>
                        <div style={{ textAlign: 'center' }}>#</div>
                        <div>Müqavilə Nömrəsi</div>
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
                                    <div><IoIosMore onClick={() => handleMoreClick(contract.id)} /></div>
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