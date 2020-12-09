import React, { useEffect, useState, useRef, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import ExpressVendorInfo from '../../components/modal content/ExpressVendorInfo'
import Modal from '../../components/Modal'
import { TokenContext } from '../../App'
import {
    MdDetails
} from 'react-icons/md'
import { riskZones, taxTypes, workSectors, vendorTypes } from '../../data/data'
import Pagination from '../../components/Pagination'
import ExpressVendorsSearch from '../../components/ExpressVendorsSearch'
const ExpressVendors = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0];
    const location = useLocation();
    const activePageRef = useRef(0);
    const searchDataRef = useRef({
        reg_date: null,
        vendor_type: null,
        voen: null,
        sphere: null,
        residency: null,
        tax_type: null,
        name: null,
        risk_zone: null,
        is_closed: null
    })
    useEffect(() => {
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
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setExpressVendors({ count: totalCount, vendors: respJ });
            })
    }, [token])
    const [expressVendors, setExpressVendors] = useState({ count: 0, vendors: [] })
    const [modalState, setModalState] = useState({
        visible: location.state !== undefined,
        content: (props) =>
            <ExpressVendorInfo
                setExpressVendors={setExpressVendors}
                potentialVendor={location.state.vendorData}
                {...props}
            />
    });
    const closeModal = () => {
        setModalState({ visible: false, content: null })
    }
    const updateList = (from) => {
        const data = JSON.stringify({
            reg_date: searchDataRef.current.reg_date.value,
            vendor_type: searchDataRef.current.vendor_type.value,
            voen: searchDataRef.current.voen.value,
            sphere: searchDataRef.current.sphere.value,
            residency: searchDataRef.current.residency.value,
            tax_type: searchDataRef.current.tax_type.value,
            name: searchDataRef.current.name.value,
            risk_zone: searchDataRef.current.risk_zone.value,
            is_closed: searchDataRef.current.is_closed.value,
            from: from
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
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setExpressVendors({ count: totalCount, vendors: respJ });
            })
    }
    const handleClick = (id) => {
        setModalState({
            visible: true,
            content: (props) =>
                <ExpressVendorInfo
                    vendorid={id}
                    setExpressVendors={setExpressVendors}
                    disabled={true}
                    {...props}
                />
        })
    }
    return (
        < div style={{ marginTop: '56px' }} >
            <ExpressVendorsSearch
                ref={searchDataRef}
                updateList={updateList}
            />
            <div className="exp-vendor wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>VÖEN</th>
                            <th>Type</th>
                            <th>Residency</th>
                            <th>Sphere</th>
                            <th>Tax</th>
                            <th>Risk zone</th>
                            <th>Reg Date</th>
                            <th>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            expressVendors.vendors.map((vendor, index) =>
                                <tr key={vendor.id}>
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        {vendor.name}
                                    </td>
                                    <td>
                                        {vendor.voen}
                                    </td>
                                    <td>
                                        {vendorTypes.find(vendorType => vendorType.val === vendor.vendor_type).text}
                                    </td>
                                    <td>
                                        {vendor.residency}
                                    </td>
                                    <td>
                                        {workSectors.find(workSector => workSector.val === vendor.sphere).text}
                                    </td>
                                    <td>
                                        {taxTypes.find(taxType => taxType.val === vendor.tax_type).text}
                                    </td>
                                    <td>
                                        {riskZones.find(riskZone => riskZone.val === vendor.risk_zone).text}
                                    </td>
                                    <td>
                                        {vendor.reg_date}
                                    </td>
                                    <td>
                                        <MdDetails onClick={() => handleClick(vendor.id)} />
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                {
                    modalState.visible &&
                    <Modal title="Express Vendor" changeModalState={closeModal}>
                        {modalState.content}
                    </Modal>
                }
                <div className="my-orders-footer">
                    <Pagination
                        count={expressVendors.count}
                        activePageRef={activePageRef}
                        updateList={updateList}
                    />
                </div>
            </div>
        </ div>
    )
}
export default ExpressVendors