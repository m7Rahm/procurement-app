import React, { useEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch'
const getStatusIcon = (status) => {
    const props = { size: '25' }
    if (status === 1) {
        return { icon: FaCheck, props: { ...props, color: '#0F9D58', title: 'Təsdiq' } }
    }
    else
        return { icon: FaTimes, props: { ...props, color: '#D93404', title: 'Etiraz' } }
}
const AgreementReviews = (props) => {
    const [reviews, setReviews] = useState([]);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        fetchGet(`http://192.168.0.182:54321/api/agreement-reviews/${props.agreementid}`)
            .then(respJ => setReviews(respJ))
            .catch(ex => console.log(ex))
    }, [props.agreementid, fetchGet])
    return (
        <div>
            <ul className="participants reviews">
                <li>
                    <div>Ad Soyad</div>
                    <div>Status</div>
                    <div>Vendor</div>
                    <div>VÖEN</div>
                    <div>Tarix</div>
                    <div style={{ textAlign: 'left' }}>Rəy</div>
                </li>
                {
                    reviews.map(review => {
                        const { icon: Icon, props } = getStatusIcon(review.result);
                        return (
                            <li key={review.id}>
                                <div>{review.full_name}
                                    <div style={{ fontWeight: '600', fontSize: 11, color: '#777777' }}>Mütəxəssis</div>
                                </div>
                                <div style={{ alignItems: 'center' }}><Icon {...props} /></div>
                                <div>{review.vendor_name || 'Razılaşma'}</div>
                                <div>{review.voen}</div>
                                <div>{review.date_time}</div>
                                <div style={{ textAlign: 'left' }}>{review.review}</div>
                            </li>
                        )
                    }
                    )
                }
            </ul>
        </div>
    )
}
export default AgreementReviews