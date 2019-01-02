import * as messaging from "messaging";

import { debug, error } from "../common/log.js";
// Send data to device using Messaging API
export const sendVal = data => {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      try {
        messaging.peerSocket.send(data);
        debug(`Sent to companion: ${JSON.stringify(data)}`);
      } catch (err) {
        error(`Exception when sending to companion`);
      }
    } else {
      error("Unable to send data to app");
    }
  };