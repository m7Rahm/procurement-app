import React from 'react'

const NewOrderHeader = (props) => {
    const mainCategories = props.categories.filter(category => category.parent_id === 34);
    const categoryid = props.category;
    const handleChange = (e) => {
        const type = 'setCategory'
        props.dispatch({ type: type, payload: { value: Number(e.target.value) } })
    }
    return (
        <div>
            <div className="new-order-header">
                <div>
                    <label htmlFor="destination">Təyinat</label>
                    <br />
                    <select onChange={handleChange} name="category" value={categoryid} type="text">
                        {
                            mainCategories.map((category, index) =>
                                <option key={index} value={category.id}>{category.product_title}</option>
                            )
                        }
                    </select>
                </div>
                {/* <div>
                    <label required={true} htmlFor="deadline">Deadline</label>
                    <br />
                    <input onChange={handleChange} name="deadline" value={props.deadline} required={true} type="date" />
                </div> */}
            </div>
        </div>
    )
}
export default NewOrderHeader