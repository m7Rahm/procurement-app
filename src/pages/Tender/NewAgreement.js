import React, { useContext } from 'react'
import { TokenContext } from '../../App'
import StagingAreaMaterials from '../../components/Tender/StagingAreaMaterials'
import AgreementVendors from '../../components/Tender/AgreementVendors'
const NewAgreement = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    return (
        <div className="new-agreement">
            <StagingAreaMaterials
                token={token}
            />
            <AgreementVendors token={token}/>
        </div>
    )
}
export default NewAgreement