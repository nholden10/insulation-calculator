function interpolate(x, x1, x2, y1, y2) {
  return y1 + (x - x1) * ((y2 - y1) / (x2 - x1));
}

function altitudeCorrection(clr, alt) {
  let correctionFactor;
  if (alt === "2000") {
    correctionFactor = 1;
  } else if (alt === "3000") {
    correctionFactor = 1.14;
  } else if (alt === "4000") {
    correctionFactor = 1.29;
  } else if (alt === "5000") {
    correctionFactor = 1.48;
  }

  return clr === "---" ? "---" : clr * correctionFactor;
}

function getActiveTab(tabs) {
  let activeTab;
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].isActive) {
      activeTab = i;
    }
  }
  return activeTab;
}

function getValueFromTable(table, searchIndex, ...isInterpolate) {
  let value;
  let prevValue;
  let prevKey;

  if (searchIndex === "") {
    return "---";
  }

  if (isInterpolate[0]) {
    for (let key in table) {
      if (searchIndex > parseInt(key)) {
        prevKey = key;
        prevValue = table[key];
        continue;
      } else {
        if (isNaN(prevKey)) {
          prevKey = 0;
          prevValue = 0;
        }
        value = interpolate(searchIndex, prevKey, key, prevValue, table[key]);
        break;
      }
    }
  } else {
    for (let key in table) {
      if (searchIndex > parseInt(key)) {
        continue;
      } else {
        value = table[key];
        break;
      }
    }
  }
  return value;
}

function validate(min, max, value) {
  return !isNaN(value) && value >= min && value <= max ? true : false;
}

// function getDetails() {

//     let clearanceDetails;
//     let creepageDetails;
//     let solidDetails;

//     if (formWV === "") {
//         details.clearance = "";
//         details.creepage = "";
//         details.solid = "";
//     } else if(formWV !== "" && isNaN(formWV) ) {
//         details.clearance = "Invalid Working Voltage entered. Working voltage must be a number between 0 and 300V."
//         details.creepage = "Invalid Working Voltage entered. Working voltage must be a number between 0 and 300V.";
//         details.solid = "Invalid Working Voltage entered. Working voltage must be a number between 0 and 300V.";
//     } else {
//         details.clearance = "Clearance values taken from Table 4. No option for evaluating clearances via dielectric or impulse testing."
//         details.creepage = "Creepage values taken from Table 4.";
//         details.solid = "AC and DC solid insulation test voltages taken from Table 5.";
//     }
//     return details
// }

export {
  validate,
  interpolate,
  altitudeCorrection,
  getActiveTab,
  getValueFromTable,
};
