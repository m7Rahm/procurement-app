import React, { useEffect, useState } from 'react'
import { token } from '../../data/data'
const PicturesModal = (props) => {
    const priceOfferNumb = props.priceOfferNumb;
    const offererid = props.offererid;
    const [pictures, setPictures] = useState([]);
    useEffect(() => {
        const data = {
            poNumb: priceOfferNumb,
            offererid: offererid
        };
        console.log(data)
        fetch('http://172.16.3.101:54321/api/get-offerer-files', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length,
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then(resp => resp.json())
        .then(respJ => setPictures(respJ))
    }, [offererid, priceOfferNumb]);
    // console.log(pictures)
    return (
        <div>
         <table className="pictures-table">
             <thead>
                 <tr>
                     <th>#</th>
                     <th>Faylın adı</th>
                     <th>Fayl</th>
                 </tr>
             </thead>
             <tbody>
                 {
                    pictures.map((picture, index) => 
                        <tr key={picture.id}>
                            <th>{index + 1}</th>
                            <td>{picture.orig_name}</td>
                            <td><img src={`http://172.16.3.101:54321/thumbs/${picture.orig_name}`} alt="thumb"/></td>
                        </tr>
                    )
                 }
             </tbody>
        </table>   
        </div>
    )
}
export default PicturesModal