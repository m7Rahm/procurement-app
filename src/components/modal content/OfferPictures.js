import React from 'react'
import {
    IoMdClose,
    IoIosClose
} from 'react-icons/io'
const PictureItem = (props) => {
    const { index, picture, setAgreementVendors, id } = props;
    const src = URL.createObjectURL(picture);
    const handleDelete = () => {
        setAgreementVendors(prev =>
            prev.map(row =>
                row.key === id
                    ? { ...row, files: row.files.filter(prev => prev.name !== picture.name) }
                    : row
            )
        );
    }
    return (
        <tr>
            <td>{index + 1}</td>
            <td>
                {new Date(picture.lastModifiedDate).toDateString()}
            </td>
            <td>
                {picture.name}
            </td>
            <td>
                <div onClick={() => window.open(src)} style={{ backgroundColor: 'red', color: 'white' }}>{picture.name}</div>
            </td>
            <td>
                <IoIosClose color="red" onClick={handleDelete} />
            </td>
        </tr>
    )
}
const OfferPictures = (props) => {
    const closeModal = () => props.setModalState({ display: false, vendor: null });
    const { vendors, id: vendorKey } = props;
    const vendor = vendors.find(vendor => vendor.key === vendorKey)
    const { files, key, name } = vendor;
    const closeThumbsModal = (e) => {
        if (e.target.closest('div').id === 'offer-pictures')
            closeModal()
    }
    return (
        <div id="offer-pictures" onClick={closeThumbsModal} className="offer-pictures">
            <div>
                <div style={{ marginBottom: '20px' }}>
                    {name}
                    <IoMdClose
                        className="modal-close-button"
                        onClick={closeModal}
                        size='18'
                    />
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>№</td>
                                <td>Tarix</td>
                                <td>Ad</td>
                                <td>File</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                files.map((picture, index) =>
                                    <PictureItem
                                        key={picture.name}
                                        index={index}
                                        id={key}
                                        picture={picture}
                                        setAgreementVendors={props.setAgreementVendors}
                                    />
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default OfferPictures