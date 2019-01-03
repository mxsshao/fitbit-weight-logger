import { settingsStorage } from "settings";

import { debug } from "../common/log.js";

import Fitbit from "./fitbit";
import { sendVal } from "./communication"

export function fetchAndSendWeight() {
  let unit_setting = settingsStorage.getItem("unit");
  let unit = (unit_setting ? JSON.parse(unit_setting).values[0].value : "metric");

  let fitbit = getFitbitInstance(unit);

  if (!fitbit) {
    return;
  }

  fitbit.getLastEntry().then(lastEntry => {
    sendVal({
      key: "LATEST_ENTRY",
      value: lastEntry
    });
  });
};

export function getFitbitInstance(unit) {
  let oauthData = settingsStorage.getItem("oauth");

  if (!oauthData) {
    debug("No Oauth data found");
    sendVal({
      key: "ERROR",
      value: {
        "header": "Not Logged In",
        "text": "Go to settings to login to your fitbit account."
      }
    });
    return null;
  }

  let oauthDataParsed = JSON.parse(oauthData);
  return new Fitbit(oauthDataParsed, unit);
};

export function postWeightTodayAndSendResponseToApp(value) {

  let unit = (value.unit ? value.unit : "metric" );

  let fitbit = getFitbitInstance(unit);

  if (value.weight) {
    fitbit.postWeightToday(value).then(response_weight => {
      let log = response_weight.weightLog;
      if (log) {
        sendVal({
          key: "LOG_RESPONSE",
          value: {
            "date": log.date,
            "weight": log.weight,
            "body_fat": log.fat,
            "unit": unit
          }
        });
      }
    });
  }
};