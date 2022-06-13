import React from "react";

import table4 from "../data/table4.js";
import table5 from "../data/table5.js";
import table6 from "../data/table6.js";
import table7 from "../data/table7.js";
import tablek2 from "../data/tablek2.js";
import tablek3 from "../data/tablek3.js";
import tablek4 from "../data/tablek4.js";
import tablek5 from "../data/tablek5.js";
import tablek6 from "../data/tablek6.js";
import tablek7 from "../data/tablek7.js";
import tablek8 from "../data/tablek8.js";
import tablek10 from "../data/tablek10.js";
import tablek11 from "../data/tablek11.js";
import tablek12 from "../data/tablek12.js";
import tablek15 from "../data/tablek15.js";
import tablek16 from "../data/tablek16.js";
import tablek17 from "../data/tablek17.js";

import {
  validate,
  interpolate,
  altitudeCorrection,
  getActiveTab,
  getValueFromTable,
} from "../utils";

export default function Results(props) {
  const {
    formMatType,
    formAlt,
    formPol,
    formMatGroup,
    formWV,
    formWVACDC,
    formDerivedWV,
    formOV,
    formDerivedOV,
    formMaxPeak,
    formMaxTrans,
    formIsTransBelowMains,
    formIsTransAboveMains,
    formIsSum,
    formIsRecurringPeak,
    formIsFrequencyAbove30k,
    formIsMainsTransients,
    formIsInterpol,
  } = props.formData;

  const tabs = props.tabs;

  const activeTab = getActiveTab(tabs);

  let clearanceBI;
  let clearanceRI;

  let clearanceFiveSecACBI;
  let clearanceFiveSecACRI;
  let clearanceOneMinDCBI;
  let clearanceOneMinDCRI;

  let clearanceImpulseBI;
  let clearanceImpulseRI;

  let creepage;

  let matGrp = formMatGroup;
  let matType = formMatType;

  // Preprocessing for creepage values. Required due to the allowable combinations in the table header
  if (formPol === "1") {
    matGrp = "any";
  }

  if (formPol === "2" && formMatType === "pwb" && formMatGroup === "IIIb") {
    matGrp = "III";
    matType = "other";
  } else if (
    formPol === "2" &&
    formMatType === "pwb" &&
    formMatGroup !== "IIIb"
  ) {
    matGrp = "notIIIb";
  }
  if (
    formPol !== "1" &&
    formMatType === "other" &&
    formMatGroup.includes("III")
  ) {
    matGrp = "III";
  }
  if (formPol === "3" && formMatType === "pwb") {
    matType = "other";
  }
  if (formMatType === "pwb" && formWV > 1000) {
    matType = "other";
  }

  let solidOneMinACBI;
  let solidOneMinACRI;
  let solidOneMinDCBI;
  let solidOneMinDCRI;

  let solidFiveSecACBI;
  let solidFiveSecACRI;
  let solidFiveSecDCBI;
  let solidFiveSecDCRI;

  let solidImpulseBI;
  let solidImpulseRI;

  const maxSecondaryTableVoltage = formWVACDC === "Vrms" ? 63000 : 88200;

  let details = {
    clearance: "",
    creepage: "",
    solid: "",
  };

  switch (activeTab) {
    case 0:
      if (formWV === "") {
        details.clearance = "";
        details.creepage = "";
        details.solid = "";
      } else if (formWV !== "" && isNaN(formWV)) {
        details.clearance = `Invalid Working Voltage entered. Working voltage must be a number between 0 and 300V.`;
        details.creepage =
          "Invalid Working Voltage entered. Working voltage must be a number between 0 and 300V.";
        details.solid =
          "Invalid Working Voltage entered. Working voltage must be a number between 0 and 300V.";
      } else {
        details.clearance = `Clearance values taken from Table 4. No option for evaluating clearances via dielectric or impulse testing. ${
          formIsInterpol
            ? "Clearance values from this table can not be interolated"
            : ""
        }`;
        details.creepage = "Creepage values taken from Table 4.";
        details.solid =
          "AC and DC solid insulation test voltages taken from Table 5.";
      }

      clearanceBI = validate(1, 300, formWV)
        ? altitudeCorrection(
            getValueFromTable(table4.clearance, formWV),
            formAlt
          )
        : "---";

      creepage = validate(1, 300, formWV)
        ? getValueFromTable(
            table4.creepage[matType][formPol][matGrp],
            formWV,
            formIsInterpol
          )
        : "---";

      solidOneMinACBI = validate(1, 300, formWV)
        ? getValueFromTable(table5.oneMinAC.bi, formWV)
        : "---";
      solidOneMinACRI = validate(1, 300, formWV)
        ? getValueFromTable(table5.oneMinAC.ri, formWV)
        : "---";
      solidOneMinDCBI = validate(1, 300, formWV)
        ? getValueFromTable(table5.oneMinDC.bi, formWV)
        : "---";
      solidOneMinDCRI = validate(1, 300, formWV)
        ? getValueFromTable(table5.oneMinDC.ri, formWV)
        : "---";

      break;

    case 1:
      if (formWV === "") {
        details.clearance = "";
        details.creepage = "";
        details.solid = "";
      } else if (formWV !== "" && isNaN(formWV)) {
        details.clearance = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
        details.creepage = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
        details.solid = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
      } else {
        details.clearance = `Clearances can be evaluated via measured spacings or 5 sec AC voltage dielectric tests as per Table 6. Additionally, if North American deviations are applied, one min DC voltage tests using 1.414 x AC delectric test voltage.`;
        details.creepage = "Creepage values taken from Table 7.";
        details.solid = `5 sec dielectric voltage test voltage taken from Table 6. ${
          formWV > 300
            ? "In addition to the 5 sec test, a one minute dielectric voltage test required."
            : ""
        }`;
      }

      clearanceBI = validate(1, maxSecondaryTableVoltage, formWV)
        ? altitudeCorrection(
            getValueFromTable(
              table6[formWVACDC].clearance[formDerivedWV],
              formWV,
              formIsInterpol
            ),
            formAlt
          )
        : "---";

      clearanceFiveSecACBI = validate(1, maxSecondaryTableVoltage, formWV)
        ? altitudeCorrection(
            getValueFromTable(
              table6[formWVACDC].acTestVoltage[formDerivedWV],
              formWV,
              formIsInterpol
            ),
            formAlt
          )
        : "---";
      clearanceFiveSecACRI = !isNaN(clearanceFiveSecACBI)
        ? 1.6 * clearanceFiveSecACBI
        : "---";
      clearanceOneMinDCBI = !isNaN(clearanceFiveSecACBI)
        ? 1.414 * clearanceFiveSecACBI
        : "---";
      clearanceOneMinDCRI = !isNaN(clearanceFiveSecACBI)
        ? 1.6 * clearanceOneMinDCBI
        : "---";

      creepage = validate(1, 63000, formWV)
        ? getValueFromTable(
            table7[matType][formPol][matGrp],
            formWV,
            formIsInterpol
          )
        : "---";

      solidFiveSecACBI = validate(1, maxSecondaryTableVoltage, formWV)
        ? getValueFromTable(
            table6[formWVACDC].acTestVoltage[formDerivedWV],
            formWV,
            formIsInterpol
          )
        : "---";
      solidFiveSecACRI = !isNaN(solidFiveSecACBI)
        ? 1.6 * solidFiveSecACBI
        : "---";
      solidFiveSecDCBI = !isNaN(solidFiveSecACBI)
        ? 1.414 * solidFiveSecACBI
        : "---";
      solidFiveSecDCRI = !isNaN(solidFiveSecACBI)
        ? 1.414 * solidFiveSecACRI
        : "---";

      if (!isNaN(formWV) && parseInt(formWV) > 300) {
        solidOneMinACBI = 1.5 * formWV;
        solidOneMinACRI = 2 * formWV;
        solidOneMinDCBI = 1.414 * solidOneMinACBI;
        solidOneMinDCRI = 1.414 * solidOneMinACRI;
      } else {
        solidOneMinACBI = "---";
        solidOneMinACRI = "---";
        solidOneMinDCBI = "---";
        solidOneMinDCRI = "---";
      }

      break;

    case 2:
      if (formOV === "II") {
        if (formWV === "") {
          details.clearance = "";
          details.creepage = "";
          details.solid = "";
        } else if (formWV !== "" && isNaN(formWV)) {
          details.clearance = `Invalid Working Voltage entered. Working voltage must be a number between 300 and 1000V.`;
          details.creepage =
            "Invalid Working Voltage entered. Working voltage must be a number between 300 and 1000V.";
          details.solid =
            "Invalid Working Voltage entered. Working voltage must be a number between 300 and 1000V.";
        } else {
          details.clearance =
            "Clearance values taken from Table K2. No option for evaluating clearances via dielectric or impulse testing. However, if any doubt about the clearance measurements, they can be confirmed via Impulse testing using a test voltage from Table K16.";
          details.creepage = "Creepage values taken from Table K2.";
          details.solid =
            "5 sec AC test or Impulse testing as per Table K5 is required. Additionally, a one minute dielectric voltage test required as per Table K8";
        }

        clearanceBI = validate(301, 1000, formWV)
          ? altitudeCorrection(
              getValueFromTable(tablek2.clearance, formWV),
              formAlt
            )
          : "---";

        creepage = validate(301, 1000, formWV)
          ? getValueFromTable(
              tablek2.creepage[matType][formPol][matGrp],
              formWV
            )
          : "---";

        solidFiveSecACBI = validate(301, 1000, formWV)
          ? getValueFromTable(tablek5.fiveSecVoltage.bi, formWV)
          : "---";
        solidFiveSecACRI = validate(301, 1000, formWV)
          ? getValueFromTable(tablek5.fiveSecVoltage.ri, formWV)
          : "---";
        solidImpulseBI = validate(301, 1000, formWV)
          ? getValueFromTable(tablek5.impulse.bi, formWV)
          : "---";
        solidImpulseRI = validate(301, 1000, formWV)
          ? getValueFromTable(tablek5.impulse.ri, formWV)
          : "---";
      } else if (formOV === "III") {
        if (formWV === "") {
          details.clearance = "";
          details.creepage = "";
          details.solid = "";
        } else if (formWV !== "" && isNaN(formWV)) {
          details.clearance = `Invalid Working Voltage entered. Working voltage must be a number between 0 and 1000V.`;
          details.creepage =
            "Invalid Working Voltage entered. Working voltage must be a number between 0 and 1000V.";
          details.solid =
            "Invalid Working Voltage entered. Working voltage must be a number between 0 and 1000V.";
        } else {
          details.clearance =
            "Clearance values taken from Table K3. No option for evaluating clearances via dielectric or impulse testing. However, if any doubt about the clearance measurements, they can be confirmed via Impulse testing using a test voltage from Table K16.";
          details.creepage = "Creepage values taken from Table K3.";
          details.solid =
            "5 sec AC test or Impulse testing as per Table K6 is required. Additionally, a one minute dielectric voltage test required as per Table K8";
        }

        clearanceBI = validate(1, 1000, formWV)
          ? altitudeCorrection(
              getValueFromTable(tablek3.clearance, formWV),
              formAlt
            )
          : "---";

        creepage = validate(1, 1000, formWV)
          ? getValueFromTable(
              tablek3.creepage[matType][formPol][matGrp],
              formWV
            )
          : "---";

        solidFiveSecACBI = validate(1, 1000, formWV)
          ? getValueFromTable(tablek6.fiveSecVoltage.bi, formWV)
          : "---";
        solidFiveSecACRI = validate(1, 1000, formWV)
          ? getValueFromTable(tablek6.fiveSecVoltage.ri, formWV)
          : "---";
        solidImpulseBI = validate(1, 1000, formWV)
          ? getValueFromTable(tablek6.impulse.bi, formWV)
          : "---";
        solidImpulseRI = validate(1, 1000, formWV)
          ? getValueFromTable(tablek6.impulse.ri, formWV)
          : "---";
      } else if (formOV === "IV") {
        if (formWV === "") {
          details.clearance = "";
          details.creepage = "";
          details.solid = "";
        } else if (
          (formWV !== "" && isNaN(formWV)) ||
          formWV <= 0 ||
          formWV > 1000
        ) {
          details.clearance = `Invalid Working Voltage entered. Working voltage must be a number between 0 and 1000V.`;
          details.creepage =
            "Invalid Working Voltage entered. Working voltage must be a number between 0 and 1000V.";
          details.solid =
            "Invalid Working Voltage entered. Working voltage must be a number between 0 and 1000V.";
        } else {
          details.clearance =
            "Clearance values taken from Table K4. No option for evaluating clearances via dielectric or impulse testing. However, if any doubt about the clearance measurements, they can be confirmed via Impulse testing using a test voltage from Table K16.";
          details.creepage = "Creepage values taken from Table K4.";
          details.solid =
            "5 sec AC test or Impulse testing as per Table K7 is required. Additionally, a one minute dielectric voltage test required as per Table K8";
        }

        clearanceBI = validate(1, 1000, formWV)
          ? altitudeCorrection(
              getValueFromTable(tablek4.clearance, formWV),
              formAlt
            )
          : "---";

        creepage = validate(1, 1000, formWV)
          ? getValueFromTable(
              tablek4.creepage[matType][formPol][matGrp],
              formWV
            )
          : "---";

        solidFiveSecACBI = validate(1, 1000, formWV)
          ? getValueFromTable(tablek7.fiveSecVoltage.bi, formWV)
          : "---";
        solidFiveSecACRI = validate(1, 1000, formWV)
          ? getValueFromTable(tablek7.fiveSecVoltage.ri, formWV)
          : "---";
        solidImpulseBI = validate(1, 1000, formWV)
          ? getValueFromTable(tablek7.impulse.bi, formWV)
          : "---";
        solidImpulseRI = validate(1, 1000, formWV)
          ? getValueFromTable(tablek7.impulse.ri, formWV)
          : "---";
      }
      const minVoltage = formOV === "II" ? 301 : 1;

      solidOneMinACBI = validate(minVoltage, 1000, formWV)
        ? getValueFromTable(tablek8.oneMinAC.bi, formWV)
        : "---";
      solidOneMinACRI = validate(minVoltage, 1000, formWV)
        ? getValueFromTable(tablek8.oneMinAC.ri, formWV)
        : "---";
      solidOneMinDCBI = validate(minVoltage, 1000, formWV)
        ? getValueFromTable(tablek8.oneMinDC.bi, formWV)
        : "---";
      solidOneMinDCRI = validate(minVoltage, 1000, formWV)
        ? getValueFromTable(tablek8.oneMinDC.ri, formWV)
        : "---";

      solidFiveSecDCBI = !isNaN(solidFiveSecACBI)
        ? solidFiveSecACBI * 1.414
        : "---";
      solidFiveSecDCRI = !isNaN(solidFiveSecACRI)
        ? solidFiveSecACRI * 1.414
        : "---";
      // "If in doubt" options

      clearanceFiveSecACBI = validate(minVoltage, 1000, formWV)
        ? getValueFromTable(tablek16.acrms, clearanceBI)
        : "---";
      clearanceFiveSecACRI = validate(minVoltage, 1000, formWV)
        ? getValueFromTable(tablek16.acrms, 2 * clearanceBI)
        : "---";
      clearanceImpulseBI = validate(minVoltage, 1000, formWV)
        ? getValueFromTable(tablek16.impulse, clearanceBI)
        : "---";
      clearanceImpulseRI = validate(minVoltage, 1000, formWV)
        ? getValueFromTable(tablek16.impulse, 2 * clearanceBI)
        : "---";

      break;

    case 3:
      if (formDerivedOV === "II") {
        if (formWV === "") {
          details.clearance = "";
          details.creepage = "";
          details.solid = "";
        } else if (formWV !== "" && isNaN(formWV)) {
          details.clearance = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
          details.creepage = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
          details.solid = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
        } else {
          details.clearance = `Clearances can be evaluated via measured spacings or 5 sec AC voltage dielectric tests as per Table K10. Additionally, if North American deviations are applied, one min DC voltage tests using 1.414 x AC delectric test voltage.`;
          details.creepage = "Creepage values taken from Table 7.";
          details.solid = `5 sec dielectric voltage test voltage taken from Table K10. ${
            formWV > 300
              ? "In addition to the 5 sec test, a one minute dielectric voltage test required."
              : ""
          }`;
        }

        clearanceBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? altitudeCorrection(
              getValueFromTable(
                tablek10[formWVACDC].clearance[formDerivedWV],
                formWV,
                formIsInterpol
              ),
              formAlt
            )
          : "---";

        clearanceFiveSecACBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? altitudeCorrection(
              getValueFromTable(
                tablek10[formWVACDC].acTestVoltage[formDerivedWV],
                formWV,
                formIsInterpol
              ),
              formAlt
            )
          : "---";

        solidFiveSecACBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? getValueFromTable(
              tablek10[formWVACDC].acTestVoltage[formDerivedWV],
              formWV,
              formIsInterpol
            )
          : "---";
      } else if (formDerivedOV === "III") {
        if (formWV === "") {
          details.clearance = "";
          details.creepage = "";
          details.solid = "";
        } else if (formWV !== "" && isNaN(formWV)) {
          details.clearance = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
          details.creepage = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
          details.solid = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
        } else {
          details.clearance = `Clearances can be evaluated via measured spacings or 5 sec AC voltage dielectric tests as per Table 6. Additionally, if North American deviations are applied, one min DC voltage tests using 1.414 x AC delectric test voltage.`;
          details.creepage = "Creepage values taken from Table 7.";
          details.solid = `5 sec dielectric voltage test voltage taken from Table K11. ${
            formWV > 300
              ? "In addition to the 5 sec test, a one minute dielectric voltage test required."
              : ""
          }`;
        }

        clearanceBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? altitudeCorrection(
              getValueFromTable(
                tablek11[formWVACDC].clearance[formDerivedWV],
                formWV,
                formIsInterpol
              ),
              formAlt
            )
          : "---";
        clearanceFiveSecACBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? altitudeCorrection(
              getValueFromTable(
                tablek11[formWVACDC].acTestVoltage[formDerivedWV],
                formWV,
                formIsInterpol
              ),
              formAlt
            )
          : "---";

        solidFiveSecACBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? getValueFromTable(
              tablek11[formWVACDC].acTestVoltage[formDerivedWV],
              formWV,
              formIsInterpol
            )
          : "---";
      } else if (formDerivedOV === "IV") {
        if (formWV === "") {
          details.clearance = "";
          details.creepage = "";
          details.solid = "";
        } else if (formWV !== "" && isNaN(formWV)) {
          details.clearance = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
          details.creepage = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
          details.solid = `Invalid Working Voltage entered. Working voltage must be a number between 0 and ${maxSecondaryTableVoltage}.`;
        } else {
          details.clearance = `Clearances can be evaluated via measured spacings or 5 sec AC voltage dielectric tests as per Table 6. Additionally, if North American deviations are applied, one min DC voltage tests using 1.414 x AC delectric test voltage.`;
          details.creepage = "Creepage values taken from Table 7.";
          details.solid = `5 sec dielectric voltage test voltage taken from Table K12. ${
            formWV > 300
              ? "In addition to the 5 sec test, a one minute dielectric voltage test required."
              : ""
          }`;
        }

        clearanceBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? altitudeCorrection(
              getValueFromTable(
                tablek12[formWVACDC].clearance[formDerivedWV],
                formWV,
                formIsInterpol
              ),
              formAlt
            )
          : "---";
        clearanceFiveSecACBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? altitudeCorrection(
              getValueFromTable(
                tablek12[formWVACDC].acTestVoltage[formDerivedWV],
                formWV,
                formIsInterpol
              ),
              formAlt
            )
          : "---";

        solidFiveSecACBI = validate(1, maxSecondaryTableVoltage, formWV)
          ? getValueFromTable(
              tablek12[formWVACDC].acTestVoltage[formDerivedWV],
              formWV,
              formIsInterpol
            )
          : "---";
      }

      clearanceFiveSecACRI = !isNaN(clearanceFiveSecACBI)
        ? clearanceFiveSecACBI * 1.6
        : "---";
      clearanceOneMinDCBI = !isNaN(clearanceFiveSecACBI)
        ? clearanceFiveSecACBI * 1.414
        : "---";
      clearanceOneMinDCRI = !isNaN(clearanceFiveSecACBI)
        ? clearanceOneMinDCBI * 1.6
        : "---";

      creepage = validate(1, 63000, formWV)
        ? getValueFromTable(
            table7[matType][formPol][matGrp],
            formWV,
            formIsInterpol
          )
        : "---";

      solidFiveSecACRI = !isNaN(solidFiveSecACBI)
        ? solidFiveSecACBI * 1.6
        : "---";
      solidFiveSecDCBI = !isNaN(solidFiveSecACBI)
        ? solidFiveSecACBI * 1.414
        : "---";
      solidFiveSecDCRI = !isNaN(solidFiveSecACBI)
        ? solidFiveSecACRI * 1.414
        : "---";

      if (!isNaN(formWV) && parseInt(formWV) > 300) {
        solidOneMinACBI = 1.5 * formWV;
        solidOneMinACRI = 2 * formWV;
        solidOneMinDCBI = 1.414 * solidOneMinACBI;
        solidOneMinDCRI = 1.414 * solidOneMinACRI;
      } else {
        solidOneMinACBI = "---";
        solidOneMinACRI = "---";
        solidOneMinDCBI = "---";
        solidOneMinDCRI = "---";
      }

      break;
    case 4:
      if (isNaN(formWV) || isNaN(formMaxTrans) || isNaN(formMaxPeak)) {
        break;
      }

      if (formWV === "") {
        details.clearance = "";
        details.creepage = "";
        details.solid = "";
      } else if (formWV !== "" && isNaN(formWV)) {
        details.clearance = `Invalid value entered.`;
        details.creepage = `Invalid value entered.`;
        details.solid = `Invalid value entered.`;
      } else {
        details.clearance = `Clearances can be evaluated via measured spacings, 5 sec AC voltage dielectric test, or impulse test as per Table K16 (based on the calculated clearance distance requirement). Additionally, if North American deviations are applied, one min DC voltage tests using 1.414 x AC delectric test voltage.`;
        details.creepage = "Creepage values taken from Table 7.";
        details.solid = `5 sec dielectric voltage test voltage taken from Table K10. ${
          formWV > 300
            ? "In addition to the 5 sec test, a one minute dielectric voltage test required."
            : ""
        }`;
      }

      let ut = parseInt(formMaxTrans);
      let uw;
      let um;

      if (formIsRecurringPeak) {
        uw = parseFloat(formMaxPeak);
      } else {
        if (formWVACDC === "Vrms") {
          uw = parseFloat(formWV) * 1.414;
        } else {
          uw = parseFloat(formWV);
        }
      }

      if (formIsMainsTransients) {
        um = ut > uw ? ut : uw;
      } else {
        um = uw + ut;
        console.log(um, uw, ut);
      }

      let f = uw / um > 0.2 ? (1.25 * uw) / um - 0.25 : 0;

      let d1 = validate(1, 100000, um)
        ? getValueFromTable(tablek15.d1, um, formIsInterpol)
        : "---";
      let d2 = validate(1, 100000, um)
        ? getValueFromTable(tablek15.d2, um, formIsInterpol)
        : "---";

      if (
        formIsTransAboveMains ||
        formIsTransBelowMains ||
        formIsSum ||
        formIsRecurringPeak
      ) {
        clearanceBI = d1 + f * (d2 - d1);
      } else if (formIsFrequencyAbove30k) {
        details.clearance = `Clearances can be evaluated via measured spacings, 5 sec AC voltage dielectric test, or impulse test as per Table K16 (based on the required clearance distance as per table k17). Additionally, if North American deviations are applied, one min DC voltage tests using 1.414 x AC delectric test voltage.`;
        clearanceBI = validate(1, 40000, uw)
          ? getValueFromTable(tablek17.above30, uw, formIsInterpol)
          : "---";
        console.log(clearanceBI);
      }
      var altCorrectedClearance = altitudeCorrection(clearanceBI, formAlt);

      clearanceFiveSecACBI = validate(0.01, 100, altCorrectedClearance)
        ? getValueFromTable(
            tablek16.acrms,
            altCorrectedClearance,
            formIsInterpol
          )
        : "---";
      clearanceFiveSecACRI = !isNaN(clearanceFiveSecACBI)
        ? clearanceFiveSecACBI * 1.6
        : "---";
      clearanceImpulseBI = validate(0.01, 100, altCorrectedClearance)
        ? getValueFromTable(
            tablek16.impulse,
            altCorrectedClearance,
            formIsInterpol
          )
        : "---";
      clearanceImpulseRI = !isNaN(clearanceImpulseBI)
        ? clearanceImpulseBI * 1.6
        : "---";
      clearanceOneMinDCBI = !isNaN(clearanceFiveSecACBI)
        ? clearanceFiveSecACBI * 1.414
        : "---";
      clearanceOneMinDCRI = !isNaN(clearanceFiveSecACRI)
        ? clearanceFiveSecACRI * 1.414
        : "---";

      creepage = validate(1, 63000, formWV)
        ? getValueFromTable(
            table7[matType][formPol][matGrp],
            formWV,
            formIsInterpol
          )
        : "---";

      solidFiveSecACBI = validate(0.01, 100, clearanceBI)
        ? getValueFromTable(tablek16.acrms, clearanceBI, formIsInterpol)
        : "---";
      solidFiveSecACRI = !isNaN(solidFiveSecACBI)
        ? solidFiveSecACBI * 1.6
        : "---";
      solidFiveSecDCBI = !isNaN(solidFiveSecACBI)
        ? solidFiveSecACBI * 1.414
        : "---";
      solidFiveSecDCRI = !isNaN(solidFiveSecACBI)
        ? solidFiveSecACRI * 1.414
        : "---";

      clearanceBI = altCorrectedClearance;

      if (!isNaN(formWV) && parseInt(formWV) > 300) {
        solidOneMinACBI = 1.5 * formWV;
        solidOneMinACRI = 2 * formWV;
        solidOneMinDCBI = 1.414 * solidOneMinACBI;
        solidOneMinDCRI = 1.414 * solidOneMinACRI;
      } else {
        solidOneMinACBI = "---";
        solidOneMinACRI = "---";
        solidOneMinDCBI = "---";
        solidOneMinDCRI = "---";
      }

      break;
  }

  if (!isNaN(clearanceBI)) {
    if (formPol === "2") {
      clearanceRI = clearanceBI * 2;
      clearanceBI = clearanceBI <= 0.2 ? 0.2 : clearanceBI;
      clearanceRI = clearanceRI <= 0.2 ? 0.2 : clearanceRI;
    } else if (formPol === "3") {
      clearanceRI = clearanceBI * 2;
      clearanceBI = clearanceBI <= 0.8 ? 0.8 : clearanceBI;
      clearanceRI = clearanceRI <= 0.8 ? 0.8 : clearanceRI;
    } else {
      clearanceBI = clearanceBI;
      clearanceRI = clearanceBI * 2;
    }

    if (clearanceBI > creepage) {
      creepage = clearanceBI;
    }
  } else {
    clearanceBI = "---";
    clearanceRI = "---";
  }

  clearanceBI = !isNaN(clearanceBI) ? clearanceBI.toFixed(2) : "---";
  clearanceRI = !isNaN(clearanceRI) ? clearanceRI.toFixed(2) : "---";
  clearanceFiveSecACBI = !isNaN(clearanceFiveSecACBI)
    ? clearanceFiveSecACBI.toFixed()
    : "---";
  clearanceFiveSecACRI = !isNaN(clearanceFiveSecACRI)
    ? clearanceFiveSecACRI.toFixed()
    : "---";
  clearanceOneMinDCBI = !isNaN(clearanceOneMinDCBI)
    ? clearanceOneMinDCBI.toFixed()
    : "---";
  clearanceOneMinDCRI = !isNaN(clearanceOneMinDCRI)
    ? clearanceOneMinDCRI.toFixed()
    : "---";
  clearanceImpulseBI = !isNaN(clearanceImpulseBI)
    ? clearanceImpulseBI.toFixed()
    : "---";
  clearanceImpulseRI = !isNaN(clearanceImpulseRI)
    ? clearanceImpulseRI.toFixed()
    : "---";
  creepage = !isNaN(creepage) ? creepage.toFixed(2) : "---";
  solidOneMinACBI = !isNaN(solidOneMinACBI) ? solidOneMinACBI.toFixed() : "---";
  solidOneMinACRI = !isNaN(solidOneMinACRI) ? solidOneMinACRI.toFixed() : "---";
  solidOneMinDCBI = !isNaN(solidOneMinDCBI) ? solidOneMinDCBI.toFixed() : "---";
  solidOneMinDCRI = !isNaN(solidOneMinDCRI) ? solidOneMinDCRI.toFixed() : "---";
  solidFiveSecACBI = !isNaN(solidFiveSecACBI)
    ? solidFiveSecACBI.toFixed()
    : "---";
  solidFiveSecACRI = !isNaN(solidFiveSecACRI)
    ? solidFiveSecACRI.toFixed()
    : "---";
  solidFiveSecDCBI = !isNaN(solidFiveSecDCBI)
    ? solidFiveSecDCBI.toFixed()
    : "---";
  solidFiveSecDCRI = !isNaN(solidFiveSecDCRI)
    ? solidFiveSecDCRI.toFixed()
    : "---";
  solidImpulseBI = !isNaN(solidImpulseBI) ? solidImpulseBI.toFixed() : "---";
  solidImpulseRI = !isNaN(solidImpulseRI) ? solidImpulseRI.toFixed() : "---";

  return (
    <div className="results--container">
      <div className="results--grouping">
        <div className="results--container-clearance">
          <div className="results--row-container">
            <label className="results--label-title">Clearance</label>
            <label className="results--label-biri">BI/ SI</label>
            <label className="results--label-biri">RI</label>
          </div>

          {(activeTab === 0 ||
            activeTab === 1 ||
            activeTab === 2 ||
            activeTab === 3 ||
            activeTab === 4) && (
            <div className="results--row-container">
              <h4 className="results--method">Spacings:</h4>
              <h4 className="results--value">{clearanceBI} mm</h4>
              <h4 className="results--value">{clearanceRI} mm</h4>
            </div>
          )}
          {(activeTab === 1 ||
            activeTab === 2 ||
            activeTab === 3 ||
            activeTab === 4) && (
            <div className="results--row-container">
              <h4 className="results--method">5 sec voltage tests:</h4>
              <h4 className="results--value">{clearanceFiveSecACBI} Vac</h4>
              <h4 className="results--value">{clearanceFiveSecACRI} Vac</h4>
            </div>
          )}
          {(activeTab === 1 || activeTab === 3 || activeTab === 4) && (
            <div className="results--row-container">
              <h4 className="results--method">One minute voltage tests:</h4>
              <h4 className="results--value">{clearanceOneMinDCBI} Vdc</h4>
              <h4 className="results--value">{clearanceOneMinDCRI} Vdc</h4>
            </div>
          )}
          {(activeTab === 2 || activeTab === 4) && (
            <div className="results--row-container">
              <h4 className="results--method">1, 2/50us Vpeak impulse test:</h4>
              <h4 className="results--value">{clearanceImpulseBI} Vpk</h4>
              <h4 className="results--value">{clearanceImpulseRI} Vpk</h4>
            </div>
          )}
        </div>
        <div className="results--container-details">
          <label className="results--label-title">Details</label>
          <textarea
            className="results--details"
            disabled
            value={details.clearance}
          />
        </div>
      </div>

      <div className="results--grouping">
        <div className="results--container-creepage">
          <div className="results--row-container">
            <label className="results--label-title">Creepages</label>
            <label className="results--label-biri">BI/ SI</label>
            <label className="results--label-biri">RI</label>
          </div>
          <div className="results--row-container">
            <h4 className="results--method">Spacings:</h4>
            <h4 className="results--value">{creepage} mm</h4>
            <h4 className="results--value">
              {creepage !== "---" ? (2 * creepage).toFixed(2) : "---"} mm
            </h4>
          </div>
        </div>
        <div className="results--container-details">
          <label className="results--label-title">Details</label>
          <textarea
            className="results--details"
            value={details.creepage}
            disabled
          />
        </div>
      </div>

      <div className="results--grouping">
        <div className="results--container-solidInsulation">
          <div className="results--row-container">
            <label className="results--label-title">Solid Insulation</label>
            <label className="results--label-biri">BI/ SI</label>
            <label className="results--label-biri">RI</label>
          </div>
          {(activeTab === 0 ||
            activeTab === 1 ||
            activeTab === 2 ||
            activeTab === 3 ||
            activeTab === 4) && (
            <div className="results--row-container">
              <h4 className="results--method">One minute voltage tests:</h4>
              <h4 className="results--value">{solidOneMinACBI} Vac</h4>
              <h4 className="results--value">{solidOneMinACRI} Vac</h4>
            </div>
          )}
          {(activeTab === 0 ||
            activeTab === 1 ||
            activeTab === 2 ||
            activeTab === 3 ||
            activeTab === 4) && (
            <div className="results--row-container">
              <h4 className="results--method">One minute voltage tests:</h4>
              <h4 className="results--value">{solidOneMinDCBI} Vdc</h4>
              <h4 className="results--value">{solidOneMinDCRI} Vdc</h4>
            </div>
          )}
          {(activeTab === 1 ||
            activeTab === 2 ||
            activeTab === 3 ||
            activeTab === 4) && (
            <div className="results--row-container">
              <h4 className="results--method">5 sec voltage tests:</h4>
              <h4 className="results--value">{solidFiveSecACBI} Vac</h4>
              <h4 className="results--value">{solidFiveSecACRI} Vac</h4>
            </div>
          )}
          {(activeTab === 1 ||
            activeTab === 2 ||
            activeTab === 3 ||
            activeTab === 4) && (
            <div className="results--row-container">
              <h4 className="results--method">5 sec voltage tests:</h4>
              <h4 className="results--value">{solidFiveSecDCBI} Vdc</h4>
              <h4 className="results--value">{solidFiveSecDCRI} Vdc</h4>
            </div>
          )}
          {activeTab === 2 && (
            <div className="results--row-container">
              <h4 className="results--method">1, 2/50us Vpeak impulse test:</h4>
              <h4 className="results--value">{solidImpulseBI} Vpk</h4>
              <h4 className="results--value">{solidOneMinACRI} Vpk</h4>
            </div>
          )}
        </div>
        <div className="results--container-details">
          <label className="results--label-title">Details</label>
          <textarea
            className="results--details"
            value={details.solid}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
