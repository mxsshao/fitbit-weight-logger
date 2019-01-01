import { settingsStorage } from "settings";

import { debug } from "../common/log.js";

import Fitbit from "./fitbit";
import { sendVal } from "./communication";

const fetchAndSendWeight = () => {
  const fitbit = getFitbitInstance();

  if (!fitbit) {
    return;
  }

  fitbit.getLastEntry().then(lastEntry => {
    if (lastEntry) {
      sendVal({
        key: "LATEST_ENTRY",
        value: lastEntry.weight,
        date: lastEntry.date
      });
    }
  });
};

const getFitbitInstance = () => {
  const oauthData = settingsStorage.getItem("oauth");

  if (!oauthData) {
    debug("No Oauth data found");
    return null;
  }

  const oauthDataParsed = JSON.parse(oauthData);
  return new Fitbit(oauthDataParsed, unit);
};

const postWeightTodayAndSendResponseToApp = weightToday => {
  const fitbit = getFitbitInstance();

  fitbit.postWeightToday(weightToday).then(jsonData => {
    const entry = jsonData.weightLog;

    sendVal({
      key: "WEIGHT_TODAY",
      date: entry.date,
      value: entry.weight,
      bmi: entry.bmi
    });
  });
};

export {
  getFitbitInstance,
  fetchAndSendWeight,
  postWeightTodayAndSendResponseToApp
};
