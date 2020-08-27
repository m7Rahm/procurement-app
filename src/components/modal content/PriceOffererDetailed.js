import React from 'react'
import {
    IoMdClose
} from 'react-icons/io'
import { incoTerms } from '../../data/data'
const PriceOffererDetailed = (props) => {
    // console.log(props);
    return (
        <div className="price-offer-detailed">
            <div>
                <div>
                    <IoMdClose onClick={() => props.closeModal(false)} size="20" />
                    {props.supplier.name}
                </div>
                <div>
                    <table>
                        <thead>
                            <tr>
                                <td>#</td>
                                <td>Malın adı</td>
                                <td>Texniki göstərici</td>
                                <td>Miqdar</td>
                                <td>Say</td>
                                <td>Təslim növü</td>
                                <td>Təslim müddəti</td>
                                <td>Qiymət</td>
                                <td>Cəm</td>
                                <td>Daşınma xərci</td>
                                <td>15% İdxal rüsumu</td>
                                <td>18% ƏDV</td>
                                <td>Yekun məbləğ</td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.orderDetails.map((detail, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{detail.material_name}</td>
                                        <td>{detail.model}</td>
                                        <td>{detail.amount}</td>
                                        <td>{detail.unit || 'ədəd'}</td>
                                        <td>
                                            <select style={{ backgroundColor: 'white', fontSize: '14px', minWidth: '60px' }} name="delType" value={props.state.values[detail.id].delType} onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}>
                                                {
                                                    incoTerms.map(supplier =>
                                                        <option value={supplier.id} key={supplier.id}>{supplier.name}</option>
                                                    )
                                                }
                                            </select></td>
                                        <td>
                                            <input
                                                name="delDur"
                                                value={props.state.values[detail.id].delDur}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="price"
                                                value={props.state.values[detail.id].price}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="amount"
                                                value={props.state.values[detail.id].amount}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="approxTranFee"
                                                value={props.state.values[detail.id].approxTranFee}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="impFee"
                                                value={props.state.values[detail.id].impFee}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="vat"
                                                value={props.state.values[detail.id].vat}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="total"
                                                value={props.state.values[detail.id].total}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
export default PriceOffererDetailed