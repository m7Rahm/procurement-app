import React, { useContext, useEffect, useState } from 'react'
import { TokenContext } from '../../../App'
import { FaFilePdf } from 'react-icons/fa'
const AgreementVendorFiles = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [files, setFiles] = useState([]);
    useEffect(() => {
        fetch(`http://192.168.0.182:54321/api/agreement-files?agreementid=${props.agreementid}&vendorid=${props.vendorid}`, {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setFiles(respJ))
            .catch(ex => console.log(ex));
    }, [props.agreementid, props.vendorid, token])
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