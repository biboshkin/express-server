const ROOT = `/person-profile-ib/v1.0/mobile`;

const PERSON = `personProfile`;

const ENCODING = 'utf-8';

const OPERATION_HISTORY = `operationHistory`;

const JSONS_CONTENT_PATH = `${__src}/jsons`;

const PERSON_PATH = `${JSONS_CONTENT_PATH}/person.json`;

const ITEM_INFO_PATH = `${JSONS_CONTENT_PATH}/itemInfo.json`;

const OPERATION_TYPES = {
    ADD: "ADD",
    DELETE: "DELETE",
};

DEFAULT_OPERATION_TYPE = 'ADD';
DEFAULT_STATUS = 3;

const DOMAINS = {
    PHONE: "PHONE",
};


module.exports = {
    ROOT,
    PERSON_PATH,
    OPERATION_TYPES,
    DEFAULT_OPERATION_TYPE,
    ITEM_INFO_PATH,
    PERSON,
    OPERATION_HISTORY,
    ENCODING,
    DOMAINS,
    DEFAULT_STATUS,
}