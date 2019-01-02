import document from "document";
import { preferences } from "user-settings";
import * as messaging from "messaging";
import { debug, error } from "../common/log.js";
import { getMonthName } from "../common/utils.js";
import { me } from "appbit";
import {sendVal} from "./communication"

const back_main = document.getElementById("back_main");
const label_last_recorded = document.getElementById("label_last_recorded");
const label_weight = document.getElementById("label_weight");
const label_fat = document.getElementById("label_fat");
const btn_log = document.getElementById("btn_log");

const back_log = document.getElementById("back_log");
const btn_new_weight = document.getElementById("btn_new_weight");
const btn_new_fat = document.getElementById("btn_new_fat");
const btn_save = document.getElementById("btn_save");

const back_weight = document.getElementById("back_weight");
const tumbler_kg_1 = document.getElementById("tumbler_kg_1");
const tumbler_kg_2 = document.getElementById("tumbler_kg_2");
const btn_weight_submit = document.getElementById("btn_weight_submit");

const back_fat = document.getElementById("back_fat");
const tumbler_fat_1 = document.getElementById("tumbler_fat_1");
const tumbler_fat_2 = document.getElementById("tumbler_fat_2");
const btn_fat_submit = document.getElementById("btn_fat_submit");
const btn_fat_clear = document.getElementById("btn_fat_clear");

let weight, body_fat;
let state = "MAIN";
let new_weight, new_body_fat;

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
    back_weight.style.display = "none";
    back_fat.style.display = "none";
    back_main.style.display = "inline";
    debug(state);
}

function screenLog(reset) {
    state = "LOG"

    if (reset) {
        new_weight = weight;
        new_body_fat = body_fat;
    }

    if (new_weight) {
        btn_new_weight.text = `${new_weight} kg`;
    } else {
        btn_new_weight.text = `-- kg`;
    }

    if (new_body_fat) {
        btn_new_fat.text = `${new_body_fat}% fat`;
    } else {
        btn_new_fat.text = `--% fat`;
    }

    back_main.style.display = "none";
    back_weight.style.display = "none";
    back_fat.style.display = "none";
    back_log.style.display = "inline";
    debug(state);
}

function screenWeight() {
    state = "LOG_WEIGHT";
    let new_weight_1, new_weight_2;
    if (new_weight) {
        new_weight_1 = Math.floor(new_weight) - 40;
        new_weight_2 = Math.round((new_weight % 1) * 10);
        if (new_weight_2 === 10) {
            new_weight_1 += 1;
            new_weight_2 = 0;
        }
        if (new_weight_1 > 259) {
            new_weight_1 = 259;
        }
    } else {
        new_weight_1 = 60;
        new_weight_2 = 0;
    }
    tumbler_kg_1.value = new_weight_1;
    tumbler_kg_2.value = new_weight_2;
    back_main.style.display = "none";
    back_log.style.display = "none";
    back_fat.style.display = "none";
    back_weight.style.display = "inline";
    debug(state);
}

function screenFat() {
    state = "LOG_FAT";
    let new_body_fat_1, new_body_fat_2;
    if (new_body_fat) {
        new_body_fat_1 = Math.floor(new_body_fat);
        new_body_fat_2 = Math.round((new_body_fat % 1) * 10);
        if (new_body_fat_2 === 10) {
            new_body_fat_1 += 1;
            new_body_fat_2 = 0;
        }
        if (new_body_fat_1 > 40) {
            new_body_fat_1 = 40;
        }
    } else {
        new_body_fat_1 = 16;
        new_body_fat_2 = 0;
    }
    tumbler_fat_1.value = new_body_fat_1;
    tumbler_fat_2.value = new_body_fat_2;
    back_main.style.display = "none";
    back_log.style.display = "none";
    back_weight.style.display = "none";
    back_fat.style.display = "inline";
    debug(state);
}

function setNewWeight() {
    new_weight = tumbler_kg_1.value + 40 + tumbler_kg_2.value * 0.1;
    screenLog(false);
};
function setNewFat() {
    new_body_fat = tumbler_fat_1.value + tumbler_fat_2.value * 0.1;
    screenLog(false);
};
function setClearFat() {
    new_body_fat = null;
    screenLog(false);
};
btn_log.addEventListener("click", () => {
    screenLog(true);
});
btn_save.addEventListener("click", () => {
    sendVal({
        key: "WEIGHT_LOGGED_TODAY",
        value: {
            "weight": new_weight,
            "body_fat": new_body_fat
        }
    });
});
btn_new_weight.addEventListener("click", () => {
    screenWeight();
});
btn_new_fat.addEventListener("click", () => {
    screenFat();
});
btn_weight_submit.addEventListener("click", () => {
    setNewWeight();
});
btn_fat_submit.addEventListener("click", () => {
    setNewFat();
});
btn_fat_clear.addEventListener("click", () => {
    setClearFat();
});
document.addEventListener("keypress", (evt) => {
    evt.preventDefault();
    debug(JSON.stringify(evt));
    if (evt.key === "back") {
        if (state === "MAIN") {
            me.exit();
        } else if (state === "LOG") {
            screenMain();
        } else if (state === "LOG_WEIGHT") {
            setNewWeight();
        } else if (state === "LOG_FAT") {
            setNewFat();
        }
    } else if (evt.key === "down") {
        if (state === "LOG_WEIGHT") {
            setNewWeight();
        } else if (state === "LOG_FAT") {
            setNewFat();
        }
    } else if (evt.key === "up") {
        if (state === "LOG_FAT") {
            setClearFat();
        }
    }
});