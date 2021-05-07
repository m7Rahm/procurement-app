import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { MdModeEdit, MdDone, MdClose } from 'react-icons/md'
import { FaPlus } from 'react-icons/fa'
import { AiFillCheckCircle } from 'react-icons/ai'
import OperationResult from '../../components/Misc/OperationResult'
import Pagination from '../../components/Misc/Pagination'
import useFetch from '../../hooks/useFetch';
const OrderMaterials = () => {
    const [departments, setDepartments] = useState([]);
    const [units, setUnits] = useState([]);
    const glCategoriesRef = useRef([]);
    const [glCategories, setGlCategories] = useState([]);
    const activePageRef = useRef(0);
    const [tableData, setTableData] = useState({ content: [], count: 0 });
    const fetchGet = useFetch("GET");
    const fetchPost = useFetch("POST");
    const refreshContent = (from) => {
        const data = {
            categoryid: 34,
            subGlCategoryId: 0,
            from: from,
            next: 20
        }
        fetchPost('http://192.168.0.182:54321/api/get-models', data)
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setTableData({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }
    useEffect(() => {
        fetchGet('http://192.168.0.182:54321/api/gl-categories')
            .then(respJ => {
                glCategoriesRef.current = respJ;
                const glCategories = respJ.filter(category => category.dependent_id === 0);
                setGlCategories(glCategories);
            })
            .catch(ex => console.log(ex))
        fetchGet('http://192.168.0.182:54321/api/cluster-names')
            .then(respJ => setUnits(respJ))
            .catch(ex => console.log(ex))
        fetchGet('http://192.168.0.182:54321/api/departments')
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [fetchGet])
    useLayoutEffect(() => {
        const data = {
            categoryid: 34,
            subGlCategoryId: 0,
            from: 0,
            next: 20
        }
        fetchPost('http://192.168.0.182:54321/api/get-models', data)
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setTableData({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }, [fetchPost])
    return (
        <div className="sys-param-modal">
            <div >
                <table style={{ marginTop: '30px' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px' }}>#</th>
                            <th>Ad</th>
                            <th>GL Kateqoriya</th>
                            <th>Sub-Gl Kateqoriya</th>
                            <th>Kurasiya</th>
                            <th>Növ</th>
                            <th style={{ maxWidth: '100px' }}>Qiymət</th>
                            <th style={{ maxWidth: '100px' }}>Kod</th>
                            <th>Optimal miqdar</th>
                            <th>Ölçü vahidi</th>
                            <th>Inventardır</th>
                            <th>Əsas Vəsaitdir</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <NewMaterial
                            glCategoriesRef={glCategoriesRef}
                            glCategories={glCategories}
                            units={units}
                            departments={departments}
                            setTableData={setTableData}
                        />
                        {
                            tableData.content.map((material, index) =>
                                <TableRow
                                    index={activePageRef.current * 20 + index + 1}
                                    material={material}
                                    glCategoriesRef={glCategoriesRef}
                                    glCategories={glCategories}
                                    departments={departments}
                                    key={material.id}
                                    units={units}
                                />
                            )
                        }
                    </tbody>
                </table>
            </div>
            <Pagination
                count={tableData.count}
                activePageRef={activePageRef}
                updateList={refreshContent}
            />
        </div>
    )
}
export default OrderMaterials

const TableRow = ({ index, material, departments, units, glCategories, glCategoriesRef }) => {
    const fetchPost = useFetch("POST");
    const [materialData, setMaterialData] = useState({ ...material, type: material.is_service ? "1" : "0" });
    const [disabled, setDisabled] = useState(true);
    const inventoryRef = useRef(null);
    const esasVesaitRef = useRef(null);
    const titleRef = useRef(null);
    const codeRef = useRef(null);
    const optimalQuantity = useRef(null);
    // eslint-disable-next-line
    const subCategories = glCategoriesRef.current.filter(glCategory => glCategory.dependent_id == materialData.gl_category_id);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setMaterialData(prev => ({ ...prev, [name]: value }))
    }
    const handleEdit = () => {
        setDisabled(prev => !prev)
    }
    const handleCancel = () => {
        setMaterialData(material);
        setDisabled(prev => !prev)
    }
    const handleUpdate = () => {
        const data = {
            ...materialData,
            title: titleRef.current.value,
            sub_gl_category_id: materialData.sub_gl_category_id,
            isInv: inventoryRef.current.checked,
            isEsasVesait: esasVesaitRef.current.checked,
            optimal_quantity: optimalQuantity.current.value
        };
        fetchPost('http://192.168.0.182:54321/api/update-material', data)
            .then(() => setDisabled(true))
            .catch(ex => console.log(ex))
    }
    const handlePriceChange = (e) => {
        const value = e.target.value;
        setMaterialData(prev => ({ ...prev, approx_price: /^\d*(\.)?\d{0,2}$/.test(value) ? value : prev.approx_price }))
    }
    return (
        <tr>
            <th>{index}</th>
            <td>
                <input defaultValue={materialData.title} name="title" disabled={disabled} ref={titleRef} />
            </td>
            <td>
                <select disabled={disabled} onChange={handleChange} name="gl_category_id" value={materialData.gl_category_id}>
                    <option value="-1">-</option>
                    {
                        glCategories.map(cat =>
                            <option key={cat.id} value={cat.id}>{`${cat.code} ${cat.name}`}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select disabled={disabled} name="sub_gl_category_id" onChange={handleChange}  value={materialData.sub_gl_category_id}>
                    <option value="-1">-</option>
                    {
                        subCategories.map(subCat =>
                            <option key={subCat.id} value={subCat.id}>{`${subCat.code} ${subCat.name}`}</option>
                        )
                    }
                </select>
            </td>
            <td style={{ width: '250px' }}>
                <select disabled={disabled} name="department_id" onChange={handleChange} value={materialData.department_id}>
                    <option value="-1">-</option>
                    {
                        departments.map(department =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select disabled={disabled} name="type" onChange={handleChange} value={materialData.type}>
                    <option value="0">Mal-Material</option>
                    <option value="1">Xidmət</option>
                </select>
            </td>
            <td style={{ maxWidth: '100px' }}>
                <input value={materialData.approx_price} name="approx_price" disabled={disabled} onChange={handlePriceChange} />
            </td>
            <td>
                <input disabled={true} defaultValue={materialData.product_id} name="product_id" ref={codeRef} />
            </td>
            <td>
                <input  disabled={disabled} defaultValue={materialData.optimal_quantity} ref={optimalQuantity} />
            </td>
            <td>
                <select name="cluster" disabled={disabled} onChange={handleChange} value={materialData.cluster}>
                    {
                        units.map(unit =>
                            <option value={unit.id} key={unit.id}>{unit.title}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <input disabled={disabled} type="checkbox" ref={inventoryRef} defaultChecked={materialData.is_inventory} />
            </td>
            <td>
                <input disabled={disabled} type="checkbox" ref={esasVesaitRef} defaultChecked={materialData.is_esas_vesait} />
            </td>
            <td>
                {
                    disabled
                        ? <MdModeEdit color="#195db6" cursor="not-allowed" onClick={handleEdit} />
                        : <>
                            <MdDone onClick={handleUpdate} />
                            <MdClose onClick={handleCancel} />
                        </>
                }
            </td>
        </tr>
    )
}
const NewMaterial = React.memo((props) => {
    const { glCategoriesRef, glCategories, units, departments, setTableData } = props
    const unitsRef = useRef(null);
    const glCategoryRef = useRef(null);
    const curatoridRef = useRef(null);
    const inventoryRef = useRef(null);
    const esasVesaitRef = useRef(null);
    const optimalQuantity = useRef(null);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
    const [newCatState, setNewCatState] = useState({
        title: '',
        department: 1,
        procurement: '',
        approx_price: '',
        cluster: '',
        gl_category_id: '-1',
        sub_gl_category_id: '-1',
        type: 0
    });
    const fetchPost = useFetch("POST");
    const handleAddNewCategory = () => {
        const gl_category_id = glCategoryRef.current.value;
        const data = {
            ...newCatState,
            department: curatoridRef.current.value,
            gl_category_id,
            approxPrice: newCatState.approx_price,
            cluster: unitsRef.current.value,
            is_inventory: inventoryRef.current.checked,
            is_esas_vesait: esasVesaitRef.current.checked,
            optimal_quantity: optimalQuantity.current.value
        };
        if (data.title !== "" && gl_category_id !== "-1" && data.sub_gl_category_id !== "-1")
            fetchPost('http://192.168.0.182:54321/api/add-new-cat', data)
                .then(respJ => {
                    if (respJ[0].result === 'success') {
                        const { row_id: id, product_id } = respJ[0];
                        setOperationResult({ visible: true, desc: 'Əməliyyat uğurla tamamlandı', backgroundColor: "white", iconColor: "rgb(15, 157, 88)", icon: AiFillCheckCircle })
                        setTableData(prev => ({ content: [...prev.content, { ...data, id, product_id, is_service: data.type === "1", optimal_quantity: optimalQuantity.current.value }], count: prev.count + 1 }));
                        inventoryRef.current.checked = false;
                        setNewCatState({ gl_category_id: "-1", sub_gl_category_id: "-1", title: "", approx_price: "" });
                        curatoridRef.current.value = "-1"
                        optimalQuantity.current.value = 0
                    } else {
                        setOperationResult({ visible: true, desc: 'Əməliyyat uğurla tamamlandı' })
                    }
                })
                .catch(ex => {
                    const message = ex.message === 403 ? "Unauthorized" : "Xəta baş verdi"
                    setOperationResult({ visible: true, desc: message })
                })
        else
            setOperationResult({ visible: true, desc: "Xanalar düzgün doldurulmamışdır" })
    }
    const handlePriceChange = (e) => {
        const value = e.target.value;
        setNewCatState(prev => ({ ...prev, approx_price: /^\d*(\.)?\d{0,2}$/.test(value) ? value : prev.approx_price }))
    }
    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setNewCatState(prev => ({ ...prev, [name]: value }))
    }
    return (
        <tr>
            <td>
                {
                    operationResult.visible &&
                    <OperationResult
                        setOperationResult={setOperationResult}
                        operationDesc={operationResult.desc}
                        backgroundColor={operationResult.backgroundColor}
                        iconColor={operationResult.iconColor}
                        icon={operationResult.icon}
                    />
                }
            </td>
            <td>
                <input type="text" name="title" value={newCatState.title} onChange={handleChange} />
            </td>
            <td>
                <select onChange={handleChange} name="gl_category_id" value={newCatState.gl_category_id} ref={glCategoryRef}>
                    <option value="-1">-</option>
                    {
                        glCategories.map(category =>
                            <option key={category.id} value={category.id}>{`${category.code} ${category.name}`}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select onChange={handleChange} name="sub_gl_category_id" value={newCatState.sub_gl_category_id}>
                    <option value="-1">-</option>
                    {
                        glCategoriesRef.current.filter(glCategory => glCategory.dependent_id === Number(newCatState.gl_category_id))
                            .map(subGlCategory =>
                                <option key={subGlCategory.id} value={subGlCategory.id}>{`${subGlCategory.code} ${subGlCategory.name}`}</option>
                            )
                    }
                </select>
            </td>
            <td>
                <select onChange={handleChange} name="department" ref={curatoridRef}>
                    <option value="-1">-</option>
                    {
                        departments.map(department =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select onChange={handleChange} name="type" value={newCatState.type}>
                    <option value="0">Mal-Material</option>
                    <option value="1">Xidmət</option>
                </select>
            </td>
            <td style={{ maxWidth: '100px' }}>
                <input name="approx_price" value={newCatState.approx_price} onChange={handlePriceChange} />
            </td>
            <td style={{ maxWidth: '100px' }}>
            </td>
            <td>
                <input defaultValue="0" ref={optimalQuantity} />
            </td>
            <td>
                <select ref={unitsRef}>
                    {
                        units.map(unit =>
                            <option value={unit.id} key={unit.id}>{unit.title}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <input type="checkbox" ref={inventoryRef} defaultChecked={false} />
            </td>
            <td>
                <input type="checkbox" ref={esasVesaitRef} defaultChecked={false} />
            </td>
            <td><FaPlus onClick={handleAddNewCategory} cursor="pointer" /></td>
        </tr>
    )
}
)