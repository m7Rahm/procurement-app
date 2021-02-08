import React, { useState, useEffect, useContext, useRef, useLayoutEffect } from 'react'
import {
    MdModeEdit,
    MdDone,
    MdClose,
} from 'react-icons/md'
import { FaPlus } from 'react-icons/fa'
import { AiFillCheckCircle } from 'react-icons/ai'
import { TokenContext } from '../../App';
import OperationResult from '../../components/Misc/OperationResult'
import Pagination from '../../components/Misc/Pagination'
const OrderMaterials = () => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0].token;
    const [departments, setDepartments] = useState([]);
    const [units, setUnits] = useState([]);
    const glCategoriesRef = useRef([]);
    const [glCategories, setGlCategories] = useState([])

    const activePageRef = useRef(0);

    const [tableData, setTableData] = useState({ content: [], count: 0 });
    const refreshContent = (from) => {
        const data = JSON.stringify({
            categoryid: 34,
            subGlCategoryId: 0,
            from: from,
            next: 20
        })
        fetch('http://172.16.3.101:54321/api/get-models', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setTableData({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/gl-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                glCategoriesRef.current = respJ;
                const glCategories = respJ.filter(category => category.dependent_id === null);
                setGlCategories(glCategories);
            })
            .catch(ex => console.log(ex))
    }, [token])
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/cluster-names', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setUnits(respJ))
            .catch(ex => console.log(ex))
    }, [token])
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
    }, [token]);
    useLayoutEffect(() => {
        const data = JSON.stringify({
            categoryid: 34,
            subGlCategoryId: 0,
            from: 0,
            next: 20
        })
        fetch('http://172.16.3.101:54321/api/get-models', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ.length !== 0 ? respJ[0].total_count : 0;
                setTableData({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }, [token])
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
                            {/* <th>Təchizat bölməsi</th> */}
                            <th>Növ</th>
                            <th style={{ maxWidth: '100px' }}>Qiymət</th>
                            <th>Ölçü vahidi</th>
                            <th>Inventardır</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <NewMaterial
                            glCategoriesRef={glCategoriesRef}
                            glCategories={glCategories}
                            units={units}
                            departments={departments}
                            token={token}
                            setTableData={setTableData}
                        />
                        {
                            tableData.content.map((material, index) =>
                                <TableRow
                                    index={index + 1}
                                    token={token}
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

const TableRow = React.memo(({ index, material, departments, token, units, glCategories, glCategoriesRef }) => {
    const [materialData, setMaterialData] = useState({ ...material, type: material.type ? "1" : "0" });
    const [disabled, setDisabled] = useState(true);
    const subGlCategoryRef = useRef(null);
    const inventoryRef = useRef(null);
    const subCategories = glCategoriesRef.current.filter(glCategory => glCategory.dependent_id === Number(materialData.gl_category_id));
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
        const data = JSON.stringify({ ...materialData, sub_gl_category_id: subGlCategoryRef.current.value, isInv: inventoryRef.current.value });
        fetch('http://172.16.3.101:54321/api/update-material', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': data.length
            },
            body: data
        })
            .then(resp => resp.json())
            .then(_ => setDisabled(true))
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
                <input value={materialData.title} name="title" disabled={disabled} onChange={handleChange} />
            </td>
            <td>
                <select disabled={disabled} onChange={handleChange} name="gl_category_id" value={materialData.gl_category_id}>
                    {
                        glCategories.map(cat =>
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select disabled={disabled} name="sub_gl_category_id" ref={subGlCategoryRef} defaultValue={materialData.sub_gl_category_id}>
                    {
                        subCategories.map(subCat =>
                            <option key={subCat.id} value={subCat.id}>{subCat.name}</option>
                        )
                    }
                </select>
            </td>
            <td style={{ width: '250px' }}>
                <select disabled={disabled} name="department_id" onChange={handleChange} value={materialData.department_id || 3}>
                    {
                        departments.map(department =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td>
            {/* <td>
                <select disabled={disabled} onChange={handleChange} name="techizatci_id" value={materialData.techizatci_id}>
                    {
                        departments.map(department =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td> */}
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
})
const NewMaterial = (props) => {
    const { glCategoriesRef, glCategories, units, departments, token, setTableData } = props
    const unitsRef = useRef(null);
    const glCategoryRef = useRef(null);
    const curatoridRef = useRef(null);
    // const procurementidRef = useRef(null);
    const inventoryRef = useRef(null);
    const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
    const [newCatState, setNewCatState] = useState({
        title: '',
        department: 1,
        procurement: '',
        approxPrice: '',
        cluster: '',
        gl_category_id: '-1',
        sub_gl_category_id: '-1',
        type: 0
    });
    const handleAddNewCategory = () => {
        const gl_category_id = glCategoryRef.current.value;
        const data = {
            ...newCatState,
            department: curatoridRef.current.value,
            gl_category_id,
            cluster: unitsRef.current.value,
            // procurement: procurementidRef.current.value
            isInv: inventoryRef.current.value
        };
        fetch('http://172.16.3.101:54321/api/add-new-cat', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => {
                if (respJ[0].result === 'success') {
                    const id = respJ[0].row_id;
                    setOperationResult({ visible: true, desc: 'Əməliyyat uğurla tamamlandı' })
                    setTableData(prev => ({ content: [...prev.content, { ...data, id }], count: prev.count + 1 }));
                    inventoryRef.current.value = 0;
                    setNewCatState({ gl_category_id: "-1", sub_gl_category_id: "-1" });
                    curatoridRef.current.value = "-1"
                }
            })
            .catch(ex => console.log(ex))
    }
    const handlePriceChange = (e) => {
        const value = e.target.value;
        setNewCatState(prev => ({ ...prev, approxPrice: /^\d*(\.)?\d{0,2}$/.test(value) ? value : prev.approxPrice }))
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
                        backgroundColor={'white'}
                        iconColor={'rgb(15, 157, 88)'}
                        icon={AiFillCheckCircle}
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
                            <option key={category.id} value={category.id}>{category.name}</option>
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
                                <option key={subGlCategory.id} value={subGlCategory.id}>{subGlCategory.name}</option>
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
            {/* <td>
                <select name="procurement" ref={procurementidRef}>
                    <option value="-1">-</option>
                    {
                        departments.map(department =>
                            <option key={department.id} value={department.id}>{department.name}</option>
                        )
                    }
                </select>
            </td> */}
            <td>
                <select onChange={handleChange} name="type" value={newCatState.type}>
                    <option value="0">Mal-Material</option>
                    <option value="1">Xidmət</option>
                </select>
            </td>
            <td style={{ maxWidth: '100px' }}>
                <input name="approxPrice" value={newCatState.approxPrice} onChange={handlePriceChange} />
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
            <td><FaPlus onClick={handleAddNewCategory} cursor="pointer" /></td>
        </tr>
    )
}