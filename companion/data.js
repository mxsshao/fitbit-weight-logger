import { settingsStorage } from "settings";

import { debug } from "../common/log.js";

import Fitbit from "./fitbit";
import { sendVal } from "./communication"

const fetchAndSendWeight = () => {
  const fitbit = getFitbitInstance();

  if (!fitbit) {
    return;
  }

  fitbit.getLastEntry().then(lastEntry => {
    if (lastEntry) {
      sendVal({
        key: "LATEST_ENTRY",
        value: lastEntry
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
  return new Fitbit(oauthDataParsed);
};

const postWeightTodayAndSendResponseToApp = value => {
  const fitbit = getFitbitInstance();

  if (value.weight) {
    fitbit.postWeightToday(value.weight).then(response_weight => {
      if (value.body_fat) {
        fitbit.postFatToday(value.body_fat).then(response_fat => {
          let log_weight = response_weight.weightLog;
          let log_fat = response_fat.fatLog;
          if (log_weight && log_fat) {
            sendVal({
              key: "LOG_RESPONSE",
              value: {
                "date": log_weight.date,
                "weight": log_weight.weight,
                "body_fat": log_fat.fat
              }
            });
          }
        })
      } else {
        let log = response_weight.weightLog;
        if (log) {
          sendVal({
            key: "LOG_RESPONSE",
            value: {
              "date": log.date,
              "weight": log.weight
            }
          });
        }
      }
    });
  }
};

export {
  getFitbitInstance,
  fetchAndSendWeight,
  postWeightTodayAndSendResponseToApp
};