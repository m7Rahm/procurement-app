import React from 'react'
import { FaPlus, FaFilePdf, FaFileExcel, FaFileWord, FaTimesCircle } from 'react-icons/fa';
import { AiFillFileUnknown } from 'react-icons/ai'

const ContractFiles = ({ files = [], addFiles, removeFile }) => {
    return (
        <div className="uploaded-files">
            {
                files.map(file => {
                    const ext = file.ext;
                    const uri = URL.createObjectURL(file);
                    const onClick = () => window.open(uri);
                    switch (true) {
                        case /pdf/.test(ext):
                            return (
                                <div key={file.name}>
                                    <FaFilePdf title={file.name} onClick={onClick} color="#F40F02" size="36" />
                                    <FaTimesCircle size="12" onClick={() => removeFile(file)} style={{ position: 'absolute', top: '-2px', right: '0px', zIndex: 1 }} />
                                </div>
                            )
                        case /doc./.test(ext):
                            return (
                                <div key={file.name}>
                                    <a href={uri} rel="noopener noreferrer" target="_blank" download>
                                        <FaFileWord title={file.name} color="#0078d7" size="36" />
                                        <FaTimesCircle size="12" onClick={() => removeFile(file)} style={{ position: 'absolute', top: '-2px', right: '0px', zIndex: 1 }} />
                                    </a>
                                </div>
                            )
                        case /xls./.test(ext):
                            return (
                                <div key={file.name}>
                                    <a href={uri} rel="noopener noreferrer" target="_blank" download>
                                        <FaFileExcel title={file.name} onClick={onClick} color="#1D6F42" size="36" />
                                        <FaTimesCircle size="12" onClick={() => removeFile(file)} style={{ position: 'absolute', top: '-2px', right: '0px', zIndex: 1 }} />
                                    </a>
                                </div>
                            )
                        default:
                            return (
                                <div key={file.name}>
                                    <a href={uri} rel="noopener noreferrer" target="_blank" download>
                                        <AiFillFileUnknown title={file.name} size="36" />
                                        <FaTimesCircle size="12" onClick={() => removeFile(file)} style={{ position: 'absolute', top: '-2px', right: '0px', zIndex: 1 }} />
                                    </a>
                                </div>
                            )
                    }
                }
                )
            }
            <div style={{ lineHeight: '36px' }}>
                <label htmlFor="add" style={{ cursor: 'pointer' }} title="Fayl əlavə et">
                    <span style={{ verticalAlign: 'middle' }}>
                        <FaPlus />
                    </span>
                </label>
                <input
                    type="file"
                    id="add"
                    name="add"
                    multiple
                    style={{ display: 'none' }}
                    onChange={addFiles}
                />
            </div>
        </div>
    )
}

export default React.memo(ContractFiles)