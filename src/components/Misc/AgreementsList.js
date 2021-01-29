import React, { useLayoutEffect, useState } from 'react'
import { FaCheck, FaTimes } from 'react-icons/fa'
import { VscLoading } from 'react-icons/vsc'
import { useHistory } from 'react-router-dom'
const getIcon = (result) => result === 1
    ? <FaCheck style={{ float: 'right' }} color="white" />
    : result === -1
        ? <FaTimes style={{ float: 'right' }} color="white" />
        : <VscLoading style={{ float: 'right' }} color="white" />
const AgreementsList = (props) => {
    const [agreements, setAgreements] = useState([]);
    const history = useHistory();
    const handleClick = (agreement) => {
        history.push('/tender/agreements', { agreement: agreement, orderState: { rightBarState: { visible: true, id: props.id }, active: props.active } });
    }
    useLayoutEffect(() => {
        let mounted = true;
        if (mounted) {
            fetch(`http://172.16.3.101:54321/api/agreements-per-ord-mat-id/${props.id}`, {
                headers: {
                    'Authorization': 'Bearer ' + props.token
                }
            })
                .then(resp => resp.json())
                .then(respJ => {
                    if (mounted) {
                        setAgreements(respJ)
                    }
                })
                .catch(ex => console.log(ex))
        }
    }, [props.id, props.token])
    return (
        <div style={{ paddingTop: '56px', marginLeft: '50px' }}>
            {
                agreements.map(agreement =>
                    <div
                        style={{ backgroundColor: 'dodgerblue', color: 'white', padding: '6px 8px', cursor: 'pointer' }}
                        key={agreement.id}
                        onClick={() => handleClick(agreement)}
                    >
                        {agreement.number}
                        {getIcon(agreement.result)}
                    </div>
                )
            }
        </div>
    )
}

export default AgreementsList