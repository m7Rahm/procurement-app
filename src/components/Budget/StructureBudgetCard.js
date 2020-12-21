import React, { useState, useEffect, useContext, useRef } from 'react'
import { TokenContext } from '../../App'
import { FaEdit } from 'react-icons/fa';
import { useHistory, useRouteMatch } from 'react-router-dom';
const CardContent = React.forwardRef(({ budget, category, period }, ref) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [subGlBudgets, setSubGlBudgets] = useState([]);
    const handleClick = () => {

    }
    useEffect(() => {
        const data = JSON.stringify({
            from: 0,
            next: 20,
            period: period,
            structureid: budget.structure_id,
            glCategoryid: category
        });
        fetch('http://172.16.3.101:54321/api/structure-budget-per-gl-category', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => setSubGlBudgets(respJ))
            .catch(ex => console.log(ex))
    }, [token, category, budget, period]);
    return (
        <div style={{ padding: '20px 0px' }}>
            <ul className="sub-gl-category-budget">
                {
                    subGlBudgets.map((subGlCategory, index) =>
                        <li onClick={handleClick} key={index}>
                            <div>{subGlCategory.sub_gl_category_name}</div>
                            <div>{subGlCategory.budget}</div>
                        </li>
                    )
                }
            </ul>
        </div>
    )
})
const StructureBudgetCard = (props) => {
    const [expanded, setExpanded] = useState(false);
    const budget = props.budget;
    const state = props.state;
    const period = props.period;
    const history = useHistory();
    const { url } = useRouteMatch();
    const cardRef = useRef();
    const handleClick = () => {
        setExpanded(prev => !prev)
    }
    const handleEditClick = (glCategoryid) => {
        const newState = {...state, glCategoryid }
        history.push(`${url}/info`, newState)
    }
    return (
        <li ref={cardRef} onClick={handleClick}>
            <div>
                <span onClick={() => handleEditClick(budget.gl_category_id)}>
                    <FaEdit />
                </span>
            </div>
            <div>
                <h1>{budget.gl_category_name}</h1>
                {
                    expanded &&
                    <CardContent
                        budget={budget}
                        period={period}
                        category={budget.gl_category_id}
                    />
                }
            </div>
            <div>
                {budget.budget}
            </div>
        </li>
    )
}
export default StructureBudgetCard