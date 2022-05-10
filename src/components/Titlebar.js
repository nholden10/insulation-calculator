import React from 'react';

export default function Titlebar() {

    function onInfoClick() {
        alert(`Welcome to the IEC 61010-1 insulation calculation tool. This tool is used to automate a lot of the tedious lookups and calculations associated with IEC 61010-1 insulation evaluations.

To use:
1. Select the appropriate clause tab for the insulation area in question.

2. Fill in the necessary required parameters in the form on the left. The tool will only show the parameters that are relevant to the clause chosen. Click the '?' beside the parameters for more information on what each parameter is asking for.
        
3. The tool will calculate / pull the appropriate required clearance, creepage, and voltage testing requirements applicable based on the information entered.
        
Note: App is in Beta testing and results may not be correct. The resulting values should not be relied on, and always double checked manually before putting them into practical use.
        `
        )
    }

    return (
        <header className="titlebar--container">
            <i style={{visibility: "hidden"}}></i>
            <h1 className="titlebar--title">IEC 61010-1 Insulation Calculator</h1>
            <i onClick={onInfoClick} className="fa-solid fa-circle-info"></i>
        </header>
    )
}