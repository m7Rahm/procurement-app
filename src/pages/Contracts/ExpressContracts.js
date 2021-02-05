import React, { useEffect, useContext, useState, lazy, useRef } from 'react'
import { TokenContext } from '../../App'
import { workSectors } from '../../data/data'
import { IoIosMore, IoIosAddCircle } from 'react-icons/io'
import ExpressContractBody from '../../components/Contracts/ExpressContractBody'
import SearchExpressContracts from '../../components/Contracts/SearchExpressContracts'
const Modal = lazy(() => import('../../components/Misc/Modal'));

const ExpressContracts = (props) => {
    const tokenContext = useContext(TokenContext);
    const [contracts, setContracts] = useState({ count: 0, content: [] });
    const token = tokenContext[0].token;
    const [modalState, setModalState] = useState({ visible: false, content: ExpressContractBody })
    const numberRef = useRef(null);
    const vendorsListRef = useRef([]);
    const activePageRef = useRef(0);
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/get-express-contracts', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': 0
            },
        })
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setContracts({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }, [token]);
    const updateContent = () => {
        const data = JSON.stringify({
            vendors: vendorsListRef.current.length !== 0 ? vendorsListRef.current.map(vendor => [vendor.id]) : null,
            from: activePageRef.current,
            number: numberRef.current.value
        });
        fetch('http://172.16.3.101:54321/api/get-express-contracts', {
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
            token,
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
                    token={token}
                    activePageRef={activePageRef}
                    vendorsListRef={vendorsListRef}
                    numberRef={numberRef}
                    count={contracts.count}
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