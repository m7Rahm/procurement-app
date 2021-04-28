import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa';
import useFetch from '../../hooks/useFetch';
import Pagination from '../Misc/Pagination'
import { VendorsList } from '../Tender/AgreementVendors'
const SearchExpressContracts = (props) => {
    const [vendorsList, setVendorsList] = useState([]);
    const fetchPost = useFetch("POST")
    const onVendorSelect = (vendor) => {
        setVendorsList(prev => {
            const newState = prev.find(ven => ven.id === vendor.id) ? prev : [...prev, vendor]
            props.vendorsListRef.current = newState;
            return newState
        })
    }
    const removeFromVendorsList = (vendor) => {
        setVendorsList(prev => prev.filter(ven => ven.id !== vendor.id))
    }
    const handleSearchClick = () => {
        updateList(0)
    }
    const updateList = (from) => {
        const data = {
            vendors: vendorsList.length !== 0 ? vendorsList.map(vendor => [vendor.id]) : null,
            from: from,
            number: props.numberRef.current.value
        };
        fetchPost('http://192.168.0.182:54321/api/get-express-contracts', data)
            .then(respJ => {
                if (respJ) {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    props.setContracts({ count: totalCount, content: respJ });
                }
            })
            .catch(ex => console.log(ex))
    }
    return (
        <div>
            <div style={{ backgroundColor: 'steelblue' }}>
                <div className="express-vendors-search-ribbon">
                    <div>
                        <label>Müqavilə nömrəsi</label>
                        <br />
                        <input ref={props.numberRef} placeholder="Nömrə" />
                    </div>
                    <div>
                        <label>Vendorlar</label>
                        <br />
                        <VendorsList
                            addVendor={onVendorSelect}
                            headerVisible={false}
                        />
                    </div>
                    <div onClick={handleSearchClick}>AXTAR</div>
                </div>
            </div>
            {
                vendorsList.length !== 0 &&
                <div style={{ position: 'fixed', zIndex: 1, top: '126px', right: 0, padding: "10px", overflow: "hidden" }}>
                    {
                        vendorsList.map(vendor =>
                            <div style={{ backgroundColor: "red", padding: "10px 20px", borderRadius: "3px", margin: "1px", color: "white" }} key={vendor.id}>
                                {vendor.name}
                                <FaTimes style={{ float: "right", marginLeft: "5px", cursor: "pointer" }} onClick={() => removeFromVendorsList(vendor)} />
                            </div>
                        )
                    }
                </div>
            }
            <div className="my-orders-footer">
                <Pagination
                    count={props.count}
                    activePageRef={props.activePageRef}
                    updateList={updateList}
                />
            </div>
        </div>
    )
}
export default SearchExpressContracts