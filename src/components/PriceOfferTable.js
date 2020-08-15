import React
    // ,{ useState } 
    from 'react'
import {
    IoMdAttach
} from 'react-icons/io'
import {
    BsTrash2
} from 'react-icons/bs'
const PriceOfferTable = (props) => {
    // const [tableState, setTableState] = useState([])
    return (
        <div>
            <table className="price-offer-table">
                <thead>
                    <tr><td colSpan={999}>Şirkət/təklif-USD</td></tr>
                    <tr>
                        <td rowSpan={4}>№</td>
                        <td rowSpan={4}>Malın adı</td>
                        <td rowSpan={4}>Texniki göstərici</td>
                        <td rowSpan={4}>Miqdar</td>
                        <td rowSpan={4}>Say</td>
                    </tr>
                    <tr>
                        <td colSpan={2}>
                            <div>
                                <select>
                                    <option>1</option>
                                    <option>1</option>
                                    <option>1</option>
                                </select>
                                <span>
                                    <IoMdAttach title="şəkil əlavə et" size="24"/>
                                    <BsTrash2 title="sil"  size="24"/>
                                </span>
                            </div>
                        </td>
                        <td colSpan={2}>
                            <div>
                                <select>
                                    <option>1</option>
                                    <option>1</option>
                                    <option>1</option>
                                </select>
                                <span>
                                    <IoMdAttach title="şəkil əlavə et" size="24"/>
                                    <BsTrash2 title="sil" size="24"/>
                                </span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td colSpan={2}><input /></td>
                        <td colSpan={2}><input /></td>
                    </tr>
                    <tr>
                        <td colSpan={2}><input placeholder="təslim müddəti" /></td>
                        <td colSpan={2}><input placeholder="təslim müddəti" /></td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Kamera Hikvision</td>
                        <td>2 mp IP Kamera</td>
                        <td>222</td>
                        <td>ədəd</td>
                        <td><input placeholder="qiymət" /></td>
                        <td><input placeholder="məbləğ" /></td>
                        <td><input placeholder="qiymət" /></td>
                        <td><input placeholder="məbləğ" /></td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={5}>Cəm</td>
                        <td colSpan={2}>16,620.00</td>
                        <td colSpan={2}>16,620.00</td>
                    </tr>
                    <tr>
                        <td colSpan={5}>Təxmini daşınma rüsumu</td>
                        <td colSpan={2}>16,620.00</td>
                        <td colSpan={2}>2,300.00</td>
                    </tr>
                    <tr>
                        <td colSpan={5}>15% idxal rüsumu</td>
                        <td colSpan={2}>16,620.00</td>
                        <td colSpan={2}>2,838.00</td>
                    </tr>
                    <tr>
                        <td colSpan={5}>18% ƏDV</td>
                        <td colSpan={2}>16,620.00</td>
                        <td colSpan={2}>3,916.44</td>
                    </tr>
                    <tr>
                        <td colSpan={5}>Yekun məbləğ</td>
                        <td colSpan={2}>16,620.00</td>
                        <td colSpan={2}>25,674.44</td>
                    </tr>
                    <tr>
                        <td colSpan={5}>Təsdiq olunan təklif</td>
                        <td colSpan={2}> </td>
                        <td colSpan={2}> </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}
export default PriceOfferTable