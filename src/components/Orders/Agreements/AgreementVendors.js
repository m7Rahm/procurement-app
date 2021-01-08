import React, { useEffect, useState } from 'react'
import UserAgreementVendorRow from './UserAgreementVendorRow'
import EmptyContent from '../../Misc/EmptyContent'
const AgreementVendors = (props) => {
    const [agreementVendors, setAgreementVendors] = useState([]);
    useEffect(() => {
        if (props.active) {
            fetch(`http://172.16.3.101:54321/api/agreement-vendors/${props.active}`, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => setAgreementVendors(respJ))
                .catch(ex => console.log(ex))
        }
    }, [props.active, props.token])
    return (
        props.active ?
            <ul className="new-order-table order-table-protex">
                <li>
                    <div>#</div>
                    <div>Ad</div>
                    <div>VÖEN</div>
                    <div>Xid. sahəsi</div>
                    <div>Qeyd</div>
                    <div></div>
                    <div></div>
                </li>
                {
                    agreementVendors.map((vendor, index) =>
                        <UserAgreementVendorRow
                            index={index}
                            key={vendor.id}
                            vendor={vendor}
                            setModalState={props.setModalState}
                            setAgreementVendors={setAgreementVendors}
                        />
                    )
                }
            </ul>
            :
            <EmptyContent />
    )
}
export default AgreementVendors