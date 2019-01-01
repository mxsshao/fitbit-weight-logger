import { settingsStorage } from "settings";

import { debug } from "../common/log.js";

import {
  fetchAndSendWeight,
} from "./data";

const initSettings = () => {
  // A user changes settings
  settingsStorage.onchange = evt => {
    debug(`Settings changed: ${JSON.stringify(evt)}`);

    if (evt.key === "oauth") {
      fetchAndSendWeight();
    }
  };
};

const updateOauthSettings = oauthData => {
  settingsStorage.setItem("oauth", JSON.stringify(oauthData));
  debug(`Wrote new Oauth data to settings`);
};

export { initSettings, updateOauthSettings };
