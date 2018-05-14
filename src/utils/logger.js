const {
    green,
    cyan,
    yellow,
    red,
    magenta,
    grey,
    gray,
} = require('colors/safe');

const logger = {
    data: (title, object) => {
        console.log(`\n${yellow(`[${title}]`)}`);
        console.log(JSON.stringify(object));
    },

    startBlock: (name) => {
        console.log(`\n${magenta(getNowDateTime())} | ${yellow(`--> ${name}`)}`);
    },

    endBlock: (name) => {
        console.log(`\n${magenta(getNowDateTime())} | ${yellow(`<-- ${name}`)}`);
    },

    logUrl: (url) => {
        if (url) {
            console.log(`\n\nURL: ${cyan(url)}`);
        }
    },

    error: (message, type) => {
        if (message) {
            console.log(red(`\nERROR: ${message}`));
        }
        if (type) {
            console.log(red(`\nTYPE: ${type}`));
        }
    },

    startApp: (host, port) => {
        console.log(`${green(`Rest server started on`)} ${cyan(`http://${host}:${port}`)}
        ${gray(`\n- Get person on ${cyan(`http://${host}:${port}/person-profile-ib/v1.0/mobile/personProfile/get`)}
                \n- Get person by type(-s) ${cyan(`http://${host}:${port}/person-profile-ib/v1.0/mobile/personProfile/get?type=PHONE&type=EMAIL`)}
                \n- Update person by POST with json body ${cyan(`http://${host}:${port}/person-profile-ib/v1.0/mobile/personProfile/update`)}
                \n- Get item info on ${cyan(`http://${host}:${port}/person-profile-ib/v1.0/mobile/operationHistory/getItemInfo`)}
                \n- Get item info on type ${cyan(`http://${host}:${port}/person-profile-ib/v1.0/mobile/operationHistory/getItemInfo?type=SUCCESSED`)}`
            )}
        \n
        \n--- LOG OUT ---`);
    },
}

const getNowDateTime = () => {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();
    let milliseconds = today.getMilliseconds();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (milliseconds < 10) {
        seconds = '0' + milliseconds;
    }

    return `${dd}-${mm}-${yyyy} ${hours}:${minutes}:${seconds}.${milliseconds}`
}

module.exports = logger;