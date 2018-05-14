const ERROR_DUPLICATE_TEXT = 'Ошибка при обновлении данных пользователя';
const ERROR_SYSTEM_TEXT = 'Произошла системная ошибка';
const ERROR_SOME_TYPE_PASSED_TEXT = `Передано несколько 'type' параметров.`;
const ERROR_BY_TYPE_NOT_FOUND_TEXT = `По переданному типу объектов не найдено.`;
const ERROR_IS_NOT_VALID_TEXT = `Формат телефона неверный`;

const ERROR_SYSTEM_TYPE = "SYSTEM_EXCEPTION";
const ERROR_DUPLICATE_TYPE = "DUPLICATE_PHONE_EXCEPTION";
const ERROR_NON_VALID_TYPE = "PHONE_NUMBER_NOT_VALID";
const ERROR_NOT_FOUND_TYPE = "NOT_FOUND";

const SYSTEM_EXCEPTION_CODE = 500;
const NOT_FOUND_CODE = 404;

module.exports = {
    ERROR_DUPLICATE_TEXT,
    ERROR_DUPLICATE_TYPE,
    ERROR_SYSTEM_TEXT,
    ERROR_SYSTEM_TYPE,
    SYSTEM_EXCEPTION_CODE,
    NOT_FOUND_CODE,
    ERROR_SOME_TYPE_PASSED_TEXT,
    ERROR_BY_TYPE_NOT_FOUND_TEXT,
    ERROR_NOT_FOUND_TYPE,
    ERROR_IS_NOT_VALID_TEXT,
    ERROR_NON_VALID_TYPE,
}