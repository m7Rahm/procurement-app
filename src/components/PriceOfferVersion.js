import React, { useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import PriceOfferCard from './PriceOfferCard'
import { token } from '../data/data'

const PriceOfferVersion = (props) => {
    const [offers, setOffers] = useState([])
    const loadOfferVersion = () => {
        if (offers.length === 0) {
            const data = {
                ordNumb: props.ordNumb,
                offerVersion: props.offerVersion
            }
            fetch('http://172.16.3.101:54321/api/get-offer-version', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': JSON.stringify(data).length,
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(data)
            })
                .then(resp => resp.json())
                .then(respJ => setOffers(respJ))
                .catch(ex => console.log(ex))
        }
        else
        setOffers([])
    }
    // console.log(versions)
    return (
        <div>
            <div onClick={loadOfferVersion} className="price-offer-version">
                <span>
                    {props.name}
                </span>
                <FaAngleDown style={{ verticalAlign: 'middle' }} size="36" />
            </div>
            <div>
                {
                    offers.map(offer =>
                        <PriceOfferCard key={offer.price_offer_numb}
                            offerNumb={offer.price_offer_numb}
                            date={offer.create_date_time}
                            userid={offer.user_id}
                            canBeChanged={props.canBeChanged}
                            offerVersion={props.offerVersion}
                            active={props.active}
                        />
                    )
                }
            </div>
        </div>
    )
}
export default PriceOfferVersion