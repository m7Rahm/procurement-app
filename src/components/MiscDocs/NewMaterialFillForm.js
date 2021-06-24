import React, { useEffect, useRef, useState } from "react"
import useFetch from "../../hooks/useFetch";

const NewMaterialFillForm = (props) => {
    const [glCategories, setGlCategories] = useState({ parent: [], sub: [] });
    const [departments, setDepartments] = useState([]);
    const glCategoriesRef = useRef([]);
    const dataRef = useRef({
        title: props.title,
        department: -1,
        approxPrice: 0,
        type: 0,
        sub_gl_category_id: -1,
        cluster: 1,
        is_inventory: 0,
        is_esas_vesait: 0,
        optimal_quantity: 0,
        id: props.id
    })
    const handleChange = (e) => {
        const type = e.target.type
        const value = type === "checkbox" ? e.target.checked : e.target.value;
        const name = e.target.name;
        dataRef.current[name] = value;
    }
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const handleGlCategory = (e) => {
        const value = e.target.value;
        // eslint-disable-next-line
        const subGlCategories = glCategoriesRef.current.filter(category => category.dependent_id == value);
        setGlCategories(prev => ({ ...prev, sub: subGlCategories }));
    }
    useEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/gl-categories')
            .then(respJ => {
                glCategoriesRef.current = respJ;
                const glCategories = glCategoriesRef.current.filter(category => category.dependent_id === 0);
                setGlCategories(prev => ({ ...prev, parent: glCategories }));
            })
            .catch(ex => console.log(ex))
        fetchGet('http://192.168.0.182:54321/api/departments')
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [fetchGet])
    const addNewItem = () => {
        fetchPost("http://192.168.0.182:54321/api/new-item-from-req", dataRef.current)
            .then(_ => {
                props.setDocState(prev => prev.map(material => ({ ...material, material_result: 1 })))
                props.closeModal();
            })
            .catch(ex => console.log(ex))
    }
    return (
        <div className="new-material-modal-container">
            <div className="row">
                <div>
                    <label>Məhsulun adı</label>
                    <input style={{ width: "80%" }} onChange={handleChange} defaultValue={props.title} name="title" />
                </div>
                <div>
                    <label>Məhsulun növü</label>
                    <select name="type" onChange={handleChange} >
                        <option value="0">Mal-Material</option>
                        <option value="1">Xidmət</option>
                    </select>
                </div>
            </div>
            <div className="row">
                <div>
                    <label>Gl Kateqoriya</label>
                    <select onChange={handleGlCategory} name="gl_category_id">
                        <option value="-1">-</option>
                        {
                            glCategories.parent.map(cat =>
                                <option key={cat.id} value={cat.id}>{`${cat.code} ${cat.name}`}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    <label>Sub-Gl Kateqoriya</label>
                    <select name="sub_gl_category_id" onChange={handleChange}>
                        <option value="-1">-</option>
                        {
                            glCategories.sub.map(subCat =>
                                <option key={subCat.id} value={subCat.id}>{`${subCat.code} ${subCat.name}`}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    <label>Əsas vəsaitdir</label>
                    <input name="is_esas_vesait" onChange={handleChange} type="checkbox" />
                </div>
            </div>
            <div className="row">
                <div>
                    <label>Kurasiya</label>
                    <select name="department" onChange={handleChange}>
                        <option value="-1">-</option>
                        {
                            departments.map(department =>
                                <option key={department.id} value={department.id}>{department.name}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    <label>Qiymət</label>
                    <input onChange={handleChange} name="approxPrice" />
                </div>
                <div>
                    <label>Optimal miqdar</label>
                    <input onChange={handleChange} name="optimal_quantity" />
                </div>
                <div>
                    <label>Ölçü vahidi</label>
                    <select name="cluster" onChange={handleChange} defaultValue={props.unit}>
                        {
                            props.units.map(unit =>
                                <option value={unit.id} key={unit.id}>{unit.title}</option>
                            )
                        }
                    </select>
                </div>
                <div>
                    <label>Inventardır</label>
                    <input type="checkbox" name="is_inventory" onChange={handleChange} />
                </div>
            </div>
            <div style={{ cursor: "pointer", color: "white", padding: "1rem 0", borderRadius: "3px", margin: "auto", backgroundColor: "#123456" }} onClick={addNewItem}>Əlavə et</div>
        </div>
    )
}
export default NewMaterialFillForm