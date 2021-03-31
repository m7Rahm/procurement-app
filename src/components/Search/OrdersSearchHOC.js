import React, { useRef, useState, useEffect } from 'react'
import Pagination from '../Misc/Pagination'
import CalendarUniversal from '../Misc/CalendarUniversal'
import { GoChevronDown } from 'react-icons/go'
import { BsArrowUpShort } from 'react-icons/bs'
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const OrdersSearchHOC = (options = [], docTypes = []) => function SearchBar(props) {
    const activePageRef = useRef(0);
    const advSearchRef = useRef(null);
    const iconRef = useRef(null);
    const notifIcon = useRef(null);
    const [searchBarState, setSearchBarState] = useState(false);
    const selectRef = useRef(null);
    const docTypesRef = useRef(null);
    const inputNumberRef = useRef(null);
    const searchStateRef = useRef({
        ...props.initData,
        startDate: '',
        endDate: '',
        number: ''
    });
    useEffect(() => {
        if (props.newDocNotifName) {
            const showNotificationIcon = () => {
                notifIcon.current.style.display = "block";
            }
            window.addEventListener(props.newDocNotifName, showNotificationIcon, false)
            return () => window.removeEventListener(props.newDocNotifName, showNotificationIcon)
        }
    }, [props.newDocNotifName]);
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
        const searchData = { ...searchStateRef.current, from, number: inputNumberRef.current.value };
        if (selectRef.current)
            searchData.result = selectRef.current.value;
        if (docTypesRef.current)
            searchData.docType = docTypesRef.current.value;
        props.updateList(searchData)
    }
    const handleSearchClick = () => {
        refreshList(0)
    }
    const resetState = () => {
    }
    const onNotifIconClick = () => {
        notifIcon.current.style.animation = 'visibility-hide 0.2s ease-in both';
        const onAnimationEnd = () => {
            notifIcon.current.style.display = 'none';
            notifIcon.current.style.animation = 'anim-up-to-down 1.5s ease-in both';
            notifIcon.current.removeEventListener('animationend', onAnimationEnd)
        }
        notifIcon.current.addEventListener('animationend', onAnimationEnd, false);
        props.updateList(props.initData)
    }
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
                            {
                                options.length &&
                                <select defaultValue="0" style={{ padding: '6px 0px', float: 'left' }} ref={selectRef}>
                                    {
                                        options.map(option =>
                                            <option key={option.val} value={option.val}>{option.text}</option>
                                        )
                                    }
                                </select>
                            }
                            {
                                docTypes.length !== 0 &&
                                <select defaultValue="0" style={{ padding: '6px 0px', float: 'right', margin: "0px 5px" }} ref={docTypesRef}>
                                    {
                                        docTypes.map(option =>
                                            <option key={option.val} value={option.val}>{option.text}</option>
                                        )
                                    }
                                </select>
                            }
                            <div className="search-ribbon">
                                <div onClick={handleSearchClick}>Axtar</div>
                                <div onClick={resetState}>Filteri təmizlə</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
            <div onClick={onNotifIconClick} ref={notifIcon} style={{ display: "none" }} className="new-visa-notification">
                <span >
                    <span style={{ verticalAlign: "middle" }}>
                        <BsArrowUpShort color="#00acee" size="24" style={{ marginRight: '8px', color: "white" }} />
                    </span>
                    Yeni bildiriş
                </span>
            </div>
            {props.children}
            <Pagination
                count={props.count}
                activePageRef={activePageRef}
                updateList={refreshList}
            />
        </>
    )
}
export default OrdersSearchHOC
