function interpolate(x, x1, x2, y1, y2) {
    return y1+(x-x1)*((y2-y1)/(x2-x1))
}

function altitudeCorrection(clr, alt) {
    let correctionFactor;
    if (alt === '2000') { correctionFactor = 1 }
    else if (alt === '3000') { correctionFactor = 1.14 }
    else if (alt === '4000') { correctionFactor = 1.29 }
    else if (alt === '5000') { correctionFactor = 1.48 }

    return clr === '---' ? '---' : clr*correctionFactor
}

function getActiveTab(tabs) {
    let activeTab;
    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].isActive) {
            activeTab = i
        }
    }
    return activeTab
}

function getValueFromTable(table, searchIndex, ...isInterpolate) {
    let value;
    let prevValue;
    let prevKey;

    if (searchIndex === "") { return '---' };

    if (isInterpolate[0]) {
        for (let key in table) {
            if (searchIndex > parseInt(key)) {
                prevKey = key;
                prevValue = table[key]
                continue
            } else {
                value = interpolate(searchIndex, prevKey, key, prevValue, table[key])
                break
            }
        }
        
    } else {
        for (let key in table) {
            if (searchIndex > parseInt(key)) {
                continue
            } else {
                value = table[key]
                break
            }
        }
    }
    return value
}

function validate(min, max, value) {
    return (!isNaN(value) && (value >= min && value <= max)) ? true : false
}



export { validate, interpolate, altitudeCorrection, getActiveTab, getValueFromTable }