import React, { useContext, useCallback, useState, useEffect } from 'react'
import { TokenContext } from '../../App'
import AgreementMaterials from '../../components/Tender/AgreementMaterials'
import AgreementVendors from '../../components/Tender/AgreementVendors'
const NewAgreement = (props) => {
    const tokenContext = useContext(TokenContext);
    const [isEmpty, setIsEmpty] = useState(true);
    const token = tokenContext[0].token;
    const fetchFunction = useCallback(() =>
        fetch('http://172.16.3.101:54321/api/get-agreement-in-staging-area', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }), [token])
    useEffect(() => {
        fetchFunction()
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ.length !== 0)
                    setIsEmpty(false)
            })
            .catch(ex => console.log(ex))
    }, [fetchFunction])
    return (
        <div style={{ maxWidth: '1256px', margin: '100px auto' }}>
            {
                !isEmpty
                    ?
                    <>
                        <AgreementMaterials
                            token={token}
                            fetchFunction={fetchFunction}
                            editable={true}
                        />
                        <AgreementVendors
                            token={token}
                            setIsEmpty={setIsEmpty}
                        />
                    </>
                    : <div style={{ paddingTop: '10%' }}>
                        <h1 style={{ fontSize: '48px', textAlign: 'center' }}>Razılaşma yaratmaq üçün məhsul əlavə edin</h1>
                    </div>
            }
        </div>

    )
}
export default NewAgreement

