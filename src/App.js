import React from 'react';
import { nanoid } from 'nanoid';

import Titlebar from './components/Titlebar'
import Clauses from './components/Clauses';
import Form from './components/Form';
import Footer from './components/Footer';
import Results from './components/Results';
import Darkmode from './components/Darkmode';

export default function App() {

    const [tabs, setTabs] = React.useState(() => {
        const arr = [];
        let chars = 'abcde'
        for (let i = 0; i < 5; i++) {
            const tab = {
                id: nanoid(),
                clause: `6.7.1.5${chars[i]}`,
                isActive: i === 0 ? true : false
            }
            arr.push(tab)
        }
        return arr
    })

    const [formData, setFormData] = React.useState({
        formAlt: '2000',
        formPol: '2',
        formMatGroup: "IIIb",
        formMatType: "other",
        formWV: "",
        formWVACDC: "Vrms",
        formOV: "II",
        formDerivedOV: "II",
        formDerivedWV: "derivedFromMains150",
        formMaxPeak: "",
        formMaxTrans: "",
        formIsTransBelowMains: false,
        formIsTransAboveMains: false,
        formIsSum: false,
        formIsRecurringPeak: false,
        formIsFrequencyAbove30k: false,
        formIsMainsTransients: false,
        formIsInterpol: false
    })

    const themes = {
        light: {
            
        },
        dark: {

        }
    }


    function onTabClick(id) {
        setTabs((prevTabs) => {
            const newTabs = prevTabs.map((item) => {
                return item.id === id ?
                    {
                    ...item,
                        isActive: true
                    }
                    :
                    {
                        ...item,
                        isActive: false
                    }
            })
            return newTabs;
        })
        setFormData((prevFormData) => {
            const newForm = id === tabs[3].id
                ? {
                    ...prevFormData,
                    formDerivedWV: (prevFormData.formDerivedWV === ("derivedFromMains150" || "derivedFromMains300")) && (prevFormData.formDerivedOV === 'II') ? "derivedFromMains600" : prevFormData.formDerivedWV
                }
                : {
                    ...prevFormData
                }
            return newForm
        })
    }

    function handleChange(event) {
        const { name, value, type, checked } = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: type === 'checkbox' ? checked : value
            }
        })
    }
    

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
        <div>
            <Titlebar />
            <i onClick={onInfoClick} className="fa-solid fa-circle-info"></i>
            <div className="app--body">
                <div>
                    <div className="app--selectclause-container">
                        <h2>Select the insulation clause using the tabs</h2>
                        <i className="fa-solid fa-arrow-right"></i>
                    </div>
                    <Form handleChange={handleChange} formData={formData} tabs={tabs} />
                </div>
                <div>
                    <Clauses tabs={tabs} onClick={onTabClick} />
                    <Results tabs={tabs} formData={formData}/>
                </div>
            </div>
            <Footer />
        </div>
    )
}
