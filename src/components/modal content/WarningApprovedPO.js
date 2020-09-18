import React from 'react'

const WarningApprovedPO = (props) => {
    const bodyGenInfo = props.approvedData.map(data =>
        ({
            materialName: data.material_name,
            quantity: data.amount,
            model: data.model,
            unit: 'ədəd',
            offererName: data.offerer_name,
            price: data.price,
            amount: data.amount,
            total: data.total
        }))
    const sum = props.approvedData.reduce((acc, current) => acc += current.total, 0)
    return (
        <div>
            <table className="warning-already-approved-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Malın adı</th>
                        <th>Texniki göstərici</th>
                        <th>Miqdar</th>
                        <th>Say</th>
                        <th colSpan={3}>Şirkət</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        bodyGenInfo.map((data, index) =>
                            <React.Fragment key={index}>
                                <tr>
                                    <td rowSpan={2}>
                                        {index += 1}
                                    </td>
                                    <td rowSpan={2}>
                                        {data.materialName}
                                    </td>
                                    <th rowSpan={2}>
                                        {data.model}
                                    </th>
                                    <td rowSpan={2}>
                                        {data.quantity}
                                    </td>
                                    <td rowSpan={2}>
                                        {data.unit}
                                    </td>
                                    <th colSpan={3}>
                                        {data.offererName}
                                    </th>
                                </tr>
                                <tr>
                                    <td style={{ width: '60px' }}>{data.price}</td>
                                    <td style={{ width: '60px' }}>{data.amount}</td>
                                    <td style={{ width: '60px' }}>{data.total}</td>
                                </tr>
                            </React.Fragment>
                        )
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}><i>Cəm</i></td>
                        <th colSpan={3}>{sum}</th>
                    </tr>
                </tfoot>
            </table>
        </div >
    )
}
export default WarningApprovedPO