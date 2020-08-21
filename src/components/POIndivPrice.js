import React from 'react'

const POIndivPrice = (props) => {
    return (
        <>
            <div className="offerer-price-container">
                <input
                    onChange={(e) => {props.handleAdvChange(e, props.id, props.amount)}}
                    value={props.values[props.id].price}
                    name="price"
                    title="qiymət"
                    placeholder="qiymət" />
                <input
                    onChange={(e) => {props.handleAdvChange(e, props.id, props.amount)}}
                    value={props.values[props.id].amount}
                    name="amount"
                    title="cəmi məbləğ"
                    placeholder="məbləğ" />
                <input
                    onChange={() => {}}
                    value={props.values[props.id].total}
                    name="total"
                    title="yekun məbləğ"
                    placeholder="yekun" />
            </div>
        </>
    )
}
export default POIndivPrice