import React, { useRef } from 'react'
import { FaRegLightbulb, FaCheck } from 'react-icons/fa'
import { workSectors } from '../../../data/data'
const AgreementVendorRow = (props) => {
    const {
        index,
        vendor,
        setAgreementVendors,
    } = props;
    const active = props.agreementResult === 0 && (props.userResult === 0 || props.userResult === 3)
    const rowRef = useRef(null);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setAgreementVendors(prev => prev.map(row => row.id !== vendor.id ? row : { ...row, [name]: value }))
    }
    const onBulbClick = () => {
        props.handleDetailsClick(props.agreementid, vendor)
    }
    const approveVendor = () => {
        const value = vendor.result === 1 ? 0 : 1
        setAgreementVendors(prev => prev.map(row => row.id !== vendor.id ? row : { ...row, result: value }))
    }
    const workSector = workSectors.find(sector => sector.val === vendor.sphere) ? workSectors.find(sector => sector.val === vendor.sphere).text: '';
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
                    {workSector}
                </div>
                <div>
                    {vendor.comment}
                </div>
                {
                    props.referer !== 'procurement' &&
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input
                            type="text"
                            name="review"
                            placeholder="Review.."
                            value={vendor.review}
                            disabled={!active}
                            onChange={handleChange}
                        />
                    </div>
                }
                <div>
                    <FaRegLightbulb
                        cursor="pointer"
                        color="ffb362"
                        size="20"
                        onClick={onBulbClick}
                    />
                </div>
                {
                    props.referer !== 'procurement' &&
                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        {
                            active &&
                            <div
                                className="approve-vendor"
                                onClick={approveVendor}
                                style={{ backgroundColor: vendor.result === 1 ? '#D93404' : '' }}
                            >
                                {vendor.result === 1 ? 'Ləğv et' : 'Təsdiq et'}
                            </div>
                        }
                        {
                            (vendor.result === 1) &&
                            <FaCheck cursor="pointer" color="#0F9D58" size="20" />
                        }
                    </div>
                }

            </li>
        </>
    )
}
export default React.memo(AgreementVendorRow)