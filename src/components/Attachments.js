import React, { useState, useEffect } from 'react'
import {
    AiOutlineFilePdf,
    AiFillCloseCircle
} from 'react-icons/ai'
import {
    ImAttachment
} from 'react-icons/im'
const Attachments = (props, attachmentsRef) => {
    const { vendorFiles, disabled } = props;
    const [files, setFiles] = useState(vendorFiles);
    useEffect(() => {
        setFiles(vendorFiles)
    }, [vendorFiles])
    const handleChange = (e) => {
        const filesArray = Object.values(e.target.files);
        // filesArray.length -= 1;
        setFiles(prev => {
            const newState = [...prev];
            let contains = false;
            for (let i = 0; i < filesArray.length; i++) {
                contains = false;
                for (let j = 0; j < prev.length; j++)
                    if (filesArray[i].name === prev[j].val.name) {
                        contains = true
                        break;
                    }
                if (!contains)
                    newState.push({key: Math.random(), val: filesArray[i]})
            }
            attachmentsRef.current = newState;
            return newState;
        })
    }
    const handleFileRemove = (key) => {
        setFiles(prev => {
            const newState = prev.filter(file => file.key !== key);
            attachmentsRef.current = newState;
            return newState
        })
    }
    return (
        <div style={{ width: '100%' }}>
            <div>
                {
                    files.map(file => {
                        const src = typeof(file.val) === 'string' ? `http://172.16.3.101:54321/original/${file.val}` : URL.createObjectURL(file.val);
                        return (
                            <div style={{ position: 'relative', display: 'inline-block' }} key={file.key} >
                                <a
                                    href={src} title={file.val.name}
                                    style={{ display: 'inline-block' }}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    download
                                >
                                    <AiOutlineFilePdf size="40" />
                                </a>
                                <AiFillCloseCircle
                                    onClick={() => handleFileRemove(file.key)}
                                    style={{ position: 'absolute', top: '-5px', right: '-4px', zIndex: 1 }}
                                />
                            </div>
                        )
                    }
                    )
                }
            </div>
            <div>
                <div style={{ float: 'right' }}>
                    <label htmlFor="files">
                        <ImAttachment cursor="pointer" />
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