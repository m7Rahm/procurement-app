import React, { useReducer, useEffect, Suspense, useState } from 'react'
import {
	IoIosAttach,
	IoMdClose
} from 'react-icons/io'
import {
	AiOutlinePicture
} from 'react-icons/ai'
import {
	RiListSettingsLine
} from 'react-icons/ri'
import POIndivPrice from './POIndivPrice';
import { suppliers } from '../data/data'
const PriceOffererDetailed = React.lazy(() => import('../components/modal content/PriceOffererDetailed'))

const calcVals = (current, total, amount) => {
	const impFee = (total / 1.18 - amount).toFixed(2) > 0 ? (total / 1.357) * 0.15 : 0
	current['total'] = total.toFixed(2);
	current['vat'] = (total - total / 1.18).toFixed(2);
	current['impFee'] = impFee.toFixed(2);
}
const reducer = (state, action) => {
	const type = action.type;
	switch (type) {
		case 'setFiles':
			return { ...state, files: [...state.files, ...action.payload] }
		case 'supplier':
			return { ...state, [type]: action.payload }
		case 'delType':
			return { ...state, [type]: action.payload }
		case 'delDur':
			return { ...state, [type]: action.payload }
		case 'approxTranFee': {
			const current = state;
			current[type] = action.payload;
			const total = Number(action.payload) !== 0
						? (Number(action.payload) + Number(current['sum'])) * 1.357
						: Number(current['sum']) * 1.18;
			calcVals(state, total, state.sum);
			return { ...state, ...current }
		}
		case 'adv': {
			switch (action.payload.name) {
				case 'price': {
					const value = Number(action.payload.value).toFixed(2);
					const quantity = action.payload.quantity;
					const amount = value * quantity;
					const name = action.payload.name;
					const index = action.payload.index
					const currentVals = state.values[index];
					currentVals[name] = action.payload.value;
					currentVals['amount'] = amount;
					const total = (amount + (Number(currentVals['approxTranFee']) !== 0 ? (amount + currentVals['approxTranFee']) * 1.15 : 0)) * 1.18;
					calcVals(currentVals, total, amount);
					const sum = Number(Object.keys(state.values)
						.filter(index => index !== action.payload.index.toString())
						.reduce((acc, val) => acc += Number(state.values[val].amount), 0) + amount);
					const current = state;
					current.values[index] = currentVals;
					current.sum = sum;
					const sumTotal = (sum + (Number(current['approxTranFee']) !== 0 ? (sum + current['approxTranFee']) * 1.15 : 0)) * 1.18
					calcVals(current, sumTotal, current.sum)
					return { ...current }
				}
				case 'delType': {
					const value = action.payload.value;
					const currentVals = state.values;
					const index = action.payload.index
					const name = action.payload.name;
					currentVals[index][name] = value;
					return { ...state, values: { ...currentVals } }
				}
				case 'delDur': {
					const value = action.payload.value;
					const currentVals = state.values;
					const index = action.payload.index
					const name = action.payload.name;
					currentVals[index][name] = value;
					return { ...state, values: { ...currentVals } }
				}
				case 'amount': {
					const value = Number(action.payload.value).toFixed(2);
					const quantity = action.payload.quantity;
					const name = action.payload.name;
					const index = action.payload.index
					const currentVals = state.values[index];
					currentVals[name] = action.payload.value;
					currentVals['price'] = value / quantity;
					const total = (value + (Number(currentVals['approxTranFee']) !== 0 ? (value + currentVals['approxTranFee']) * 1.15 : 0)) * 1.18;
					calcVals(currentVals, total, value);
					const sum = Number(Object.keys(state.values)
						.filter(index => index !== action.payload.index.toString())
						.reduce((acc, val) => acc += Number(state.values[val].amount), 0) + value);
					const current = state;
					current.values[index] = currentVals;
					current.sum = sum;
					const sumTotal = (sum + (Number(current['approxTranFee']) !== 0 ? (sum + current['approxTranFee']) * 1.15 : 0)) * 1.18
					calcVals(current, sumTotal, current.sum)
					return { ...current }
				}
				case 'approxTranFee': {
					const currentVals = state.values;
					const index = action.payload.index
					const name = action.payload.name;
					currentVals[index][name] = action.payload.value;
					const total = Number(action.payload.value) !== 0
						? (Number(action.payload.value) + Number(currentVals[index]['amount'])) * 1.357
						: Number(currentVals[index]['amount']) * 1.18;
					calcVals(currentVals[index], total, currentVals[index]['amount']);
					return { ...state, values: { ...currentVals } }
				}
				default:
					return state
			}
		}
		default:
			return state
	}
}
const init = (initVal) => {
	return ({
		supplier: '1',
		delType: '',
		delDur: '',
		sum: 0,
		approxTranFee: 0,
		impFee: 0,
		vat: 0,
		total: 0,
		values: initVal.reduce((accum, current) => (
			{
				...accum,
				[current.id]: {
					quantity: current.amount,
					price: '',
					amount: '',
					delType: '',
					delDur: '',
					sum: 0,
					approxTranFee: 0,
					impFee: 0,
					vat: 0,
					total: 0,
				}
			}),
			{}),
		files: []
	})
}
const PriceOfferer = (props) => {
	
	const [state, dispatch] = useReducer(reducer, props.orderDetails, init);
	const [advancedViewDisp, setAdvancedViewDisp] = useState(false);
	// console.log(state);
	useEffect(() => {
		props.offerers.current[props.id].state = state;
	}, [props.offerers, state, props.id])
	const handleChange = (e) => {
		const name = e.target.name;
		const value = e.target.value;
		dispatch({ type: name, payload: value })
	}
	const handleAdvChange = (e, index, quantity) => {
		const name = e.target.name;
		const value = e.target.value;
		dispatch({ type: 'adv', payload: { value, index, quantity, name } })
	}
	const handleOffererDelete = () => {
		props.setOfferersCount(prev => prev -= 1);
		props.offerers.current.splice(props.id, 1)
	}
	const handleFileUpload = (e) => {
		const files = [];
		if (e.target.files) {
			for (let i = 0; i < e.target.files.length; i++)
				files.push(e.target.files[i]);
			dispatch({ type: 'setFiles', payload: files })
		}
	}
	const showFiles = () => {
		props.setPictures(state.files);
		props.setModalState(true);
	}
	const foo = () => {
		setAdvancedViewDisp(true)
	}
	return (
		<div>
			<div>
				<select onChange={handleChange} value={state.supplier} name="supplier">
					{
						suppliers.map(supplier =>
							<option value={supplier.id} key={supplier.id}>{supplier.name}</option>
						)
					}
				</select>
				<div>
					{
						state.files.length !== 0 &&
						<AiOutlinePicture onClick={showFiles} className="pictures-thumb" size="20" />
					}
					<IoMdClose onClick={handleOffererDelete} title="sil" size="20" />
					<label htmlFor={`file-upload ${props.id}`}>
						<IoIosAttach onClick={handleFileUpload} title="şəkil əlavə et" size="20" />
					</label>
					<RiListSettingsLine onClick={foo} title="ətraflı" size="20" />
					<input
						id={`file-upload ${props.id}`}
						style={{ display: 'none' }}
						onChange={handleFileUpload}
						type="file"
						multiple={true}
					/>
				</div>
			</div>
			<div><input onChange={handleChange} value={state.delType} name="delType" placeholder="Təslim növü" /></div>
			<div><input onChange={handleChange} value={state.delDur} name="delDur" placeholder="Təslim müddəti" /></div>
			{
				props.orderDetails.map(material =>
					<POIndivPrice
						amount={material.amount}
						handleAdvChange={handleAdvChange}
						id={material.id}
						values={state.values}
						key={material.id}
					/>
				)
			}
			<div><input name="sum" value={state.sum} onChange={handleChange} /></div>
			<div><input name="approxTranFee" value={state.approxTranFee} onChange={handleChange} /></div>
			<div><input name="impFee" value={state.impFee} onChange={handleChange} /></div>
			<div><input name="vat" value={state.vat} onChange={handleChange} /></div>
			<div><input name="total" value={state.total} onChange={handleChange} /></div>
			<div>
				{
					advancedViewDisp &&
					<Suspense fallback="">
						<PriceOffererDetailed
							supplier={suppliers.find(supplier => supplier.id === state.supplier)}
							closeModal={setAdvancedViewDisp}
							orderDetails={props.orderDetails}
							state={state}
							handleAdvChange={handleAdvChange}
						/>
					</Suspense>
				}
			</div>
		</div>
	)
}
export default PriceOfferer