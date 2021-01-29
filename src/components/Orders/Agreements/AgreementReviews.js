import React, { useContext, useEffect, useState } from 'react'
import { TokenContext } from '../../../App'
import { FaCheck, FaTimes } from 'react-icons/fa'
const getStatusIcon = (status) => {
    const props = { size: '25' }
    if (status === 1) {
        return { icon: FaCheck, props: { ...props, color: '#0F9D58', title: 'Təsdiq' } }
    }
    else
        return { icon: FaTimes, props: { ...props, color: '#D93404', title: 'Etiraz' } }
}
const AgreementReviews = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        fetch(`http://172.16.3.101:54321/api/agreement-reviews/${props.agreementid}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setReviews(respJ))
            .catch(ex => console.log(ex))
    }, [props.agreementid, token])
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