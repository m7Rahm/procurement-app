import React, { useState, useEffect, useCallback } from 'react'

const SideBarContainer = (Search, CardsList) => function SideBar(props) {
    const { updateListContent, initData, setActive, newDocNotifName } = props;
    const [cards, setCards] = useState(props.cards ? props.cards : { content: [], count: 0 });
    const updateList = useCallback((data) => {
        updateListContent(data)
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                setCards({ count: totalCount, content: respJ });
            })
            .catch(ex => console.log(ex))
    }, [updateListContent])
    useEffect(() => {
        let mounted = true;
        updateListContent(initData)
            .then(respJ => {
                const totalCount = respJ[0] ? respJ[0].total_count : 0;
                if (mounted)
                    setCards({ count: totalCount, content: respJ });
            })
            .catch(err => console.log(err))
        return () => mounted = false;
    }, [updateListContent, initData]);
    return (
        <div className='side-bar'>
            <Search
                count={cards.count}
                initData={initData}
                newDocNotifName={newDocNotifName}
                updateList={updateList}
                params={props.params}
                docTypes={props.docTypes}
            >
                <CardsList
                    params={props.params}
                    cards={cards.content}
                    setActive={setActive}
                />
            </Search>
        </div>
    )
}
export default SideBarContainer