import React, { useEffect, useContext, useState, useCallback } from 'react'
import NewOrderTableBody from '../Orders/NewOrder/NewOrderTableBody'
import NewOrderHeader from '../Orders/NewOrder/NewOrderHeader'
import { TokenContext } from '../../App'
import OperationResult from '../../components/Misc/OperationResult'
import { IoIosCloseCircle } from 'react-icons/io'


const NewOrderContent = (props) => {
  const tokenContext = useContext(TokenContext);
  const token = tokenContext[0].token;
  const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
  const { handleModalClose: closeModal, current, isDraft } = props;
  const [glCategories, setGlCategories] = useState({ all: [], parent: [], sub: [] });

  const [orderInfo, setOrderInfo] = useState({
    glCategory: '-1',
    structure: '-1',
    ordNumb: '',
    orderType: 0
  })
  useEffect(() => {
    fetch('http://192.168.0.182:54321/api/gl-categories', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(resp => resp.json())
      .then(respJ => {
        const parent = respJ.filter(glCategory => glCategory.dependent_id === null);
        const sub = respJ.filter(glCategory => glCategory.dependent_id !== null);
        setGlCategories({ all: respJ, parent: parent, sub: sub });
      })
      .catch(ex => console.log(ex))
  }, [token]);

  const createApproveNewOrder = (materials, url, onSuccess) => {
    let canProceed = true;
    const parsedMaterials = materials.map(material =>
      [
        material.materialId,
        material.count,
        material.approx_price * material.count,
        material.additionalInfo,
        material.subGlCategory
      ]
    );

    for (let i = 0; i < parsedMaterials.length; i++) {
      if (parsedMaterials[i][0] === '') {
        canProceed = false;
        break;
      }
    }
    if (canProceed) {
      const data = {
        mats: parsedMaterials,
        receivers: [], // receiversRef.current.map(emp => emp.id),
        structureid: orderInfo.structure,
        ordNumb: current ? current : '',
        orderType: orderInfo.orderType
      }
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': JSON.stringify(data).length,
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(data)
      })
        .then(resp => resp.json())
        .then(respJ => {
          console.log(respJ)
          if (respJ[0].result === 'success') {
            onSuccess(data, respJ)
          }
          else if (respJ[0].error)
            setOperationResult({ visible: true, desc: respJ[0].error })
        })
        .catch(err => console.log(err))
    }
    else
      setOperationResult({ visible: true, desc: 'Error Parsing Materials' })
  }
  const createApproveNewOrderCallback = useCallback(createApproveNewOrder, [orderInfo]);
  const handleSendClick = (materials) => {
    if (!current && !isDraft) {
      const onSuccess = (data, respJ) => {
        const recs = [...data.receivers, respJ[0].head_id];
        const apiData = JSON.stringify({
          from: 0,
          until: 20,
          status: -3,
          dateFrom: '',
          dateTill: '',
          ordNumb: ''
        });
        //todo: create socket and connect
        fetch('http://192.168.0.182:54321/api/orders', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Length': apiData.length,
            'Content-Type': 'application/json'
          },
          body: apiData
        })
          .then(resp => resp.json())
          .then(respJ => {
            closeModal(respJ, recs);
          })
          .catch(err => console.log(err))
      }
      createApproveNewOrderCallback(materials, 'http://192.168.0.182:54321/api/new-order', onSuccess)
    }
  }
  return (
    <div className="modal-content-new-order">
      {
        operationResult.visible &&
        <OperationResult
          setOperationResult={setOperationResult}
          operationDesc={operationResult.desc}
          icon={IoIosCloseCircle}
        />
      }
      <NewOrderHeader
        orderInfo={orderInfo}
        setOrderInfo={setOrderInfo}
        token={token}
        parentGlCategories={glCategories.parent}
      />
        <NewOrderTableBody
          orderInfo={orderInfo}
          glCategories={glCategories}
          handleSendClick={handleSendClick}
        />
    </div>
  )
}
export default NewOrderContent