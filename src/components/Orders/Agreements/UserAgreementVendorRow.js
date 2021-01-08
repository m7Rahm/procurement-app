import React, { useRef } from 'react'
import { IoMdMore } from 'react-icons/io'
const AgreementVendorRow = (props) => {
    const {
        index,
        vendor,
        setAgreementVendors,
    } = props;
    const rowRef = useRef(null);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setAgreementVendors(prev => prev.map(row => row.key !== vendor.key ? row : { ...row, [name]: value }))
    }
    return (
        <>
            <li ref={rowRef} className={vendor.className}>
                <div>{index + 1}</div>
                <div>
                    {vendor.name}
                </div>
                <div>
                    {vendor.voen}
                </div>
                <div>
                    {vendor.sphere}
                </div>
                <div>
                    <input type="text" name="comment" placeholder="Comment" value={vendor.comment} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" name="review" placeholder="Review.." value={vendor.comment} onChange={handleChange} />
                </div>
                <div>
                    <IoMdMore />
                </div>
            </li>
        </>
    )
}
export default React.memo(AgreementVendorRow)