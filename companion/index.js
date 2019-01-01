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
      debug(`Companion received: ${JSON.stringify(evt, undefined, 2)}`);
  
      if (evt.data.key === "WEIGHT_LOGGED_TODAY") {
        postWeightTodayAndSendResponseToApp(evt.data.value);
      } else if (evt.data.key === "REQUEST_LATEST_ENTRY") {
        fetchAndSendLastEntry();
      }
    };
  
    // Problem with message socket
    messaging.peerSocket.onerror = err => {
      error("Connection error: " + err.code + " - " + err.message);
    };