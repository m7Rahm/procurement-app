import React, { lazy, Suspense } from 'react'
const BudgetIncRequestContent = lazy(() => import("../MiscDocs/BudgetIncRequestContent"))
const MiscDocContainer = (props) => {
    const { tranid, docid, docType } = props;
    return (
        <>
            <Suspense fallback="">
                {
                    docType === 1
                        ? <BudgetIncRequestContent
                            tranid={tranid}
                            docid={docid}
                            docType={docType}
                        />
                        : null
                }
            </Suspense>
        </>
    )
}
export default React.memo(MiscDocContainer)