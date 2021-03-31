import React, { lazy, Suspense, useContext } from "react"
import { TokenContext } from "../../App.js"
const DecommissionContent = lazy(() => import("../MiscDocs/DecommissionContent"));
const BudgetIncRequestContent = lazy(() => import("../MiscDocs/BudgetIncRequestContent"))
const MiscDocContainer = (props) => {
    const { docid, docType } = props;
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const fetchParticipants = () => {
        return fetch(`http://192.168.0.182:54321/api/misc-doc-participants?docid=${docid}&docType=${docType}`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
    }
    return (
        <>
            <Suspense fallback="">
                {
                    docType === 1
                        ? <BudgetIncRequestContent
                            docid={docid}
                            docType={docType}
                            token={token}
                            fetchParticipants={fetchParticipants}
                            setInitData={props.setInitData}
                        />
                        : docType === 2
                            ? <DecommissionContent
                                docid={docid}
                                docType={docType}
                                token={token}
                                fetchParticipants={fetchParticipants}
                                setInitData={props.setInitData}
                            />
                            : <>
                            </>
                }
            </Suspense>
        </>
    )
}
export default React.memo(MiscDocContainer)