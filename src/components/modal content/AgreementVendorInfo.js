import React from 'react'
import AgreementVendorFiles from '../Orders/Agreements/AgreementVendorFiles'
import AgreementReviews from '../Orders/Agreements/AgreementReviews'
const AgreementVendorInfo = (props) => {
    return (
        <div>
            <AgreementVendorFiles
                agreementid={props.messageid}
                vendorid={props.vendorid}
            />
            <AgreementReviews agreementid={props.messageid} />
        </div>
    )
}
export default AgreementVendorInfo