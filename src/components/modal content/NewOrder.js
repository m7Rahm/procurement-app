import React, { useEffect, useState, useCallback } from 'react'
import NewOrderTableBody from '../Orders/NewOrder/NewOrderTableBody'
import NewOrderHeader from '../Orders/NewOrder/NewOrderHeader'
import OperationResult from '../../components/Misc/OperationResult'
import { IoIosCloseCircle } from 'react-icons/io'
import { FcFile } from "react-icons/fc"
import useFetch from '../../hooks/useFetch'
import { FaTimes } from 'react-icons/fa'


const NewOrderContent = (props) => {
  const { closeModal, current, isDraft, setSending, token } = props;
  const [operationResult, setOperationResult] = useState({ visible: false, desc: '' })
  const [glCategories, setGlCategories] = useState({ all: [], parent: [], sub: [] });
  const [orderInfo, setOrderInfo] = useState({
    glCategory: '-1',
    structure: '-1',
    ordNumb: '',
    orderType: 0
  });
  const [files, setFiles] = useState([]);
  const fetchGet = useFetch("GET");
  useEffect(() => {
    fetchGet('http://192.168.0.182:54321/api/gl-categories')
      .then(respJ => {
        const parent = respJ.filter(glCategory => glCategory.dependent_id === 0);
        const sub = respJ.filter(glCategory => glCategory.dependent_id !== 0);
        setGlCategories({ all: respJ, parent: parent, sub: sub });
      })
      .catch(ex => console.log(ex))
  }, [fetchGet]);
  const createApproveNewOrder = (materials, url, onSuccess) => {
    let canProceed = true;
    const parsedMaterials = materials.map(material =>
      [
        material.materialId,
        material.count,
        material.approx_price * material.count * (material.isAmortisized ? material.percentage / 100 : 1),
        material.additionalInfo,
        material.subGlCategory
      ]
    );
    for (let i = 0; i < parsedMaterials.length; i++) {
      if (isNaN(parsedMaterials[i][0])) {
        canProceed = false;
        break;
      }
    }
    if (canProceed) {
      setSending(true);
      props.modalContainerRef.current.style.visibility = "hidden";
      const formData = new FormData();
      formData.append("mats", JSON.stringify(parsedMaterials))
      formData.append("structureid", orderInfo.structure)
      formData.append("ordNumb", current ? current : "")
      formData.append("orderType", orderInfo.orderType)
      if (props.structureType === 2)
        formData.append("iswo", 1)
      for (let index = 0; index < files.length; index++) {
        formData.append("files", files[index])
      }
      fetch(url, {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + token
        },
        body: formData
      })
        .then(resp => resp.json())
        .then(respJ => {
          if (respJ[0].result === 'success') {
            onSuccess(respJ)
          }
          else if (respJ[0].error === "bO") {
            setOperationResult({ visible: true, errorDetails: respJ.reduce((sum, curr) => sum += curr.name + curr.overload_amount + "<br/>", ""), desc: "Büdcə Aşılmışdır" })
            props.modalContainerRef.current.style.visibility = "visible";
          }
          else {
            setOperationResult({ visible: true, desc: respJ[0].error })
            props.modalContainerRef.current.style.visibility = "visible";
          }
          setSending(false);
        })
        .catch(_ => {
          setSending(false);
        })
    }
    else
      setOperationResult({ visible: true, desc: 'Error Parsing Materials' })
  }
  const handleSendClick = (materials) => {
    if (!current && !isDraft) {
      const onSuccess = (respJ) => {
        const recs = respJ.map(resultRow => resultRow.receiver);
        closeModal(recs);
      }
      createApproveNewOrder(materials, 'http://192.168.0.182:54321/api/new-order', onSuccess)
    }
  }
  const handleSendClickCallback = useCallback(handleSendClick, [orderInfo, files]);
  const onDragOver = (e) => {
    preventDefault(e)
    e.target.style.border = "dotted 1px red"
  }
  const preventDefault = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
  const handleDrop = (e) => {
    preventDefault(e);
    const files = e.dataTransfer.files;
    e.target.style.borderColor = "transparent"
    setFiles(prev => {
      const newState = [...prev];
      for (let i = 0; i < files.length; i++)
        if (!newState.find(prevFile => prevFile.name === files[i].name))
          newState.push(files[i])
      return newState
    })
  }
  const handleFileChange = (e) => {
    const files = e.target.files;
    setFiles(prev => {
      const newState = [...prev];
      for (let i = 0; i < files.length; i++)
        if (!newState.find(prevFile => prevFile.name === files[i].name))
          newState.push(files[i]);
      return newState
    })
  }
  const onDragLeave = (e) => {
    preventDefault(e);
    e.target.style.borderColor = "transparent"
  }
  const handleDelete = (file) => {
    setFiles(prev => prev.filter(prevFile => prevFile.name !== file.name))
  }
  return (
    <div className="modal-content-new-order">
      {
        operationResult.visible &&
        <OperationResult
          setOperationResult={setOperationResult}
          operationDesc={operationResult.desc}
          errorDetails={operationResult.errorDetails}
          backgroundColor="whitesmoke"
          icon={IoIosCloseCircle}
        />
      }
      <div style={{ marginBottom: "0px" }}>
        {
          files.map(file =>
            <div key={file.name} title={file.name} style={{ float: "left", cursor: "pointer", position: "relative" }}>
              <FcFile size="2.5rem" color="#FFAA00" />
              <FaTimes onClick={() => handleDelete(file)} color="#D93404" style={{ position: "absolute", top: "-0.5rem", right: 0 }} />
            </div>
          )
        }
      </div>
      <NewOrderHeader
        orderInfo={orderInfo}
        setOrderInfo={setOrderInfo}
      />
      <input type="file" id="files" onChange={handleFileChange} multiple style={{ display: "none" }} />
      <label
        htmlFor="files"
        className="drop-area"
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={handleDrop}
      >
        Fayl əlavə et
      </label>
      <NewOrderTableBody
        orderInfo={orderInfo}
        glCategories={glCategories}
        handleSendClick={handleSendClickCallback}
      />
    </div>
  )
}
export default NewOrderContent