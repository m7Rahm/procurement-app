import React, { useCallback, useEffect, useState } from 'react'
import AgreementMaterials from '../../Tender/AgreementMaterials'
import { FaCheck, FaTimes } from 'react-icons/fa'
const getStatusIcon = (status) => {
    const props = { size: '16' }
    if (status === 1) {
        return { icon: FaCheck, props: { ...props, color: '#0F9D58', title: 'Təsdiq' } }
    }
    else
        return { icon: FaTimes, props: { ...props, color: '#D93404', title: 'Etiraz' } }
}
const AgreementGeneralInfo = (props) => {
    const fetchMaterials = useCallback(() =>
        fetch(`http://172.16.3.101:54321/api/agreement-materials/${props.id}`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
        , [props.token, props.id])
    return (
        <div>
            <AgreementMaterials
                editable={false}
                fetchFunction={fetchMaterials}
                token={props.token}
            />
            <AgreementReviews
                id={props.id}
                token={props.token}
            />
        </div>
    )
}

export default AgreementGeneralInfo

const AgreementReviews = (props) => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`http://172.16.3.101:54321/api/agreement-reviews/${props.id}`, {
            headers: {
                'Authorization': 'Bearer ' + props.token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setReviews(respJ))
            .catch(ex => console.log(ex))
    }, [props.id, props.token])
    return (
        <div className="agreement-review-container">
            <div>
                <div>
                    Ad
                </div>
                <div>
                    Vendor
                </div>
                <div>

                </div>
            </div>
            {
                reviews.map(review => {
                    const { icon: Icon, props } = getStatusIcon(review.result);
                    return <div key={review.id}>
                        <div>
                            {review.full_name}
                        </div>
                        <div>
                            {review.vendor_name === null ?  'Razılaşma' : review.vendor_name}
                        </div>
                        <div>
                            <Icon {...props} />
                        </div>
                    </div>
                }
                )
            }
        </div>
    )
}