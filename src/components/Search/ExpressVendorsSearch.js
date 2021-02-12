import React from 'react'
import { vendorTypes, riskZones, taxTypes, workSectors } from '../../data/data'
const ExpressVendorsSearch = (props, ref) => {
    const { updateList } = props;
    const handleSearch = () => {
        updateList(0)
    }
    return (
        <div style={{ backgroundColor: '#188bc0' }}>
            <div className="wrapper">
                <div className='search-container'>
                    <div>
                        <label htmlFor='vendor_type'>Kontragentin tipi</label>
                        <br />
                        <select name="vendor_type" ref={(pointer) => ref.current.vendor_type = pointer} style={{ height: '35px', float: 'left' }}>
                            <option value="0">-</option>
                            {
                                vendorTypes.map(vendor =>
                                    <option key={vendor.val} value={vendor.val}>{vendor.text}</option>
                                )
                            }
                        </select>
                    </div>
                    <div>
                        <label htmlFor='reg_date'>Qeydiyyat tarixi</label>
                        <br />
                        <input
                            placeholder='Tarix'
                            name='reg_date'
                            ref={(pointer) => ref.current.reg_date = pointer}
                            type='date'
                            style={{ height: '35px', float: 'left' }}
                        />
                    </div>
                    <div>
                        <label htmlFor='dateTill'>VÖEN</label>
                        <br />
                        <input
                            placeholder='VÖEN'
                            ref={(pointer) => ref.current.voen = pointer}
                            name='dateTill'
                            type='text'
                            style={{ height: '35px', float: 'left' }}
                        />
                    </div>
                    <div>
                        <label htmlFor='name' >Ad</label>
                        <br />
                        <input
                            placeholder='Ad'
                            ref={(pointer) => ref.current.name = pointer}
                            name='name'
                            type='text'
                            style={{ height: '35px', float: 'left' }}
                        />
                    </div>
                    <div>
                        <label htmlFor='sphere'>Fəaliyyət Sferası</label>
                        <br />
                        <select name="sphere" ref={(pointer) => ref.current.sphere = pointer} style={{ height: '35px', float: 'left' }}>
                            <option value="0">-</option>
                            {
                                workSectors.map(workSector =>
                                    <option key={workSector.val} value={workSector.val}>{workSector.text}</option>
                                )
                            }
                        </select>
                    </div>
                    <div>
                        <label htmlFor='tax_type'>Vergi növü</label>
                        <br />
                        <select name="tax_type" ref={(pointer) => ref.current.tax_type = pointer} style={{ height: '35px', float: 'left' }}>
                            <option value="0">-</option>
                            {
                                taxTypes.map(taxType =>
                                    <option key={taxType.val} value={taxType.val}>{taxType.text}</option>
                                )
                            }
                        </select>
                    </div>
                    <div className="next-row">
                        <div>
                            <label htmlFor='risk_zone'>Risk Zonası</label>
                            <br />
                            <select name="risk_zone" ref={(pointer) => ref.current.risk_zone = pointer} style={{ height: '35px', float: 'left' }}>
                                <option value="0">-</option>
                                {
                                    riskZones.map(riskZone =>
                                        <option key={riskZone.val} value={riskZone.val}>{riskZone.text}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label htmlFor='residency'>Rezidentlik</label>
                            <br />
                            <select name="residency" ref={(pointer) => ref.current.residency = pointer} style={{ height: '35px', float: 'left' }}>
                                <option value="0">-</option>
                                {
                                    riskZones.map(riskZone =>
                                        <option key={riskZone.val} value={riskZone.val}>{riskZone.text}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div>
                            <label htmlFor='status'>Status</label>
                            <br />
                            <select name="status" ref={(pointer) => ref.current.is_closed = pointer} style={{ height: '35px', float: 'left' }}>
                                <option value="0">-</option>
                                <option value="0">Açıq</option>
                                <option value="1">Qapalı</option>
                            </select>
                        </div>
                        <div style={{ textAlign: 'left', height: '55px', display: 'flex', minWidth: '180px', flexDirection: 'column-reverse' }}>
                            <button
                                onClick={handleSearch}
                                style={{
                                    height: '35px',
                                    marginBottom: '1.5px',
                                    cursor: 'pointer',
                                    color: 'white',
                                    fontWeight: '600',
                                    padding: '3px 6px',
                                    float: 'left',
                                    minWidth: '180px',
                                    fontFamily: 'sans-serif',
                                    border: 'none',
                                    backgroundColor: '#ffae00'
                                }}>
                                AXTAR
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default React.forwardRef(ExpressVendorsSearch)