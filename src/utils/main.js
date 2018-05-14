const uuidv4 = require('uuid/v4');
const fs = require('fs-extra');

const {
    ROOT,
    PERSON_PATH,
    OPERATION_TYPES,
    DEFAULT_OPERATION_TYPE,
    ITEM_INFO_PATH,
    ENCODING,
    DOMAINS,
    DEFAULT_STATUS,
} = require('../constants/index.js');

const {
    ERROR_DUPLICATE_TEXT,
    ERROR_DUPLICATE_TYPE,
    SYSTEM_EXCEPTION_CODE,
    ERROR_SYSTEM_TEXT,
    ERROR_NON_VALID_TYPE,
    ERROR_IS_NOT_VALID_TEXT,
} = require('../constants/errors.js')

const HttpError = require('./HttpError.js')

const _ = require('lodash');

const getItemInfo = (type) => {
    const itemInfo = getObjectFromFile(ITEM_INFO_PATH);

    if (type) {
        const findedItem = itemInfo[type.toLowerCase()];
        if (!findedItem) {
            return null;
        }
        return findedItem;
    }

    return itemInfo[DEFAULT_OPERATION_TYPE.toLowerCase()];
}

const getPerson = (request) => {
    let { session: { person } } = request;
    if (!person) {
        person = getObjectFromFile(PERSON_PATH);
    }
    return person;
}

const filterPerson = (person, searchedTypes) => {
    if (searchedTypes.length > 0) {
        let filteredPerson = Object.assign({}, person);
        let { body: { domains } } = filteredPerson;
        if (domains) {
            const filteredDomains = domains
                .filter(domain => searchedTypes.some(type => domain.domainName === type))

            filteredPerson.body.domains = filteredDomains;
        }

        return filteredPerson;
    }

    return person;
}

const getTypesFromRequest = (request) => {
    let result;
    const { query, query: { type: types } } = request;
    if (Array.isArray(types)) {
        result = types;
    } else {
        if (query && types) {
            result = [types];
        }
    }

    return result;
}

const getModifyPerson = (person, request) => {
    let modifyPerson = Object.assign({}, person);
    let addingOperations = [];
    let deletingOperations = [];

    const { domains: domainsForUpdate } = request;
    domainsForUpdate.forEach(item => {
        const {
            domain: name,
            userOperations
        } = item;

        let { adding, deleting } = getSortedOperations(userOperations, name);
        if (name === DOMAINS.PHONE) {
            if (isPhoneDuplicated(adding, modifyPerson)) {
                throw HttpError(ERROR_DUPLICATE_TEXT, ERROR_DUPLICATE_TYPE, SYSTEM_EXCEPTION_CODE);
            }

            if (!isPhonesValid(adding)) {
                throw HttpError(ERROR_IS_NOT_VALID_TEXT, ERROR_NON_VALID_TYPE, SYSTEM_EXCEPTION_CODE);
            }

            adding = modifyAddingPhoneNumberFormat(adding);
        }

        addingOperations = addingOperations.concat(adding);
        deletingOperations = deletingOperations.concat(deleting);
    });

    const { domains: personDomains } = modifyPerson;
    const modifyDomains = personDomains.map(domain => {
        let { domainName: name } = domain;

        const newItems = getNewItemsForAdding(addingOperations, name);
        domain.items = domain.items.concat(newItems);

        const deletedIds = getDeletedIdsByName(deletingOperations, name);
        domain.items = filterDomainItemsByIds(domain.items, deletedIds);

        return domain;
    })

    modifyPerson.domains = modifyDomains;
    return modifyPerson;
}

const isPhoneDuplicated = (addindPhones, person) => {
    const addingNumbers = addindPhones
        .map(item => getNumberFromDomainProps(item.properties));

    const phoneDomainProperties = _.chain(person.domains)
        .findLast(o => o.domainName === DOMAINS.PHONE)
        .value();

    const personNumbers = phoneDomainProperties.items
        .map(item => getNumberFromDomainProps(item.properties));

    return _.intersection(personNumbers, addingNumbers).length > 0;
}

const isPhonesValid = (addindPhones) => {
    const addingNumbers = addindPhones
        .map(item => getNumberFromDomainProps(item.properties));

    const regPhone = /^([+]?[0-9\s-\(\)]{3,25})*$/i;
    return _.every(addingNumbers, n => regPhone.test(n));
}

const convertPhoneNumber = (number) => {
    let result;
    const clearNumber = number
        .match(/([0-9])+/g)
        .join('');
    if (number.substr(0, 1) === '+') {
        result = "+" + clearNumber;
    } else if (str.substr(0, 1) === '8') {
        result = "+7" + clearNumber.substr(1);
    } else {
        result = cleatNumber;
    }
    return result;
}

const modifyAddingPhoneNumberFormat = (adding) =>
    adding.map(o => {
        if (o.name === DOMAINS.PHONE) {
            o.properties.map(item => {
                if (item.key === "number") {
                    item.value = convertPhoneNumber(item.value);
                }
                return item;
            })
        }
        return o;
    })

const getNumberFromDomainProps = (props) =>
    convertPhoneNumber(
        _.chain(props)
            .keyBy('key')
            .mapValues('value')
            .value()
            .number
    )


const getErrorResponce = (message, type) => ({
    "success": false,
    "error": {
        "uuid": uuidv4(),
        "system": type || ERROR_SYSTEM_TYPE,
        "text": message || ERROR_SYSTEM_TEXT
    }
})

const getSuccessResponce = (body) => {
    const responce = {
        success: true
    }

    if (body) {
        responce.body = body;
    }

    return responce;
}

const clearTerminal = () => {
    process.stdout.write('\033c');
    process.stdout.write('\x1B[2J');
    process.stdout.write('\x1Bc');
    console.log('\x1Bc');
}

const getObjectFromFile = (path) => JSON.parse(fs.readFileSync(path, ENCODING))

const getDeletedIdsByName = (domains, name) => domains
    .filter(domain => domain.name === name)
    .map(domain => domain.domainItemId)

const filterDomainItemsByIds = (items, ids) =>
    items.filter(item => !ids.some(id => item.id === id));

const getNewItemsForAdding = (domains, name) => domains
    .filter(domain => domain.name === name)
    .map(domain => {
        let { properties } = domain;

        if (!isPropsHasKey(properties, 'lastUpd')) {
            properties.push({
                'key': 'lastUpd',
                'value': new Date().getTime()
            })
        }
        if (!isPropsHasKey(properties, 'status')) {
            properties.push({
                'key': 'status',
                'value': DEFAULT_STATUS
            })
        }
        return {
            id: uuidv4(),
            properties
        }
    })

const isPropsHasKey = (properties, keyName) => properties.some(prop => prop.key === keyName);

const getSortedOperations = (operations, name) => {
    const adding = [];
    const deleting = [];

    operations.forEach(operation => {
        const { operationType: type, properties, domainItemId } = operation;
        const { ADD, DELETE } = OPERATION_TYPES;
        switch (type) {
            case ADD:
                adding.push({
                    name,
                    properties
                });
                break;
            case DELETE:
                deleting.push({
                    name,
                    domainItemId: operation.domainItemId,
                });
                break;
            default:
                console.warn(`Тип операции ${type} не поддерживается`);
        }
    });

    return { adding, deleting };
}

module.exports = {
    getModifyPerson,
    getPerson,
    getItemInfo,
    getErrorResponce,
    getSuccessResponce,
    filterPerson,
    getTypesFromRequest,
    clearTerminal,
};