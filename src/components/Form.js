import React from "react";
import { getActiveTab } from "../utils";

export default function Form(props) {

    const handleChange = props.handleChange
    const tabs = props.tabs
    const formData = props.formData

    const activeTab = getActiveTab(tabs)

    function handleSubmit(event) {
        event.preventDefault();
    }

    function handleInfoClick() {
        alert(
`
The following considerations should be made when using K.3.2 for clearance calculations:\n
- When calculating clearances for a mains powered switch-mode power supply, in addition to the appropriate checkboxes for 6.7.1.5e) 1-5, ensure the "Are mains transients expected?"
checkbox is checked. This will ensure that the max transients expected from mains are used as the Um value as per K.3.2 clearance calculation.
- When 6.7.1.5e) 3) is checked, "Max peal working voltage" will be the maximum peak value measured. When the box is not checked, the calculator will use 1.414 * the Vrms working voltage (or Vdc working voltage) to act as Uw in the K.3.2 calculation.
`
        )
    }

    const selectOVOptions = activeTab === 1 ? ['II'] : ['II', 'III', 'IV']
    const OVoptions = selectOVOptions.map((choice) => {
        return (
            <option
                key={choice}
                value={choice}>{choice}</option>
        )
    })

    let selectDerivedVoltageOptions;
    if (activeTab === 1) {
        selectDerivedVoltageOptions = ['150', '300'];
    } else if (activeTab === 3 && formData.formDerivedOV !== 'II') {
        selectDerivedVoltageOptions = ['150', '300', '600', '1000'];
    } else {
        selectDerivedVoltageOptions = ['600', '1000'];
    }

    const derivedVoltageOptions = selectDerivedVoltageOptions.map((choice) => {
        return (
            <option
                key={choice}
                value={`derivedFromMains${choice}`}>{`Up to ${choice}V`}</option>
        )
    })

    return (

        <div>
            <form onSubmit={handleSubmit} className="form--container top">
            <h2>Enter product specs <i className="fa-solid fa-arrow-down"></i> </h2>

                <div className="form--input-container">
                    <label className="form--label">Max operating alititude:</label>
                    <select
                        id="formAlt"
                        onChange={handleChange}
                        name="formAlt"
                        value={props.formData.formAlt}
                    >
                        <option value="2000">2000m</option>
                        <option value="3000">3000m</option>
                        <option value="4000">4000m</option>
                        <option value="5000">5000m</option>
                    </select>
                </div>
                <div className="form--input-container">
                    <label className="form--label">Pollution Degree:</label>
                    <select
                        id="formPol"
                        onChange={handleChange}
                        name="formPol"
                        value={props.formData.formPol}
                    >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                    </select> 
                </div>
                <div className="form--input-container">
                    <label className="form--label">Material Group:</label>
                    <select
                        id="formMatGroup"
                        onChange={handleChange}
                        name="formMatGroup"
                        value={props.formData.formMatGroup}
                    >
                        <option value="I">I</option>
                        <option value="II">II</option>
                        <option value="IIIa">IIIa</option>
                        <option value="IIIb">IIIb</option>
                    </select>
                </div>
                <div className="form--input-container">
                    <label className="form--label">Type of Material:</label>
                    <select                       
                        id="formMatType"
                        onChange={handleChange}
                        name="formMatType"
                        value={props.formData.formMatType}
                    >
                        <option value="pwb">PWB</option>
                        <option value="other">Other</option>
                    </select>     
                </div>

                <div className="form--input-container">
                    <label className="form--label">{
                        (activeTab == 0 || activeTab == 2)
                            ? 'Working voltage (Vrms/Vdc):'
                            : 'Working voltage:'
                    }</label>
                    <div>
                        <input
                            type="text"
                            id="formWV"
                            onChange={handleChange}
                            name="formWV"
                            value={props.formData.formWV}
                        />
                        {
                            (activeTab === 1 || activeTab ===3 || activeTab === 4) &&
                
                            <select
                                id="formWVACDC"
                                onChange={handleChange}
                                name="formWVACDC"
                                value={props.formData.formWVACDC}
                            >
                                <option value="Vrms">Vrms</option>
                                <option value="Vdc">Vdc</option>
                            </select>
                        }
                    </div>
                </div>    

                    

                {
                    activeTab === 2 &&
                <div className="form--input-container">
                    <label className="form--label">Overvoltage Catergory:</label>
                    <select
                        id="formOV"
                        onChange={handleChange}
                        name="formOV"
                        value={props.formData.formOV}
                    >
                        <option value="II">II</option>
                        <option value="III">III</option>
                        <option value="IV">IV</option>
                    </select>
                </div>
                }
                
                { (activeTab === 1 || activeTab === 3) &&
                <div>
                    <div className="form--input-container">
                        <label className="form--label">Derived from Overvoltage Catergory:</label>
                        <select
                            id="formDerivedOV"
                            onChange={handleChange}
                            name="formDerivedOV"
                            value={props.formData.formDerivedOV}
                        >
                            {OVoptions}   
                        </select>
                    </div>
                </div>
                }

                        
                {
                    (activeTab === 1 || activeTab === 3) && 
                    
                <div className="form--input-container">       
                    <label>circuit, with a mains voltage of: </label>
                    <select
                        id="formDerivedWV"
                        onChange={handleChange}
                        name="formDerivedWV"
                        value={props.formData.formDerivedWV}
                    >
                        {derivedVoltageOptions}           
                    </select>
                </div>                        
                
                }       
                {
                    activeTab === 4 &&
                    <div>
                        <div className="form--checkbox-container">
                            <label className="form--label">1) Transients limited to a value below mains</label>
                            <input
                                type="checkbox"
                                id="formIsTransBelowMains"
                                onChange={handleChange}
                                name="formIsTransBelowMains"
                                value={props.formData.formIsTransBelowMains} />
                        </div>
                        <div className="form--checkbox-container">
                            <label className="form--label">2) Transients a value above mains</label>
                            <input
                                type="checkbox"
                                id="formIsTransAboveMains"
                                onChange={handleChange}
                                name="formIsTransAboveMains"
                                value={props.formData.formIsTransAboveMains}/> 
                        </div>
                        <div className="form--checkbox-container">
                            <label className="form--label">3) Working voltage is a sum of multiple voltages</label>
                            <input
                                type="checkbox"
                                id="formIsSum"
                                onChange={handleChange}
                                name="formIsSum"
                                value={props.formData.formIsSum} />
                        </div>
                        <div className="form--checkbox-container">
                            <label className="form--label">4) Working voltage contains recurring peaks</label>
                            <input
                                type="checkbox"
                                id="formIsRecurringPeak"
                                onChange={handleChange}
                                name="formIsRecurringPeak"
                                value={props.formData.formIsRecurringPeak} /> 
                        </div>
                        <div className="form--checkbox-container">
                            <label className="form--label">5) Frequency is greater than 30kHz</label>
                            <input
                                type="checkbox"
                                id="formIsFrequencyAbove30k"
                                onChange={handleChange}
                                name="formIsFrequencyAbove30k"
                                value={props.formData.formIsFrequencyAbove30k} /> 
                        </div>
                        <div className="form--checkbox-container">
                        <label className="form--label">Are mains transients expected?</label>
                        <input
                            type="checkbox"
                            id="formIsMainsTransients"
                            onChange={handleChange}
                            name="formIsMainsTransients"
                            value={props.formData.formIsMainsTransients} /> 
                        </div>
                        {
                            formData.formIsRecurringPeak &&

                            <div className="form--input-container">
                                <label className="form--label">Maximum peak working voltage (Vpk):</label>
                                <input 
                                    type="text"
                                    id="formMaxPeak"
                                    onChange={handleChange}
                                    name="formMaxPeak"
                                    value={props.formData.formMaxPeak}
                                />
                            </div>
                        }
                               
                        <div className="form--input-container">
                            <label className="form--label">Maximum expected transients (Vpk):</label>
                            <input
                                type="text"
                                id="formMaxTrans"
                                onChange={handleChange}
                                name="formMaxTrans"
                                value={props.formData.formMaxTrans}/>
                            </div>
                    </div>

                }

                <div className="form--checkbox-container">
                    <label className="form--label">Use interpolation when possible</label>
                    <input
                        type="checkbox"
                        id="formIsInterpol"
                        onChange={handleChange}
                        name="formIsInterpol"
                        value={props.formData.formIsInterpol} />
                </div>
                {
                    activeTab === 4 &&
                    <div className="form--checkbox-container">
                        <label className="form--label">6.7.1.5e usage information</label>
                        <i className="fa-solid fa-circle-question form--6715-info-button"
                            onClick={handleInfoClick}>
                        </i>
                    </div>
                }
            </form>
        </div>
    )
}