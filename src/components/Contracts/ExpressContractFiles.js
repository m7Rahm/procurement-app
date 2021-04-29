import React, { useEffect, useCallback, useState } from 'react'
import { FaTimesCircle, FaFileExcel, FaFileWord, FaFilePdf } from 'react-icons/fa'
import { AiFillFileUnknown } from 'react-icons/ai'
import ContractFiles from './ContractFiles'
import useFetch from '../../hooks/useFetch'
const ExpressContractFiles = (props) => {
    const [files, setFiles] = useState({ fetched: [], new: [] });
    const removeFile = useCallback((f) => {
        setFiles(prev => {
            props.stateRef.current.files = prev.new.filter(file => file.name !== f.name);
            return ({ ...prev, new: prev.new.filter(file => file.name !== f.name) })
        })
    }, [props.stateRef]);
    const addFiles = useCallback((e) => {
        const files = { ...e.target.files };
        files.length = e.target.files.length
        e.target.value = null
        setFiles(prev => {
            const newFiles = [];
            let unique = true;
            const prevFiles = prev.new;
            if (prevFiles.length !== 0) {
                for (let j = 0; j < files.length; j++) {
                    for (let i = 0; i < prevFiles.length; i++) {
                        if (files[j].name === prevFiles[i].name) {
                            unique = false;
                            break;
                        }
                    }
                    if (unique) {
                        const ext = files[j].name.split('.').pop();
                        files[j].ext = ext;
                        newFiles.push(files[j]);
                    }
                    unique = true;
                }
                props.stateRef.current.files = ({ ...prev, new: [...prev.new, ...newFiles] })
                return ({ ...prev, new: [...prev.new, ...newFiles] })
            }
            else {
                for (let i = 0; i < files.length; i++) {
                    const ext = files[i].name.split('.').pop();
                    files[i].ext = ext;
                    newFiles.push(files[i]);
                }
                props.stateRef.current.files = ({ ...prev, new: newFiles })
                return ({ ...prev, new: newFiles })
            }
        })
        return false
    }, [props.stateRef]);
    const removeFetchedFile = useCallback((f) => {
        setFiles(prev => {
            props.stateRef.current.files = ({ ...prev, fetched: prev.fetched.filter(file => file.name !== f.name) })
            return ({ ...prev, fetched: prev.fetched.filter(file => file.name !== f.name) })
        })
    }, [props.stateRef])
    const fetchGet = useFetch("GET");
    useEffect(() => {
        let mounted = true;
        if (props.id !== 0)
            fetchGet(`http://192.168.0.182:54321/api/express_contract_files/${props.id}`)
                .then(respJ => {
                    if (mounted)
                        setFiles(prev => {
                            props.stateRef.current.files = ({ ...prev, fetched: respJ });
                            return ({ ...prev, fetched: respJ })
                        })
                })
                .catch(ex => console.log(ex))
        return () => mounted = false
    }, [props.id, fetchGet, props.stateRef])
    return (
        <div style={{ overflow: 'hidden' }}>
            <FetchedFiles
                files={files.fetched}
                removeFile={removeFetchedFile}
            />
            <ContractFiles
                files={files.new}
                removeFile={removeFile}
                addFiles={addFiles}
            />
        </div>
    )
}
export default ExpressContractFiles

const FetchedFiles = React.memo(({ files = [], removeFile }) => {
    return (
        <div className="uploaded-files">
            {
                files.map(file => {
                    const ext = file.ext;
                    const url = "http://192.168.0.182:54321/original/" + file.name
                    switch (true) {
                        case /pdf/.test(ext):
                            return (
                                <div key={file.name}>
                                    <FaTimesCircle size="12" onClick={() => removeFile(file)} style={{ position: 'absolute', top: '-2px', right: '0px', zIndex: 1 }} />
                                    <a href={url} rel="noopener noreferrer" target="_blank" download>
                                        <FaFilePdf title={file.name} color="#F40F02" size="36" />
                                    </a>
                                </div>
                            )
                        case /doc./.test(ext):
                            return (
                                <div key={file.name}>
                                    <FaTimesCircle size="12" onClick={() => removeFile(file)} style={{ position: 'absolute', top: '-2px', right: '0px', zIndex: 1 }} />
                                    <a href={url} rel="noopener noreferrer" target="_blank" download>
                                        <FaFileWord title={file.name} color="#0078d7" size="36" />
                                    </a>
                                </div>
                            )
                        case /xls./.test(ext):
                            return (
                                <div key={file.name}>
                                    <FaTimesCircle size="12" onClick={() => removeFile(file)} style={{ position: 'absolute', top: '-2px', right: '0px', zIndex: 1 }} />
                                    <a href={url} rel="noopener noreferrer" target="_blank" download>
                                        <FaFileExcel title={file.name} color="#1D6F42" size="36" />
                                    </a>
                                </div>
                            )
                        default:
                            return (
                                <div key={file.name}>
                                    <FaTimesCircle size="12" onClick={() => removeFile(file)} style={{ position: 'absolute', top: '-2px', right: '0px', zIndex: 1 }} />
                                    <a href={url} rel="noopener noreferrer" target="_blank" download>
                                        <AiFillFileUnknown title={file.name} size="36" />
                                    </a>
                                </div>
                            )
                    }
                }
                )
            }
        </div>
    )
})