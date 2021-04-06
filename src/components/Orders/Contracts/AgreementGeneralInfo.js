import React, { useCallback, useEffect, useState } from 'react'
import AgreementMaterials from '../../Tender/AgreementMaterials'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { MdKeyboardArrowRight } from 'react-icons/md'
import { useHistory } from 'react-router-dom'
import useFetch from '../../../hooks/useFetch'
const getStatusIcon = (status) => {
    const props = { size: '16' }
    if (status === 1) {
        return { icon: FaCheck, props: { ...props, color: '#0F9D58', title: 'Təsdiq' } }
    }
    else
        return { icon: FaTimes, props: { ...props, color: '#D93404', title: 'Etiraz' } }
}
const AgreementGeneralInfo = (props) => {
    const history = useHistory();
    const fetchGet  = useFetch("GET");
    const gotoDoc = () => {
        history.push('/tender/agreements', { agreement: { ...props } })
    }
    const fetchMaterials = useCallback(() => fetchGet(`http://192.168.0.182:54321/api/agreement-materials/${props.id}`)
        , [fetchGet, props.id])
    return (
        <div style={{ paddingTop: '76px' }}>
            {
                props.referer === 'procurement' &&
                <div onClick={gotoDoc} style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '20px', fontWeight: '550', cursor: 'pointer' }}>
                    Sənədə keç
                    <MdKeyboardArrowRight size="20" style={{ float: 'right' }} />
                </div>
            }
            <AgreementMaterials
                editable={false}
                fetchFunction={fetchMaterials}
            />
            <AgreementReviews
                id={props.id}
                fetchGet={fetchGet}
            />
        </div>
    )
}

export default AgreementGeneralInfo

const AgreementReviews = (props) => {
    const { fetchGet } = props;
    const [reviews, setReviews] = useState([]);
    useEffect(() => {
        fetchGet(`http://192.168.0.182:54321/api/agreement-reviews/${props.id}`)
            .then(respJ => setReviews(respJ))
            .catch(ex => console.log(ex))
    }, [props.id, fetchGet])
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