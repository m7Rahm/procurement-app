import React, { useContext, useState, useEffect } from 'react'
import { TokenContext } from '../../App'
import { MdAdd } from 'react-icons/md'
import Modal from '../../components/Modal'
import NewCategory from '../../components/modal content/NewCategory'
const OrderMaterials = (props) => {
    const tokenContext = useContext(TokenContext);
    const token = tokenContext[0];
    const [modalVisible, setModalVisible] = useState(false);
    const [categories, setCategories] = useState([]);
    console.log(categories)
    useEffect(() => {
        fetch('http://172.16.3.101:54321/api/get-material-categories', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(resp => resp.json())
        .then(respJ => setCategories(respJ))
        .catch(ex => console.log(ex))
    }, [token])
    const handleClick = (state) => {
        setModalVisible(state)
    }
    return (
        <div className="users-page">
            <div title="yarat" className="new-order-button" onClick={() => handleClick(true)}>
                <MdAdd color="white" size="30" />
            </div>
            {
                modalVisible &&
                <Modal>
                    {
                        (props) => <NewCategory closeModal={handleClick} {...props} />
                    }
                </Modal>
            }
        </div>
    )
}
export default OrderMaterials