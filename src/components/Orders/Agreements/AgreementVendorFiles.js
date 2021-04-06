import React, { useEffect, useState } from 'react'
import { FaFilePdf } from 'react-icons/fa'
import useFetch from '../../../hooks/useFetch';
const AgreementVendorFiles = (props) => {
    const [files, setFiles] = useState([]);
    const fetchGet = useFetch("GET");
    useEffect(() => {
        fetchGet(`http://192.168.0.182:54321/api/agreement-files?agreementid=${props.agreementid}&vendorid=${props.vendorid}`)
            .then(respJ => setFiles(respJ))
            .catch(ex => console.log(ex));
    }, [props.agreementid, props.vendorid, fetchGet])
    return (
        <div className="files-ribbon">
            {
                files.map(file =>
                    <a key={file.id} target="_blank" rel="noopener noreferrer" href={`http://192.168.0.182:54321/original/${file.name}`} title={file.name}>
                        <FaFilePdf color="purple" size="45" />
                    </a>
                )
            }
        </div>
    )
}
export default AgreementVendorFiles