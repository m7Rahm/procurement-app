import React, { useRef, useState } from "react"
import useFetch from "../../hooks/useFetch"

const apiData = {
    categoryid: 34,
    name: "",
    code: "",
    subGlCategoryId: 0,
    from: 0,
    next: 20,
    type: -1
}
const MaterialsSearch = (props) => {
    const [visibleCategories, setVisibleCategories] = useState(props.glCategoriesRef.current)
    const timeoutRef = useRef(null)

    const handleGlCategoryChange = (e) => {
        if(e.target.value === "")
            apiData.subGlCategoryId = 0
        const value = e.target.value.split("").reduce((acc, curr) => acc += `${curr}(.*)`, "");
        const strRegExp = new RegExp(value, 'gi');
        const highlightRegExp = new RegExp(`[${e.target.value}]`, 'gi')
        const newCategories = props.glCategoriesRef.current
            .filter(category => category.dependent_id !== 0 && `${category.code} ${category.name}`.match(strRegExp))
            .map(category =>
                ({ ...category, html: category.name.replace(highlightRegExp, (text) => `<i>${text}</i>`) + `<span>${category.code}</span>` })
            )
        setVisibleCategories(newCategories)
    }
    const glCategoryRef = useRef(null);
    const fetchPost = useFetch("POST");
    const handleInputChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        const delay = name === "name" || name === "code" ? 500 : 0
        if(name === "subGlCategoryId")
            glCategoryRef.current.value = e.target.title
        timeoutRef.current = setTimeout(() => {
            apiData[name] = value;
            fetchPost("http://192.168.0.182:54321/api/get-models", apiData)
                .then(respJ => {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    props.setTableData({ count: totalCount, content: respJ });
                    timeoutRef.current = null;
                })
                .catch(ex => console.log(ex))
        }, delay)
    }
    const handleGlCategoryBlur = (e) => {
        const relatedTarget = e.relatedTarget
        if (relatedTarget && relatedTarget.classList.contains("category-dep")) {
            relatedTarget.click()
        } else {
            fetchPost("http://192.168.0.182:54321/api/get-models", apiData)
                .then(respJ => {
                    const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                    props.setTableData({ count: totalCount, content: respJ });
                })
                .catch(ex => console.log(ex))
        }
    }
    return (
        <div className="materials-search-ribbon">
            <div>
                <input name="name" placeholder="Məhsulun adı" onChange={handleInputChange} />
            </div>
            <div>
                <input
                    onChange={handleGlCategoryChange}
                    placeholder="Gl kod/ad"
                    name="subGlCategoryId"
                    autoComplete="off"
                    className="structures-list"
                    onBlur={handleGlCategoryBlur}
                    ref={glCategoryRef}
                />
                <ul className="structures-list" style={{ boxShadow: visibleCategories.length === 0 ? "none" : "" }}>
                    {
                        visibleCategories.map(category =>
                            <li
                                tabIndex="1"
                                dangerouslySetInnerHTML={{ __html: category.html }}
                                className="category-dep"
                                key={category.id}
                                onClick={() => handleInputChange({ target: { name: "subGlCategoryId", value: category.id, title: category.name } })}
                            >
                            </li>
                        )
                    }
                </ul>
            </div>
            <div>
                <input name="code" placeholder="Məhsulun kodu" onChange={handleInputChange} />
            </div>
            <div>
                <select name="type" onChange={handleInputChange}>
                    <option value="-1">-</option>
                    <option value="0">Mal-material</option>
                    <option value="1">Xidmət</option>
                </select>
            </div>
        </div>
    )
}
export default MaterialsSearch