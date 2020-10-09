import React from 'react'

const BudgetPerSubGl = ({ budget, glCategories, subGlCategories, index, materialCategories, materialSubCategories }) => {
    const [disabled, setDisabled] = useState(true);
    const [budgetRow, setBudgetRow] = useState(budget);
    const toggleEdit = () => {
        setDisabled(prev => !prev)
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setBudgetRow(prev => ({...prev, [name]: value}))
    }
    return (
        <li>
            <div>{index}</div>
            <div>
                <select disabled={disabled} name="gl_category_id" value={budgetRow.gl_category_id} onChange={handleChange}>
                    {
                        glCategories.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    }
                </select>
            </div>
            <div>
            <select disabled={disabled} name="sub_gl_category_id" value={budgetRow.sub_gl_category_id || ''} onChange={handleChange}>
                    {
                        subGlCategories.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    }
                </select>
            </div>
            <div>
                <select disabled={disabled} name="category_id" value={budgetRow.category_id} onChange={handleChange}>
                    {
                        materialCategories.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    }
                </select>
            </div>
            <div>
                <select disabled={disabled} name="sub_category_id" value={budgetRow.sub_category_id || ''} onChange={handleChange}>
                    {
                        materialSubCategories.map(category =>
                            <option key={category.id} value={category.id}>{category.name}</option>
                        )
                    }
                </select>
            </div>
            <div><input disabled={disabled} value="90923" name="blanco" onChange={handleChange}/></div>
            <div>{budgetRow.budget}</div>
            <div><MdEdit onClick={toggleEdit} /></div>
        </li>
    )
}
export default BudgetPerSubGl