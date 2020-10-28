import React, { useRef } from 'react'
import {
    FaTrashAlt,
}
    from 'react-icons/fa'
import {
    IoIosAttach
} from 'react-icons/io'
import {
    AiOutlinePicture
} from 'react-icons/ai'
const PotentialVendorRow = (props) => {
    const { index, vendor, setPotentialVendors, setModalState } = props;
    const handleFileUpload = (e) => {
        const files = [];
        if (e.target.files) {
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                file.supplier = vendor.key
                files.push(file);
            }
            setPotentialVendors(prev => prev.map(row => row.key === vendor.key ? { ...row, files } : row))
        }
    }
    const showFiles = () => {
        setModalState({ display: true, vendor: vendor });
    }
    const rowRef = useRef(null);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setPotentialVendors(prev => prev.map(row => row.key !== vendor.key ? row : { ...row, [name]: value }))
    }
    const handleRowDelete = () => {
        rowRef.current.classList.add('delete-row');
        rowRef.current.addEventListener('animationend',
            () => setPotentialVendors(prev => prev.filter(row => row.key !== vendor.key))
        )
    }
    return (
        <li ref={rowRef} className={vendor.className}>
            <div>{index}</div>
            <div>
                <input type="text" name="name" placeholder="Name" value={vendor.name} onChange={handleChange} />
            </div>
            <div>
                <input type="text" name="voen" placeholder="VOEN" value={vendor.voen} onChange={handleChange} />
            </div>
            <div>
                <select name="sphere" value={vendor.sphere} onChange={handleChange} >
                    <option value="0">Satış</option>
                    <option value="1">Ximət</option>
                </select>
            </div>
            {/* <div>
                <input type="text" name="ordNumb" placeholder="Order Number" value={vendor.ordNumb} onChange={handleChange} />
            </div> */}
            <div>
                <input type="text" name="comment" placeholder="Comment" value={vendor.comment} onChange={handleChange} />
            </div>
            <div>
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
                    onChange={handleFileUpload}
                    accept=".xlsx,.xls,image/*,.doc, .docx,.pdf"
                    type="file"
                    multiple={true}
                />
            </div>
            <div>
                <FaTrashAlt cursor="pointer" onClick={handleRowDelete} title="Sil" color="#ff4a4a" />
            </div>
        </li>
    )
}
export default React.memo(PotentialVendorRow)