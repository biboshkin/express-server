const HttpError = (message, type, code) => {
    Error.call(this, message, type, code);

    this.name = "HttpError";

    this.message = message;
    this.type = type;
    this.code = code;

    this.toString = () => JSON.stringify(this);

    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, HttpError);
    } else {
        this.stack = (new Error()).stack;
    }
    this.prototype = Object.create(Error.prototype);

    return this;

}

module.exports = HttpError;