import React, { useState, useEffect } from 'react'
import {
    AiOutlineFilePdf,
    AiFillCloseCircle,
    AiOutlinePlusCircle
} from 'react-icons/ai'
const Attachments = (props, attachmentsRef) => {
    const { vendorFiles, disabled } = props;
    const [files, setFiles] = useState({ fetched: vendorFiles, new: [], all: vendorFiles });
    useEffect(() => {
        setFiles(prev => ({ ...prev, fetched: vendorFiles, all: [...prev.new, ...vendorFiles] }))
    }, [vendorFiles])
    const handleChange = (e) => {
        const filesArray = Object.values(e.target.files);
        e.target.value = null
        setFiles(prev => {
            const newFilesState = [...prev.new]
            for (let i = 0; i < filesArray.length; i++) {
                let duplicate = false;
                for (let j = 0; j < newFilesState.length; j++) {
                    if (newFilesState[j].key === filesArray[i].name) {
                        duplicate = true;
                        break;
                    }
                }
                if (!duplicate)
                    newFilesState.push({ key: filesArray[i].name, val: filesArray[i] })
            }
            const newState = { ...prev, new: newFilesState, all: [...prev.fetched, ...newFilesState] };
            attachmentsRef.current = newState;
            return newState;
        })
    }
    const handleFileRemove = (key, from) => {
        setFiles(prev => {
            if (from === 0) {
                const fetched = prev.fetched.filter(file => file.key !== key);
                const newState = { ...prev, fetched: fetched, all: [...fetched, ...prev.new] };
                attachmentsRef.current = newState;
                return newState
            }
            else {
                const newFiles = prev.new.filter(file => file.key !== key);
                const newState = { ...prev, new: newFiles, all: [...prev.fetched, ...newFiles] };
                attachmentsRef.current = newState;
                return newState
            }
        })
    }
    return (
        <div style={{ width: '100%' }}>
            <div>
                {
                    files.all.map(file => {
                        const src = typeof (file.val) === 'string' ? `http://192.168.0.182:54321/original/${file.val}` : URL.createObjectURL(file.val);
                        const from = typeof (file.val) === 'string' ? 0 : 1
                        return (
                            <div style={{ position: 'relative', display: 'inline-block' }} key={file.key} >
                                <a
                                    href={src} title={file.val.name}
                                    style={{ display: 'inline-block' }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <AiOutlineFilePdf size="40" />
                                </a>
                                <AiFillCloseCircle
                                    onClick={() => handleFileRemove(file.key, from)}
                                    style={{ position: 'absolute', top: '-5px', right: '-4px', zIndex: 1 }}
                                />
                            </div>
                        )
                    })
                }
            </div>
            <div>
                <div style={{ float: 'right' }}>
                    <label htmlFor="files">
                        <AiOutlinePlusCircle cursor="pointer" size="30" />
                    </label>
                    <input
                        id="files"
                        style={{ display: 'none' }}
                        name="files"
                        disabled={disabled}
                        type="file"
                        multiple
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default React.forwardRef(Attachments)