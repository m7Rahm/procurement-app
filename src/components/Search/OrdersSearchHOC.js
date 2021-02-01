import React, { useRef, useState, useEffect } from 'react'
import Pagination from '../Misc/Pagination'
import CalendarUniversal from '../Misc/CalendarUniversal'
import { GoChevronDown } from 'react-icons/go'
import { BsArrowUpShort } from 'react-icons/bs'
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const OrdersSearchHOC = (Content, options = []) => function SearchBar(props) {
    const activePageRef = useRef(0);
    const advSearchRef = useRef(null);
    const iconRef = useRef(null);
    const notifIcon = useRef(null);
    const { updateCards, updateList, setUpdateCards } = props;
    const [searchBarState, setSearchBarState] = useState(false);
    const selectRef = useRef(null);
    const inputNumberRef = useRef(null);
    const searchStateRef = useRef({
        startDate: '',
        endDate: '',
        number: ''
    })
    const handleInputChange = (name, value) => {
        searchStateRef.current[name] = value;
    }
    const showSearchBar = () => {
        if (advSearchRef.current) {
            advSearchRef.current.style.animation = 'visibility-hide 0.2s ease-in both';
            iconRef.current.style.transform = 'rotate(0deg)'
            advSearchRef.current.addEventListener('animationend', () => {
                setSearchBarState(false);
            })
        }
        else {
            iconRef.current.style.transform = 'rotate(180deg)'
            setSearchBarState(true);
        }
    }
    const refreshList = (from) => {
        props.updateList({ ...searchStateRef.current, from, result: selectRef.current.value, number: inputNumberRef.current.value })
    }
    const handleSearchClick = () => {
        props.updateList({ ...searchStateRef.current, result: selectRef.current.value, number: inputNumberRef.current.value, from: 0 })
    }
    const resetState = () => {
    }
    useEffect(() => {
        if (selectRef.current && selectRef.current.value === "30" && updateCards){
            updateList({ ...searchStateRef.current, result: selectRef.current.value })
            setUpdateCards(false)
        }
    }, [updateCards, updateList, setUpdateCards])
    return (
        <>
            <div>
                <div>
                    <div onClick={showSearchBar} style={{ transition: 'all 0.4s', transformOrigin: 'center', float: 'right', cursor: 'pointer' }} ref={iconRef}>
                        <GoChevronDown size="24" color="steelblue" />
                    </div>
                    {
                        searchBarState &&
                        <div ref={advSearchRef} className="adv-search-box" style={{ padding: '20px 10px' }}>
                            <div style={{ marginBottom: '10px' }} className="doc-number-container">
                                <input ref={inputNumberRef} placeholder="Sənədin nömrəsini daxil edin.." />
                            </div>
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', position: 'relative' }}>
                                <CalendarUniversal
                                    year={year}
                                    month={month}
                                    placeholder="Tarixdən"
                                    name="startDate"
                                    handleInputChange={handleInputChange}
                                />
                                <CalendarUniversal
                                    year={year}
                                    month={month}
                                    placeholder="Tarixədək"
                                    name="endDate"
                                    handleInputChange={handleInputChange}
                                />
                            </div>
                            <select style={{ padding: '6px 0px', float: 'left' }} ref={selectRef}>
                                {
                                    options.map(option =>
                                        <option key={option.val} value={option.val}>{option.text}</option>   
                                    )
                                }
                            </select>
                            <div className="search-ribbon">
                                <div onClick={handleSearchClick}>Axtar</div>
                                <div onClick={resetState}>Filteri təmizlə</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div onClick={() => { }} ref={notifIcon} className="new-visa-notification">
                <span >
                    Yeni bildiriş
                        <BsArrowUpShort size="20" style={{ verticalAlign: 'middle', float: 'right', marginRight: '8px' }} />
                </span>
            </div>
            <Content
                params={props.params}
                cards={props.cards.content}
                setActive={props.setActive}
            />
            <Pagination
                count={props.cards.count}
                activePageRef={activePageRef}
                updateList={refreshList}
            />
        </>
    )
}
export default OrdersSearchHOC
