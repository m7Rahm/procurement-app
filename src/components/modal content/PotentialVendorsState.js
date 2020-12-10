import React, { useEffect, useState } from 'react'
import Modal from '../Misc/Modal'
import { Link } from 'react-router-dom'
import {
    IoMdInformationCircleOutline
} from 'react-icons/io'
import {
    GrEdge
} from 'react-icons/gr'
import {
    AiOutlineFilePdf,
} from 'react-icons/ai'
const PotentialVendorsState = (props) => {
    const { ordNumb, token } = props;
    const [potentialVendorVersions, setPotentialVendorVersions] = useState([]);
    const [modalState, setModalState] = useState({ vendorid: null, version: null });
    useEffect(() => {
        const data = { ordNumb: ordNumb };
        let isSubscribed = true;
        if (isSubscribed) {
            fetch('http://172.16.3.101:54321/api/get-potential-vendors-gen', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(data).length
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (isSubscribed)
                        setPotentialVendorVersions(respJ)
                })
                .catch(ex => console.log(ex));
        }
        return () => isSubscribed = false;
    }, [token, ordNumb])
    const closeModal = () => {
        setModalState({vendorid: null, version: null});
    }
    return (
        <div>
            {
                modalState.vendorid !== null &&
                <Modal changeModalState={closeModal}>
                    {
                        (props) =>
                            <VendorInfo
                                ordNumb={ordNumb}
                                token={token}
                                version={modalState.version}
                                vendorid={modalState.vendorid}
                                {...props}
                            />
                    }
                </Modal>
            }
            <ul style={{padding: '0px'}}>
                {
                    potentialVendorVersions.map((potentialVendorVersion, index) =>
                        <PotentialVendorVersion
                            potentialVendorVersion={potentialVendorVersion}
                            ordNumb={ordNumb}
                            setModalState={setModalState}
                            token={token}
                            key={potentialVendorVersion.version}
                            expanded={index === 0}
                        />
                    )
                }
            </ul>
        </div>
    )
}
export default PotentialVendorsState 

const PotentialVendorVersion = (props) => {
    const { ordNumb, expanded, potentialVendorVersion, token, setModalState } = props;
    const version = potentialVendorVersion.version;
    const [isExpanded, setIsExpanded] = useState(expanded);
    const [priceOfferContent, setPriceOfferContent] = useState([])
    useEffect(() => {
        let isSubscribed = true;
        if (isExpanded) {
            const data = JSON.stringify({
                ordNumb: ordNumb,
                version: version
            })
            fetch('http://172.16.3.101:54321/api/get-price-offer-content', {
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
                    if(isSubscribed)
                        setPriceOfferContent(respJ)
                })
                .catch(ex => console.log(ex));
        }
        return () => isSubscribed = false
    }, [ordNumb, token, version, isExpanded]);
    const expandCard = () => {
        setIsExpanded(prev => !prev)
    }
    const showVendorInfo = (potentialVendor) => {
        setModalState({ vendorid: potentialVendor.vendor_id, version: version })
    }
    return (
        <div>
            <div onClick={expandCard} className="toggle-participants" style={{width: 'auto'}}>
                {potentialVendorVersion.version}
            </div>
            {
                isExpanded &&
                <div style={{ clear: 'both'}}>
                    <ul className="new-order-table">
                        <li>
                            <div>#</div>
                            <div>Name</div>
                            <div>Voen</div>
                            <div>Sphere</div>
                            <div>Comment</div>
                            <div></div>
                            <div></div>
                        </li>
                        {
                            priceOfferContent.map((potentialVendor, index) =>
                                <li key={potentialVendor.id}>
                                    <div>{index + 1}</div>
                                    <div>{potentialVendor.name}</div>
                                    <div>{potentialVendor.voen}</div>
                                    <div>
                                        <select defaultValue={potentialVendor.sphere} disabled >
                                            <option value="0">Satış</option>
                                            <option value="1">Xidmət</option>
                                        </select>
                                    </div>
                                    <div>{potentialVendor.comment}</div>
                                    <div>
                                        <IoMdInformationCircleOutline
                                            onClick={() => showVendorInfo(potentialVendor)}
                                            cursor="pointer"
                                            size={28}
                                            color="royalblue"
                                        />
                                    </div>
                                    <div>
                                        {
                                            potentialVendor.result === 1 && potentialVendor.is_express_vendor === 0 &&
                                            <Link
                                                to={{
                                                pathname: '/tender/express-vendors',
                                                state: { vendorData: potentialVendor }
                                            }}>
                                                  <GrEdge color="rgb(255, 174, 0)" size="20"/>
                                            </Link>
                                        }
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            }
        </div>
    )
}
export const VendorInfo = (props) => {
    const { version, vendorid, token } = props;
    const [vendorData, setVendorData] = useState({ files: [], reviews: [] });
    useEffect(() => {
        const data = JSON.stringify({
            version: version,
            vendorid: vendorid
        })
        fetch('http://172.16.3.101:54321/api/get-potential-vendor-info', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
        .then(resp => resp.json())
        .then(respJ => setVendorData({ files: respJ.files, reviews: respJ.reviews }))
    }, [version, vendorid, token])
    return (
        <>
            <div className="pontential-vendor-files-container">
                {
                    vendorData.files.map(file =>
                        <div key={file.id}>
                            <a rel="noopener noreferrer" target="_blank" href={`http://172.16.3.101:54321/original/${file.name}`}>
                                {
                                    file.ext === 'pdf'
                                    ? <AiOutlineFilePdf size="40" title={file.name}/>
                                    : <img src={`http://172.16.3.101:54321/thumbs/${file.name}`} alt={`${file.name}`} />
                                }
                            </a>
                        </div>
                    )
                }
            </div>
            <div>
                <ul className='participants'>
                    <li>
                        <div>Ad Soyad</div>
                        <div>Status</div>
                        <div>Tarix</div>
                        <div style={{ textAlign: 'left' }}>Qeyd</div>
                    </li>
                    {
                        vendorData.reviews.map((reviewer, index) =>
                            <li key={index}>
                                <div>{reviewer.full_name}
                                    <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>{'Mütəxəssis'}</div>
                                </div>
                                <div>{reviewer.result === 1 ? 'Təsdiq' : reviewer.result === -1 ? 'Etiraz' : 'Baxılır'}</div>
                                <div>{reviewer.date_time}</div>
                                <div style={{ textAlign: 'left' }}>{reviewer.review}</div>
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    )
}