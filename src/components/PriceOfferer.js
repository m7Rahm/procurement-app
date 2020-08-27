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
import { suppliers, incoTerms } from '../data/data'
const PriceOffererDetailed = React.lazy(() => import('../components/modal content/PriceOffererDetailed'))

const calcVals = (current, compRes, amount) => {
	const amnt = Number(amount);
	const approxTranFee = Number(current.approxTranFee);
	current.impFee = Number((compRes ? (amnt + approxTranFee) * 0.15 : 0).toFixed(2));
	current.vat = Number((compRes ? (amnt + current.impFee + approxTranFee) * 0.18 : 0).toFixed(2));
	current.total = Number((amnt + current.vat + current.impFee + approxTranFee).toFixed(2));
	// console.log(current)
}
const calcDelType = (current, value, amount) => {
	if (value > 8) {
		current.impFee = 0;
		current.vat = 0;
		current.total = amount
	}
	else if (value < 10) {
		// console.log(current)
		const approxTranFee = Number(current.approxTranFee)
		const sum = Number(amount)
		current.impFee = Number(((approxTranFee + sum) * 0.15).toFixed(2));
		current.vat = Number((sum + current.impFee + approxTranFee).toFixed(2));
		current.total = Number(((approxTranFee + sum) * 1.357).toFixed(2))
	}
	if (value > 9)
		current.approxTranFee = 0;
}
const reducer = (state, action) => {
	const type = action.type;
	switch (type) {
		case 'setFiles':
			return { ...state, files: [...state.files, ...action.payload] }
		case 'supplier':
			return { ...state, [type]: action.payload }
		case 'delType': {
			const current = state;
			current.delType = action.payload;
			calcDelType(current, action.payload, current.sum)
			return { ...current }
		}
		case 'delDur':
			return { ...state, [type]: action.payload }
		case 'approxTranFee': {
			const current = state;
			if (current.delType < 10) {
				current[type] = action.payload;
				calcVals(current, current.delType < 10, current.sum);
			}
			return { ...current }
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
					calcVals(currentVals, currentVals.delType < 9, amount);
					const sum = Number(Object.keys(state.values)
						.filter(index => index !== action.payload.index.toString())
						.reduce((acc, val) => acc += Number(state.values[val].amount), 0) + amount);
					const current = state;
					current.values[index] = currentVals;
					current.sum = sum;
					calcVals(current, current.delType < 9, sum);
					return { ...current }
				}
				case 'delType': {
					const value = action.payload.value;
					const currentVals = state.values;
					const name = action.payload.name;
					currentVals[action.payload.index][name] = value;
					calcDelType(currentVals[action.payload.index], value, currentVals[action.payload.index].amount)
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
					const value = Number(Number(action.payload.value).toFixed(2));
					const quantity = action.payload.quantity;
					const name = action.payload.name;
					const index = action.payload.index
					const currentVals = state.values[index];
					currentVals[name] = Number(action.payload.value);
					currentVals.price = value / quantity;
					// console.log(value)
					calcVals(currentVals, currentVals.delType < 9, value);
					const sum = Number(Object.keys(state.values)
						.filter(index => index !== action.payload.index.toString())
						.reduce((acc, val) => acc += Number(state.values[val].amount), 0) + value);
					// console.log(sum)
					const current = state;
					current.values[index] = currentVals;
					current.sum = sum;
					calcVals(current, current.delType < 9, sum)
					return { ...current }
				}
				case 'approxTranFee': {
					const index = action.payload.index;
					const currentVals = state.values;
					const name = action.payload.name;
					if (currentVals[index].delType < 10) {
						currentVals[index][name] = action.payload.value;
						// console.log(currentVals);
						calcVals(currentVals[index], currentVals[index].delType < 10, currentVals[index].amount);
					}
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
		delType: '1',
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
					materialid: current.id,
					quantity: current.amount,
					price: '',
					amount: 0,
					delType: '1',
					delDur: '',
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
		// console.log(state)
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
			for (let i = 0; i < e.target.files.length; i++) {
				const file = e.target.files[i];
				file.supplier = state.supplier
				files.push(file);
			}
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
			<div>
				<select style={{ backgroundColor: 'white' }} onChange={handleChange} value={state.delType} name="delType">
					{
						incoTerms.map(term =>
							<option value={term.id} key={term.id}>{term.name}</option>
						)
					}
				</select>
			</div>
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
export default React.memo(PriceOfferer, () => true)