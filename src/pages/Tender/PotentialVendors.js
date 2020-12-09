import React, { useContext } from 'react'
import { TokenContext } from '../../App'
import PotentialVendor from './PotentialVendor'
const PotentialVendors = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0];
    return (
        <div style={{marginTop: '56px'}}>
            <PotentialVendor
                token={token}
            />
        </div>
    )
}
export default PotentialVendors