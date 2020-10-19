import React, { useState, useEffect, useContext, useRef } from 'react'
import {
    MdModeEdit,
    MdDone,
    MdClose,
    MdAdd
} from 'react-icons/md'
import {
    FaPlus
} from 'react-icons/fa'
import { TokenContext } from '../../App';
const TableRow = ({ index, material, subCategoriesRef, categories, departments, token }) => {
    const [materialData, setMaterialData] = useState(material);
    const [disabled, setDisabled] = useState(true);
    const subCategories = subCategoriesRef.current.filter(subCat => subCat.parent_id.toString() === materialData.grand_parent_id.toString());
    // console.log(subCategoriesRef.current);
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
        const data = JSON.stringify(materialData);
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
            .then(respJ => setDisabled(true))
            .catch(ex => console.log(ex))
    }
    return (
        <tr key={materialData.id}>
            <th>{index}</th>
            <td>
                <input value={materialData.title} name="title" disabled={disabled} onChange={handleChange} />
            </td>
            <td>
                <select disabled={disabled} onChange={handleChange} name="grand_parent_id" value={materialData.grand_parent_id}>
                    {
                        categories.map(cat =>
                            <option key={cat.id} value={cat.id}>{cat.product_title}</option>
                        )
                    }
                </select>
            </td>
            <td>
                <select disabled={disabled} name="parent_id" onChange={handleChange} value={materialData.parent_id}>
                    {
                        subCategories.map(subCat =>
                            <option key={subCat.id} value={subCat.id}>{subCat.product_title}</option>
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
            <td><input value={materialData.approx_price || ''} name="approx_price" disabled={disabled} onChange={handleChange} /></td>
            <td><input value={materialData.barcode || ''} name="barcode" disabled={disabled} onChange={handleChange} /></td>
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
const OrderMaterials = () => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0];
    const [categories, setCategories] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [newCatState, setNewCatState] = useState({
        title: '',
        department: 1,
        grand_parent_id: '',
        barcode: '',
        approxPrice: ''
    });
    const categoryNameRef = useRef(null);
    const parentCategoryRef = useRef(null);
    const [tableData, setTableData] = useState([]);
    const subCategoriesRef = useRef([]);
    const parentSelectReft = useRef(null);
    const subCategories = subCategoriesRef.current.filter(subCat => subCat.parent_id.toString() === newCatState.grand_parent_id) || [];
    const handleAddNewCategory = () => {
        const parent_id = parentSelectReft.current.value;
        const data = { ...newCatState, parent_id, product_id: new Date().getTime() };
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
                console.log(respJ)
                if (respJ[0].result === 'success') {
                    const id = respJ[0].row_id;
                    setTableData(prev => [...prev, { ...data, id }])
                }
            })
            .catch(ex => console.log(ex))
    }
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/departments', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => setDepartments(respJ))
            .catch(ex => console.log(ex));
        fetch('http://172.16.3.101:54321/api/material-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then(resp => resp.json())
            .then(respJ => {
                const sub = [];
                const parent = [];
                respJ.forEach(category => {
                    category.parent_id === 34
                        ? parent.push(category)
                        : sub.push(category)
                });
                subCategoriesRef.current = sub;
                setCategories(parent)
            })
            .catch(ex => console.log(ex));
        const data = { categoryid: 34 }
        fetch('http://172.16.3.101:54321/api/get-models', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Content-Length': JSON.stringify(data).length
            },
            body: JSON.stringify(data)
        })
            .then(resp => resp.json())
            .then(respJ => setTableData(respJ))
            .catch(ex => console.log(ex))
    }, [token]);

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        setNewCatState(prev => ({ ...prev, [name]: value }))
    }
    const addNewCategory = () => {
        const product_title = categoryNameRef.current.value;
        const parent_id = parentCategoryRef.current.value;
        const data = { title: product_title, parent_id: parent_id, product_id: null }
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
                console.log(respJ)
                if (respJ[0].result === 'success') {
                    const id = respJ[0].row_id;
                    if (parent_id === '34')
                        setCategories(prev => [...prev, { id: id, product_title, parent_id }]);
                    else {
                        subCategoriesRef.current = [...subCategoriesRef.current, { id: id, product_title, parent_id }];
                        setCategories(prev => [...prev]);
                    }
                }
            })
            .catch(ex => console.log(ex))
    }
    // console.log(tableData)
    return (
        <div className="sys-param-modal">
            <div >
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <input ref={categoryNameRef} placeholder="yeni kateqoriya" style={{ marginRight: '20px' }} />
                    <select ref={parentCategoryRef} style={{ marginRight: '20px' }}>
                        <option value={34}>-</option>
                        {
                            categories.map(category =>
                                <option key={category.id} value={category.id}>{category.product_title}</option>
                            )
                        }
                    </select>
                    <div style={{ marginRight: '20px', cursor: 'pointer' }} onClick={addNewCategory}>
                        <MdAdd size="20"/>
                    </div>
                </div>
                <table style={{ marginTop: '30px' }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Ad</th>
                            <th>Kateqoriya</th>
                            <th>Alt Kateqoriya</th>
                            <th>Yöndərilən struktur</th>
                            <th>Qiymət</th>
                            <th>Kod</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td><input type="text" name="title" value={newCatState.title} onChange={handleChange} /></td>
                            <td>
                                <select onChange={handleChange} name="grand_parent_id" value={newCatState.grand_parent_id}>
                                    {
                                        categories.map(category =>
                                            <option key={category.id} value={category.id}>{category.product_title}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <select onChange={handleChange} name="parent_id" ref={parentSelectReft}>
                                    {
                                        subCategories.map(subCat =>
                                            <option key={subCat.id} value={subCat.id}>{subCat.product_title}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td>
                                <select onChange={handleChange} name="department" value={newCatState.department}>
                                    {
                                        departments.map(department =>
                                            <option key={department.id} value={department.id}>{department.name}</option>
                                        )
                                    }
                                </select>
                            </td>
                            <td><input name="approxPrice" value={newCatState.approxPrice} onChange={handleChange} /></td>
                            <td><input name="barcode" value={newCatState.barcode} onChange={handleChange} /></td>
                            <td><FaPlus onClick={handleAddNewCategory} cursor="pointer" /></td>
                        </tr>
                        {
                            tableData.map((material, index) =>
                                <TableRow
                                    index={index + 1}
                                    token={token}
                                    material={material}
                                    subCategoriesRef={subCategoriesRef}
                                    categories={categories}
                                    departments={departments}
                                    key={material.id}
                                />
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
export default OrderMaterials