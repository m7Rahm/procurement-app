import React, { useCallback, useState, useEffect } from 'react'
import AgreementMaterials from '../../components/Tender/AgreementMaterials'
import AgreementVendors from '../../components/Tender/AgreementVendors'
import useFetch from '../../hooks/useFetch';
const NewAgreement = () => {
    const [isEmpty, setIsEmpty] = useState(true);
    const fetchGet = useFetch("GET")
    const fetchFunction = useCallback(() =>
        fetchGet('http://192.168.0.182:54321/api/get-agreement-in-staging-area'), [fetchGet])
    useEffect(() => {
        fetchFunction()
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
                            fetchFunction={fetchFunction}
                            editable={true}
                        />
                        <AgreementVendors
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

