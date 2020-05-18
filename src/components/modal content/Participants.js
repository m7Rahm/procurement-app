import React from 'react'

export default (props) => {
    return (
        <ul style={{ marginTop: '25%', paddingLeft: '0px' }}>
            {props.participants.map((participant, index) => <li key={index}>{participant.fullname}</li>)}
        </ul>
    )
}