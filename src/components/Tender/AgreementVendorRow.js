import React, { useRef, useEffect } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { IoIosAttach, } from 'react-icons/io'
import { AiOutlinePicture } from 'react-icons/ai'
import { workSectors } from '../../data/data'
const AgreementVendorRow = (props) => {
    const {
        index,
        vendor,
        setAgreementVendors,
        setModalState,
    } = props;
    const rowRef = useRef(null);
    const filesRef = useRef(null);
    useEffect(() => {
        if (vendor.files.length === 0)
            filesRef.current.value = ''
    }, [vendor.files])
    const handleFileUpload = (e) => {
        const files = [];
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                file.supplier = vendor.id
                files.push(file);
            }
            setAgreementVendors(prev => prev.map(
                prevVendor => prevVendor.key !== vendor.key
                    ? prevVendor
                    : { ...prevVendor, files: files }
            ));
        }
    }
    const showFiles = () => {
        setModalState({ display: true, key: vendor.key });
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setAgreementVendors(prev => prev.map(row => row.key !== vendor.key ? row : { ...row, [name]: value }))
    }
    const handleRowDelete = () => {
        rowRef.current.classList.add('delete-row');
        rowRef.current.addEventListener('animationend',
            () => setAgreementVendors(prev => prev.filter(row => row.key !== vendor.key))
        )
    }
    const workSector = workSectors.find(sector => sector.val === vendor.sphere) ? workSectors.find(sector => sector.val === vendor.sphere).text : '';
    return (
        <>
            <li ref={rowRef} className={vendor.className}>
                <div>{index + 1}</div>
                <div>
                    {vendor.name}
                </div>
                <div>
                    {vendor.voen}
                </div>
                <div>
                    {workSector}
                </div>
                <div>
                    <input type="text" name="comment" placeholder="Comment" value={vendor.comment} onChange={handleChange} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label htmlFor={`file-upload ${vendor.key}`}>
                        <IoIosAttach cursor="pointer" color="#ff4a4a" onClick={handleFileUpload} title="şəkil əlavə et" size="20" />
                    </label>
                    {
                        vendor.files.length !== 0 &&
                        <AiOutlinePicture onClick={showFiles} className="pictures-thumb" size="20" />
                    }
                    <input
                        id={`file-upload ${vendor.key}`}
                        style={{ display: 'none' }}
                        ref={filesRef}
                        onChange={handleFileUpload}
                        accept=".pdf"
                        type="file"
                        multiple={true}
                    />
                </div>
                <div>
                    <FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
                </div>
            </li>
        </>
    )
}
export default React.memo(AgreementVendorRow)