import document from "document";
import * as messaging from "messaging";
import { debug, error } from "../common/log.js";
import { getMonthName } from "../common/utils.js";
import { me } from "appbit";

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
const tumbler_items_kg = document.getElementsByClassName("tumbler_item_kg_1");
const tumbler_kg_1 = document.getElementById("tumbler_kg_1");
const tumbler_kg_2 = document.getElementById("tumbler_kg_2");
const tumbler_label_kg_2 = document.getElementById("tumbler_label_kg_2");
const btn_weight_submit = document.getElementById("btn_weight_submit");

const back_fat = document.getElementById("back_fat");
const tumbler_fat_1 = document.getElementById("tumbler_fat_1");
const tumbler_fat_2 = document.getElementById("tumbler_fat_2");
const btn_fat_submit = document.getElementById("btn_fat_submit");
const btn_fat_clear = document.getElementById("btn_fat_clear");

const back_loader = document.getElementById("back_loader");
const loader_spinner = document.getElementById("loader_spinner");
const loader_text = document.getElementById("loader_text");

const back_error = document.getElementById("back_error");
const btn_error = document.getElementById("btn_error");

let weight, body_fat;
let state = "";
let new_weight, new_body_fat, new_weight_lower_bound;

let unit, unit_text = "";

function sendVal(data) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        try {
            messaging.peerSocket.send(data);
            debug(`Sent to companion: ${JSON.stringify(data)}`);
        } catch (err) {
            screenError("Connection Failed", "Please check the connection to your phone.");
        }
    } else {
        screenError("Connection Failed", "Please check the connection to your phone.");
    }
};
function screenLoader() {
    state = "LOADER";

    loader_text.text = "Getting Weight Data"
    loader_spinner.state = "enabled";

    back_loader.style.display = "inline";
    back_log.style.display = "none";
    back_weight.style.display = "none";
    back_fat.style.display = "none";
    back_main.style.display = "none";
    debug(state);
}
function screenSubmit() {
    state = "SUBMIT";

    loader_text.text = "Sending Weight Data"
    loader_spinner.state = "enabled";

    back_loader.style.display = "inline";
    back_log.style.display = "none";
    back_weight.style.display = "none";
    back_fat.style.display = "none";
    back_main.style.display = "none";
    debug(state);
}
function screenError(title, message) {
    state = "ERROR";

    loader_spinner.state = "disabled";

    document.getElementById("header").text = title;
    document.getElementById("copy").text = message;

    back_error.style.display = "inline";
    back_loader.style.display = "none";
    back_log.style.display = "none";
    back_weight.style.display = "none";
    back_fat.style.display = "none";
    back_main.style.display = "none";
    debug(state);
}
function screenMain() {
    state = "MAIN";

    loader_spinner.state = "disabled";

    back_loader.style.display = "none";
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
        if (new_weight == null) {
            new_weight = (unit === "us" ? 150 : 70 );
        }
        new_body_fat = body_fat;
    }

    btn_new_weight.text = `${new_weight.toFixed(1)} ${unit_text}`;
    
    if (new_body_fat != null) {
        btn_new_fat.text = `${new_body_fat.toFixed(1)}% fat`;
    } else {
        btn_new_fat.text = `--% fat`;
    }

    back_loader.style.display = "none";
    back_main.style.display = "none";
    back_weight.style.display = "none";
    back_fat.style.display = "none";
    back_log.style.display = "inline";
    debug(state);
}

function screenWeight() {
    state = "LOG_WEIGHT";

    new_weight_lower_bound = Math.floor(new_weight) - 30;
    if (new_weight_lower_bound < 0) {
        new_weight_lower_bound = 0;
    }

    for (let i = 0; i < tumbler_items_kg.length; i++) {
        tumbler_items_kg[i].text = new_weight_lower_bound + i;
    }

    let new_weight_1, new_weight_2;
    new_weight_1 = Math.floor(new_weight) - new_weight_lower_bound;
    new_weight_2 = Math.round((new_weight % 1) * 10);
    if (new_weight_2 === 10) {
        new_weight_1 += 1;
        new_weight_2 = 0;
    }
    if (new_weight_1 > 59) {
        new_weight_1 = 59;
    }
    tumbler_kg_1.value = new_weight_1;
    tumbler_kg_2.value = new_weight_2;

    back_loader.style.display = "none";
    back_main.style.display = "none";
    back_log.style.display = "none";
    back_fat.style.display = "none";
    back_weight.style.display = "inline";
    debug(state);
}

