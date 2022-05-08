import React from 'react';

export default function Clauses(props) {

    const tabs = props.tabs.map((item) => {

        const selected = item.isActive ? "clauses--tab-selected" : "clauses--tab-unselected"

        return (
            <div
                key={item.id}
                className={selected}
                onClick={() => props.onClick(item.id)}
            >{item.clause}</div>
        )
    })

    return (
        <nav className='clauses--container'>
            {tabs}
        </nav>
    )
}