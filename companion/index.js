import * as messaging from "messaging";
import { settingsStorage } from "settings";
import { debug, error } from "../common/log.js";
import { fetchAndSendWeight, postWeightTodayAndSendResponseToApp } from "./data";

messaging.peerSocket.onopen = function() {
  debug("Companion Socket Open");
  fetchAndSendWeight();
};

// Message socket closes
messaging.peerSocket.onclose = function() {
  debug("Companion Socket Closed");
};

// Message is received
messaging.peerSocket.onmessage = function(e) {
  if (e.data.key === "WEIGHT_LOGGED_TODAY") {
    postWeightTodayAndSendResponseToApp(e.data.value);
  }
};

// Problem with message socket
messaging.peerSocket.onerror = function(e) {
  error("Connection error: " + e.code + " - " + e.message);
};

settingsStorage.onchange = function(e) {
  debug(`Settings changed: ${JSON.stringify(e)}`);
};