function screenFat() {
    state = "LOG_FAT";
    let new_body_fat_1, new_body_fat_2;
    if (new_body_fat != null) {
        new_body_fat_1 = Math.floor(new_body_fat) - 5;
        new_body_fat_2 = Math.round((new_body_fat % 1) * 10);
        if (new_body_fat_2 === 10) {
            new_body_fat_1 += 1;
            new_body_fat_2 = 0;
        }
        if (new_body_fat_1 > 46) {
            new_body_fat_1 = 45;
        }
    } else {
        new_body_fat_1 = 11;
        new_body_fat_2 = 0;
    }
    tumbler_fat_1.value = new_body_fat_1;
    tumbler_fat_2.value = new_body_fat_2;

    back_loader.style.display = "none";
    back_main.style.display = "none";
    back_log.style.display = "none";
    back_weight.style.display = "none";
    back_fat.style.display = "inline";
    debug(state);
}

function setNewWeight() {
    new_weight = tumbler_kg_1.value + new_weight_lower_bound + tumbler_kg_2.value / 10;
    screenLog(false);
};
function setNewFat() {
    new_body_fat = tumbler_fat_1.value + 5 + tumbler_fat_2.value / 10;
    screenLog(false);
};
function setClearFat() {
    new_body_fat = null;
    screenLog(false);
};
function submitLog() {
    sendVal({
        key: "WEIGHT_LOGGED_TODAY",
        value: {
            "weight": +new_weight.toFixed(1),
            "body_fat": (new_body_fat ? +new_body_fat.toFixed(1) : null),
            "unit": unit
        }
    });
    screenSubmit();
}
btn_log.onclick = function(e) {
    screenLog(true);
};
btn_save.onclick = function(e) {
    submitLog()
};
btn_new_weight.onclick = function(e) {
    screenWeight();
};
btn_new_fat.onclick = function(e) {
    screenFat();
};
btn_weight_submit.onclick = function(e) {
    setNewWeight();
};
btn_fat_submit.onclick = function(e) {
    setNewFat();
};
btn_fat_clear.onclick = function(e) {
    setClearFat();
};
btn_error.onclick = function(e) {
    me.exit();
};
document.onkeypress = function(e) {
    e.preventDefault();
    if (e.key === "back") {
        if (state === "MAIN" || state === "LOADER" || state === "SUBMIT" || state === "ERROR") {
            me.exit();
        } else if (state === "LOG") {
            screenMain();
        } else if (state === "LOG_WEIGHT") {
            setNewWeight();
        } else if (state === "LOG_FAT") {
            setNewFat();
        }
    } else if (e.key === "down") {
        if (state === "LOG_WEIGHT") {
            btn_weight_submit.animate("mouseup");
            setNewWeight();
        } else if (state === "LOG_FAT") {
            btn_fat_submit.animate("mouseup");
            setNewFat();
        } else if (state === "LOG") {
            btn_save.animate("mouseup");
            submitLog()
        }
    } else if (e.key === "up") {
        if (state === "LOG_FAT") {
            btn_fat_clear.animate("mouseup");
            setClearFat();
        }
    }
};
document.onkeydown = function(e) {
    e.preventDefault();
    if (e.key === "down") {
        if (state === "LOG_WEIGHT") {
            btn_weight_submit.animate("mousedown");
        } else if (state === "LOG_FAT") {
            btn_fat_submit.animate("mousedown");
        } else if (state === "LOG") {
            btn_save.animate("mousedown");
        }
    } else if (e.key === "up") {
        if (state === "LOG_FAT") {
            btn_fat_clear.animate("mousedown");
        }
    }
}
function receiveValues(data) {
    if (data.value.date) {
        let date = new Date(data.value.date);
        let text_date = date.getDate() + " " + getMonthName(date.getMonth()) + " " + date.getFullYear();

        label_last_recorded.text = `Last Recorded:\n${text_date}`;
        weight = data.value.weight;
        body_fat = data.value.body_fat;
        
        updateUnit(data.value.unit);
    } else {
        label_last_recorded.text = `No Recent\nEntries Found`;
        weight = null;
        body_fat = null;
    }
    updateUnit(data.value.unit);
    updateMainText();
}
function updateMainText() {
    if (weight != null) {
        label_weight.text = `${weight.toFixed(1)} ${unit_text}`;
    } else {
        label_weight.text = `-- ${unit_text}`;
    }
    if (body_fat != null) {
        label_fat.text = `${body_fat.toFixed(1)}% fat`;
    } else {
        label_fat.text = `--% fat`;
    }
}
messaging.peerSocket.onmessage = evt => {
    debug(`App received: ${JSON.stringify(evt)}`);
    if (evt.data.key === "LATEST_ENTRY" && state === "LOADER") {
        receiveValues(evt.data);
        screenMain();
    } else if (evt.data.key === "LOG_RESPONSE" && state === "SUBMIT") {
        receiveValues(evt.data);
        screenMain();
    } else if (evt.data.key === "ERROR") {
        screenError(evt.data.value.header, evt.data.value.text);
    }
}
messaging.peerSocket.onerror = function(e) {
    screenError("Connection Failed", "Please check the connection to your phone.");
}
function updateUnit(new_unit) {
    unit = new_unit;
    unit_text = (unit === "us" ? "lbs" : "kg" );
    tumbler_label_kg_2.text = unit_text;
}


screenLoader();