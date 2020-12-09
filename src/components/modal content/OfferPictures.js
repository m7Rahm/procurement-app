import React, { useRef, useState } from 'react'
import {
    IoMdClose,
    IoIosClose
} from 'react-icons/io'
const PictureItem = (props) => {
    const { index, picture, setModalState, setPotentialVendors, id } = props;
    const imgRef = useRef(null);
    const src = URL.createObjectURL(picture);
    const showBiggerPicter = function () {
        setModalState({ show: true, src: src });
    }
    const handleDelete = () => {
        setPotentialVendors(prev =>
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
                {
                    picture.name.split('.').pop() === 'pdf'
                        ? <div onClick={() => window.open(src)} style={{ backgroundColor: 'red', color: 'white' }}>{picture.name}</div>
                        : <img
                            onClick={showBiggerPicter}
                            onLoad={() => {URL.revokeObjectURL(imgRef.current.src)}}
                            ref={imgRef}
                            src={src}
                            alt="preview"
                        />
                }

            </td>
            <td>
                <IoIosClose color="red" onClick={handleDelete} />
            </td>
        </tr>
    )
}
const OfferPictures = (props) => {
    const closeModal = () => props.setModalState({ display: false, vendorIndex: null });
    const setPotentialVendors = props.setPotentialVendors;
    const { files, key, name } = props.vendor;
    const [modalState, setModalState] = useState(false);
    const bigPicRef = useRef(null);
    console.log(files)
    const closeThumbsModal = (e) => {
        if (e.target.closest('div').id === 'offer-pictures')
            closeModal()
    }
    const closeBigPicModal = (e) => {
        if (e.target.tagName.toLowerCase() !== 'img')
            setModalState({ show: false })
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
                {
                    modalState.show &&
                    <div onClick={closeBigPicModal} className="big-picture-ref">
                        <div>
                            <span>
                                <IoIosClose onClick={() => setModalState({ show: false })} size="40" />
                            </span>
                            <img
                                ref={bigPicRef}
                                src={modalState.src}
                                alt="big preview"
                                onLoad={() => URL.revokeObjectURL(bigPicRef.current.src)}
                            />
                        </div>
                    </div>
                }
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
                                        setModalState={setModalState}
                                        setPotentialVendors={setPotentialVendors}
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