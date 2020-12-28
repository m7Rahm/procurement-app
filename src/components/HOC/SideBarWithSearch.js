import React, { useCallback, useRef, useState } from 'react'
import Pagination from '../Misc/Pagination'
import CalendarUniversal from '../Misc/CalendarUniversal'
import { GoChevronDown } from 'react-icons/go'
const date = new Date();
const SideBarWithSearch = (Content) => function SearchBar(props) {
    const activePageRef = useRef(0);
    const advSearchRef = useRef(null);
    const iconRef = useRef(null);
    const [searchBarState, setSearchBarState] = useState(false);
    const [searchState, setSearchState] = useState({
        from: '',
        until: ''
    });
    const handleInputChange = useCallback((name, value) => {
        setSearchState(prev => ({ ...prev, [name]: value}))
    }, [])
    const showSearchBar = () => {
        if(advSearchRef.current){
            advSearchRef.current.style.animation = 'visibility-hide 0.2s ease-in both';
            iconRef.current.style.transform = 'rotate(0deg)'
            advSearchRef.current.addEventListener('animationend', () => {
                setSearchBarState(false);
            })
        }
        else{
            iconRef.current.style.transform = 'rotate(180deg)'
            setSearchBarState(true);
        }
    }
    const handleSearchClick = () => {

    }
    const resetState = () => {

    }
    return (
        <>
            <div>
                <div>
                    <div onClick={showSearchBar} style={{ transition: 'all 0.4s', transformOrigin: '', float: 'right', cursor: 'pointer' }} ref={iconRef}>
                        <GoChevronDown size="24" color="steelblue" />
                    </div>
                    {
                        searchBarState &&
                        <div ref={advSearchRef} className="adv-search-box">
                            <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between' }}>
                                <CalendarUniversal
                                    year={date.getFullYear()}
                                    month={date.getMonth()}
                                    placeholder="Tarixdən"
                                    name="from"
                                    handleInputChange={handleInputChange}
                                    value={searchState.from}
                                />
                                <CalendarUniversal
                                    year={date.getFullYear()}
                                    month={date.getMonth()}
                                    placeholder="Tarixədək"
                                    value={searchState.until}
                                    name="until"
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
            <Content
                cards={props.cards.content}
                setActive={props.setActive}
            />
            <Pagination
                count={props.cards.count}
                activePageRef={activePageRef}
                updateList={props.refreshVisas}
            />
        </>
    )
}
export default SideBarWithSearch
