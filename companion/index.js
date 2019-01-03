import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { debug, error } from "../common/log.js";

import {
  fetchAndSendWeight,
  postWeightTodayAndSendResponseToApp
} from "./data";


messaging.peerSocket.onopen = () => {
  debug("Companion Socket Open");
  fetchAndSendWeight();
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  debug("Companion Socket Closed");
};

// Message is received
messaging.peerSocket.onmessage = evt => {
  if (evt.data.key === "WEIGHT_LOGGED_TODAY") {
    postWeightTodayAndSendResponseToApp(evt.data.value);
  }
};

// Problem with message socket
messaging.peerSocket.onerror = err => {
  error("Connection error: " + err.code + " - " + err.message);
};

settingsStorage.onchange = evt => {
  debug(`Settings changed: ${JSON.stringify(evt)}`);

  // if (evt.key === "oauth") {
  //   fetchAndSendWeight();
  // }
};