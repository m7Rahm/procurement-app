import React, { useState, useEffect, useRef } from 'react'
import { FaEdit } from 'react-icons/fa';
import { useHistory, useRouteMatch } from 'react-router-dom';
import useFetch from '../../hooks/useFetch';
const CardContent = ({ budget, category, period }) => {
    const [subGlBudgets, setSubGlBudgets] = useState([]);
    const fetchPost = useFetch("POST");
    const handleClick = () => {

    }
    useEffect(() => {
        const data = {
            from: 0,
            next: 20,
            period: period,
            structureid: budget.structure_id,
            glCategoryid: category
        };
        fetchPost('http://192.168.0.182:54321/api/structure-budget-per-gl-category', data)
            .then(respJ => setSubGlBudgets(respJ))
            .catch(ex => console.log(ex))
    }, [fetchPost, category, budget, period]);
    return (
        <div style={{ padding: "20px 0px" }}>
            <ul className="sub-gl-category-budget">
                {
                    subGlBudgets.map((subGlCategory, index) =>
                        <li onClick={handleClick} key={index}>
                            <div>
                                <span style={{ paddingRight: "10px" }}>{subGlCategory.sub_code}</span>
                                {subGlCategory.sub_gl_category_name}
                            </div>
                            <div>{subGlCategory.budget}</div>
                        </li>
                    )
                }
            </ul>
        </div>
    )
}
const StructureBudgetCard = (props) => {
    const [expanded, setExpanded] = useState(false);
    const budget = props.budget;
    const state = props.state;
    const period = props.period;
    const history = useHistory();
    const { url } = useRouteMatch();
    const cardRef = useRef(null);
    const handleClick = () => {
        setExpanded(prev => !prev)
    }
    const handleEditClick = (glCategoryid) => {
        const newState = { ...state, glCategoryid }
        history.push(`${url}/info`, newState)
    }
    return (
        <li ref={cardRef} onClick={handleClick}>
            <h1 style={{ position: "absolute", left: "20px", color: "white" }}>{budget.parent_code}</h1>
            <div style={{ height: "2.5rem" }}>
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