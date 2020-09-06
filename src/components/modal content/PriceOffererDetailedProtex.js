import React from 'react'
import {
    IoMdClose
} from 'react-icons/io'
import { incoTerms } from '../../data/data'
const PriceOffererDetailed = (props) => {
    // console.log(props.prices);
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
                                props.prices.map((detail, index) =>
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{detail.material_name}</td>
                                        <td>{detail.model}</td>
                                        <td>{detail.amount}</td>
                                        <td>{detail.unit || 'ədəd'}</td>
                                        <td>
                                            <select
                                                disabled={true}
                                                style={{ backgroundColor: 'white', fontSize: '14px', minWidth: '60px' }}
                                                name="delType" value={detail.del_type}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            >
                                                {
                                                    incoTerms.map(supplier =>
                                                        <option value={supplier.id} key={supplier.id}>{supplier.name}</option>
                                                    )
                                                }
                                            </select></td>
                                        <td>
                                            <input
                                                name="delDur"
                                                disabled={true}
                                                value={detail.del_dur}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="price"
                                                disabled={true}
                                                value={detail.price}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="amount"
                                                value={detail.amount}
                                                disabled={true}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="approxTranFee"
                                                disabled={true}
                                                value={detail.approx_tran_fee}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="impFee"
                                                disabled={true}
                                                value={detail.imp_fee}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="vat"
                                                disabled={true}
                                                value={detail.vat}
                                                onChange={(e) => props.handleAdvChange(e, detail.id, detail.amount)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                name="total"
                                                disabled={true}
                                                value={detail.total}
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