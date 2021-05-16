import React, { useContext, useEffect, useRef, useState } from 'react'
import { TokenContext } from '../../App'
import Pagination from '../../components/Misc/Pagination';
import { FaCheck, FaEdit, FaPlus, FaTimes } from 'react-icons/fa'
import OperationResult from '../../components/Misc/OperationResult'
import useFetch from '../../hooks/useFetch';
import ContentLoading from "../../components/Misc/ContentLoading"
const GlCategories = () => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [glCategories, setGlCategories] = useState({ content: [], count: 0, all: [] });
    const activePageRef = useRef(0);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
    const [structures, setStructures] = useState({ warehouse: [], procurement: [] });
    const glCategoryRef = useRef(null);
    const codeRef = useRef(null);
    const fetchUpdateList = useFetch("GET");
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchUpdateList(`http://192.168.0.182:54321/api/budget-gl-categories?from=0&all=true`)
            .then(respJ => {
                const totalCount = respJ[0].total_count;
                const parents = respJ.filter(category => category.dependent_id === 0);
                setGlCategories({ content: respJ.filter((_, index) => index < 20), all: parents, count: totalCount })
                setLoading(false)
            })
            .catch(ex => console.log(ex));
        fetchUpdateList("http://192.168.0.182:54321/api/departments")
            .then(respJ => {
                const warehouse = respJ.filter(department => department.type === 2)
                const procurement = respJ.filter(department => department.type === 3);
                setStructures({ warehouse: warehouse, procurement: procurement })
            })
    }, [fetchUpdateList]);
    const updateList = (from) => {
        let query = "";
        if (codeRef.current.value !== "")
            query += `&code=${codeRef.current.value}`
        if (glCategoryRef.current.value !== "0")
            query += `&parentid=${glCategoryRef.current.value}`
        fetchUpdateList(`http://192.168.0.182:54321/api/budget-gl-categories?from=${from}${query}`)
            .then(respJ => {
                const totalCount = respJ[0].total_count;
                setGlCategories(prev => ({ ...prev, content: respJ, count: totalCount }))
            })
            .catch(ex => console.log(ex));
    }
    const handleSearch = () => {
        updateList(0)
    }
    return (
        <div style={{ paddingTop: "56px" }}>
            {
                operationResult.visible &&
                <OperationResult
                    setOperationResult={setOperationResult}
                    operationDesc={operationResult.desc}
                    backgroundColor="whitesmoke"
                    iconColor={operationResult.iconColor}
                    icon={operationResult.icon}
                />
            }
            <div className="budget-search">
                <div>
                    <select ref={glCategoryRef}>
                        <option value="0">-</option>
                        {
                            glCategories.all.map(category =>
                                <option key={category.id} value={category.id}>{`${category.code} ${category.name}`}</option>
                            )
                        }
                    </select>
                    <input ref={codeRef} placeholder="Kod" />
                    <div onClick={handleSearch}>Axtar</div>
                </div>
            </div>
            {
                loading ?
                    <ContentLoading />
                    : <table className="gl-categories">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>CAP</th>
                                <th>Kod</th>
                                <th>Ad</th>
                                <th>Tabe</th>
                                <th>Illik %</th>
                                <th>Anbar</th>
                                <th>Təchizat</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <NewGlCategory
                                warehouse={structures.warehouse}
                                procurement={structures.procurement}
                                self={glCategories.all}
                                token={token}
                                count={glCategories.count}
                                setOperationResult={setOperationResult}
                                setGlCategories={setGlCategories}
                            />
                            {
                                glCategories.content.map((category, index) =>
                                    <GlCategoryRow
                                        key={category.id}
                                        rn={activePageRef.current * 20 + index + 1}
                                        code={category.code}
                                        name={category.name}
                                        dependentid={category.dependent_id}
                                        warehouseid={category.warehouse_id}
                                        procurementid={category.procurement_id}
                                        warehouse={structures.warehouse}
                                        procurement={structures.procurement}
                                        self={glCategories.all}
                                        token={token}
                                        isAmortisized={category.is_amortisized}
                                        period={category.period}
                                        perc={category.perc}
                                        setGlCategories={setGlCategories}
                                        setOperationResult={setOperationResult}
                                        id={category.id}
                                    />
                                )
                            }
                        </tbody>
                    </table>
            }
            <Pagination
                count={glCategories.count}
                activePageRef={activePageRef}
                updateList={updateList}
            />
        </div>
    )
}
export default GlCategories

