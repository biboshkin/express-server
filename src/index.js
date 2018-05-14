/* Параметры сервера */

/* Для запроса с другого ПК нужно изменить localhost на ваш ip адрес */
const HOST = 'localhost';
const PORT = 48200;

/* ----------------- */

global.__src = __dirname + '/';
const express = require('express'),
    app = express(),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    fs = require('fs-extra');

const {
    getModifyPerson,
    getPerson,
    getItemInfo,
    getErrorResponce,
    getSuccessResponce,
    createTmpPersonFile,
    filterPerson,
    getTypesFromRequest,
    clearTerminal,
} = require('./utils/main.js');

const {
    ROOT,
    PERSON,
    PERSON_PATH,
    OPERATION_HISTORY,
} = require('./constants/index.js');

const {
    ERROR_SYSTEM_TEXT,
    ERROR_SYSTEM_TYPE,
    ERROR_BY_TYPE_NOT_FOUND_TEXT,
    ERROR_SOME_TYPE_PASSED_TEXT,
    SYSTEM_EXCEPTION_CODE,
    NOT_FOUND_CODE,
    ERROR_NOT_FOUND_TYPE,
} = require('./constants/errors.js')

const logger = require('./utils/logger.js');
const HttpError = require('./utils/HttpError.js');

app.use(
    bodyParser.json({
        limit: '50mb',
        strict: false
    }),
    session({
        secret: 'ecspecto patronum',
        cookie: {},
        resave: true,
        saveUninitialized: false
    })
);


// GET person
app.get(`${ROOT}/${PERSON}/get`, (req, res) => {
    const blockName = 'get person'
    const { url } = req;

    logger.logUrl(req.url);
    logger.startBlock(blockName);

    let types = getTypesFromRequest(req);
    let person = getPerson(req);
    if (types) {
        person = filterPerson(person, types)
    }

    logger.data('Person', person);
    res.status(200).json(person);

    logger.endBlock(blockName);
});


// GET itemInfo
app.get(`${ROOT}/${OPERATION_HISTORY}/getItemInfo`, (req, res) => {
    const blockName = 'get item info'
    const { query: { type }, url } = req;

    logger.logUrl(url);
    logger.startBlock(blockName);

    try {
        if (Array.isArray(type)) {
            throw HttpError(ERROR_SOME_TYPE_PASSED_TEXT, ERROR_SYSTEM_TYPE, SYSTEM_EXCEPTION_CODE);
        }

        const itemInfo = getItemInfo(type);
        if (!itemInfo && type) {
            throw HttpError(ERROR_BY_TYPE_NOT_FOUND_TEXT, ERROR_NOT_FOUND_TYPE, NOT_FOUND_CODE);
        }

        logger.data('Item info', itemInfo);
        res.status(200).json(itemInfo);
    } catch ({ message, type, code }) {
        logger.error(message, type);
        const errorResponce = getErrorResponce(message, type);
        res.status(code).json(errorResponce);
    } finally {
        logger.endBlock(blockName);
    }
})


// POST update person
app.post(`${ROOT}/${PERSON}/update`, (req, res) => {
    const blockName = 'update person'
    const { body, session, url } = req;

    logger.logUrl(url);
    logger.startBlock(blockName);
    logger.data('Request', body);

    const reqBody = JSON.parse(JSON.stringify(body));
    const person = getPerson(req);
    try {
        const modifyPerson = getModifyPerson(person.body, reqBody);

        if (modifyPerson) {
            logger.data('Modified Person', modifyPerson);
            session.person = getSuccessResponce(modifyPerson);
        }

        res.status(200).json(getSuccessResponce());
    } catch ({ message, type, code }) {
        logger.error(message, type);
        res.status(code).json(getErrorResponce(message, type));
    } finally {
        logger.endBlock(blockName);
    }
});


// Общий ответ
app.all('*', (req, res) =>
    res.send(`Server is running. Don't worry :)`));

// Старт сервера
app.listen(PORT, HOST, () => {
    clearTerminal();
    logger.startApp(HOST, PORT);
});
