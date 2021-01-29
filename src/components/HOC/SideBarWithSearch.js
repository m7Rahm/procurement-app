import React, { useCallback, useRef, useState } from 'react'
import Pagination from '../Misc/Pagination'
import CalendarUniversal from '../Misc/CalendarUniversal'
import { GoChevronDown } from 'react-icons/go'
import { BsArrowUpShort } from 'react-icons/bs'
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const SideBarWithSearch = (Content) => function SearchBar(props) {
    const activePageRef = useRef(0);
    const advSearchRef = useRef(null);
    const iconRef = useRef(null);
    const notifIcon = useRef(null);
    const [searchBarState, setSearchBarState] = useState(false);
    const searchStateRef = useRef({
        startDate: '',
        endDate: '',
        fullName: ''
    })
    const handleInputChange = useCallback((name, value) => {
        searchStateRef.current[name] = value
    }, [])
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
        props.updateList({ ...searchStateRef.current, from })
    }
    const handleSearchClick = () => {
        props.updateList(searchStateRef.current)
    }
    const resetState = () => {
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
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
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
export default SideBarWithSearch