const GlCategoryRow = (props) => {
    const [rowData, setRowData] = useState({
        code: props.code,
        name: props.name,
        dependentid: props.dependentid,
        warehouseid: props.warehouseid,
        procurementid: props.procurementid,
        perc: props.perc,
        is_amortisized: props.isAmortisized
    });
    const [disabled, setDisabled] = useState(true);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = name !== "is_amortisized" ? e.target.value : e.target.checked;
        setRowData(prev => ({ ...prev, [name]: value }))
    }
    const handleCancel = () => {
        setRowData({
            code: props.code,
            name: props.name,
            dependentid: props.dependentid,
            warehouseid: props.warehouseid,
            procurementid: props.procurementid,
            perc: props.perc,
            is_amortisized: props.isAmortisized
        })
        setDisabled(true)
    }
    const updateGlCategory = useFetch("POST")
    const handleSave = () => {
        const data = { ...rowData, id: props.id };
        updateGlCategory("http://192.168.0.182:54321/api/update-gl-category", data)
            .then(_ => {
                setDisabled(true)
                if (rowData.name !== props.name || rowData.code !== props.code)
                    props.setGlCategories(prev =>
                        ({ ...prev, all: prev.all.map(category => category.id === props.id ? { ...category, name: rowData.name, code: rowData.code } : category) })
                    )
            })
            .catch(ex => {
                props.setOperationResult({ visible: true, desc: "Xəta baş verdi", icon: FaTimes })
                console.log(ex)
            })
    }
    const handleEditClick = () => {
        setDisabled(false)
    }
    return (
        <tr>
            <td>{props.rn}</td>
            <td><input checked={rowData.is_amortisized} type="checkbox" disabled={disabled} name="is_amortisized" onChange={handleChange} /></td>
            <td><input value={rowData.code} disabled={disabled} name="code" onChange={handleChange} /></td>
            <td><input value={rowData.name} disabled={disabled} name="name" onChange={handleChange} /></td>
            <td>
                <select value={rowData.dependentid} disabled={disabled} name="dependentid" onChange={handleChange}>
                    <option value={0}>-</option>
                    {
                        props.self.map(category =>
                            <option key={category.id} value={category.id}>{`${category.name} ${category.code}`}</option>
                        )
                    }
                </select>
            </td>
            <td><input value={rowData.perc || ''} disabled={disabled} name="perc" onChange={handleChange} /></td>
            <td>
                <select value={rowData.warehouseid} disabled={disabled} name="warehouseid" onChange={handleChange}>
                    <option value="0">-</option>
                    {
                        props.warehouse.map(department =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select value={rowData.procurementid} disabled={disabled} name="procurementid" onChange={handleChange}>
                    <option value="0">-</option>
                    {
                        props.procurement.map(department =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                {
                    disabled
                        ? <FaEdit onClick={handleEditClick} />
                        : <>
                            <FaCheck color="green" onClick={handleSave} />
                            <FaTimes color="red" onClick={handleCancel} />
                        </>
                }
            </td>
        </tr>
    )
}
const NewGlCategory = (props) => {
    const codeRef = useRef(null);
    const nameRef = useRef(null);
    const percentageRef = useRef(null)
    const dependentRef = useRef(null);
    const warehouseRef = useRef(null);
    const capexRef = useRef(null)
    const procurementRef = useRef(null);
    const fetchAddCategory = useFetch("POST");
    const addNewCategory = () => {
        const data = {
            code: codeRef.current.value,
            name: nameRef.current.value,
            dependentid: dependentRef.current.value,
            procurementid: procurementRef.current.value,
            warehouseid: warehouseRef.current.value,
            isAmortisized: capexRef.current.checked,
            perc: percentageRef.current.value
        }
        fetchAddCategory("http://192.168.0.182:54321/api/new-gl-category", data)
            .then(respJ => {
                props.setGlCategories(prev => {
                    const all = [...prev.all, { ...data, id: respJ[0].id }];
                    return { ...prev, count: prev.count + 1, all, current: prev.count > 20 ? prev.current : [...prev.current, { ...data, id: respJ[0].id }] }
                })
                capexRef.current.checked = false;
                codeRef.current.value = '';
                nameRef.current.value = ''
                percentageRef.current.value = ''
                props.setOperationResult({ visible: true, desc: 'Əməliyyat uğurla tamamlandı', icon: FaCheck, iconColor: "green" })
            })
            .catch(ex => {
                props.setOperationResult({ visible: true, desc: "Xəta baş verdi", icon: FaTimes })
                console.log(ex)
            })
    }
    return (
        <tr>
            <td> </td>
            <td> <input type="checkbox" ref={capexRef} /></td>
            <td> <input ref={codeRef} /></td>
            <td> <input ref={nameRef} /></td>
            <td>
                <select ref={dependentRef}>
                    <option value="0">-</option>
                    {
                        props.self.map(category =>
                            <option value={category.id} key={category.id}>{`${category.code} ${category.name}`}</option>
                        )
                    }
                </select>
            </td>
            <td> <input ref={percentageRef} /></td>
            <td>
                <select ref={warehouseRef}>
                    <option value="0">-</option>
                    {
                        props.warehouse.map(department =>
                            <option value={department.id} key={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select ref={procurementRef}>
                    <option value="0">-</option>
                    {
                        props.procurement.map(department =>
                            <option value={department.id} key={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <FaPlus onClick={addNewCategory} />
            </td>
        </tr>
    )
}