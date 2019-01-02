import document from "document";
import { preferences } from "user-settings";
import * as messaging from "messaging";
import { debug, error } from "../common/log.js";
import { getMonthName } from "../common/utils.js";
import { me } from "appbit";

const back_main = document.getElementById("back_main");
const back_log = document.getElementById("back_log");
const label_last_recorded = document.getElementById("label_last_recorded");
const label_weight = document.getElementById("label_weight");
const label_fat = document.getElementById("label_fat");
const btn_log = document.getElementById("btn_log");

let weight, body_fat;
let state = "MAIN";

messaging.peerSocket.onmessage = evt => {
    debug(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.key === "LATEST_ENTRY") {
        let date = new Date(evt.data.value.date);
        let text_date = date.getDate() + " " + getMonthName(date.getMonth()) + " " + date.getFullYear();
        debug(text_date);
        label_last_recorded.text = `Last Recorded:\n${text_date}`;
        weight = evt.data.value.weight;
        label_weight.text = `${weight} kg`;
        if (evt.data.value.body_fat) {
            body_fat = evt.data.value.body_fat;
            label_fat.text = `${body_fat}% fat`;
        } else {
            body_fat = null;
            label_fat.text = `--% fat`;
        }
    }
}

function screenMain() {
    state = "MAIN"
    back_log.style.display = "none";
    back_main.style.display = "inline";
    debug(state);
}

function screenLog() {
    state = "LOG"
    back_main.style.display = "none";
    back_log.style.display = "inline";
    debug(state);
}

btn_log.addEventListener("click", () => {
    screenLog();
});
document.addEventListener("keypress", (evt) => {
    evt.preventDefault();
    debug(JSON.stringify(evt));
    if (evt.key === "back") {
        if (state === "MAIN") {
            me.exit();
        } else if (state === "LOG") {
            screenMain();
        }
    } 
});