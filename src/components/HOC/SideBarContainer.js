import React, { useState, useEffect, useCallback } from 'react'

const SideBarContainer = (Search) => function SideBar(props) {
    const { updateListContent, initData, setActive, token } = props;
    const [cards, setCards] = useState({ content: [], count: 0 });
    const updateList = useCallback((data) => {
        const apiDate = JSON.stringify(data);
        updateListContent(apiDate, token)
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                setCards({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }, [token, updateListContent])
    useEffect(() => {
        const data = JSON.stringify(initData);
        updateListContent(data, token)
            .then(resp => resp.json())
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                setCards({ count: totalCount, content: respJ });
            })
            .catch(err => console.log(err))
    }, [updateListContent, initData, token]);
    return (
        <div className='side-bar'>
            <Search
                cards={cards}
                initData={initData}
                setActive={setActive}
                updateList={updateList}
            />
        </div>
    )
}
export default SideBarContainer