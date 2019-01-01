import * as messaging from "messaging";
import { debug, error } from "../common/log.js";

export const sendVal = function(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      try {
        messaging.peerSocket.send(data);
        debug(`Sent to app: ${JSON.stringify(data)}`);
      } catch (err) {
        error(`Exception when sending to companion`);
      }
    } else {
      error("Unable to send data to app");
    }
  };