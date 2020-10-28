import React, { useRef, useState } from 'react'
import {
    IoMdClose,
    IoIosClose
} from 'react-icons/io'
const PictureItem = (props) => {
    const imgRef = useRef(null);
    const src = URL.createObjectURL(props.picture);
    const showBiggerPicter = function () {
        props.setModalState({ show: true, src: src });
    }
    const handleDelete = () => {
        props.setPictures(prev => {
            const newFiles = prev.filter((_, index) => index !== props.index);
            props.setPotentialVendors(prev =>
                prev.map(row =>
                    row.key === props.id
                        ? { ...row, files: newFiles }
                        : row
                )
            );
            return newFiles
        })
    }
    return (
        <tr>
            <td>{props.index + 1}</td>
            <td>
                {new Date(props.picture.lastModifiedDate).toDateString()}
            </td>
            <td>
                {props.picture.name}
            </td>
            <td>
                <img
                    onClick={showBiggerPicter}
                    // onLoad={() => {URL.revokeObjectURL(imgRef.current.src)}}
                    ref={imgRef}
                    src={src}
                    alt="preview"
                />
            </td>
            <td>
                <IoIosClose color="red" onClick={handleDelete} />
            </td>
        </tr>
    )
}
const OfferPictures = (props) => {
    const closeModal = () => props.setModalState({ display: false, vendor: null });
    const setPotentialVendors = props.setPotentialVendors;
    const { files, key, name } = props.vendor;
    const [modalState, setModalState] = useState(false);
    const [pictures, setPictures] = useState(files);
    const bigPicRef = useRef(null);
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
                                pictures.map((picture, index) =>
                                    <PictureItem
                                        key={picture.name}
                                        index={index}
                                        id={key}
                                        picture={picture}
                                        setModalState={setModalState}
                                        setPictures={setPictures}
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