"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_status_codes_1 = __importDefault(require("http-status-codes"));
var camelCase = function (str) { return str.toLowerCase().replace(/(\_\w)/g, function (c) { return c[1].toUpperCase(); }); };
var errorHandler = function (error, request, response, next) {
    var _a;
    var _b, _c;
    /* default */
    var responseObject = {
        code: 500,
        status: 'INTERNAL_SERVER_ERROR',
        message: 'Internal Server Error',
        success: false,
        errors: undefined
    };
    // if(error == {}) return response.send(responseObject.code).json(responseObject)
    var mapObjectMethods = {};
    for (var _i = 0, _d = Object.entries(http_status_codes_1.default); _i < _d.length; _i++) {
        var _e = _d[_i], httpStatus = _e[0], httpCode = _e[1];
        if (!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1', '2'].includes(String(httpCode).charAt(0))) {
            Object.assign(mapObjectMethods, (_a = {}, _a[httpCode] = camelCase(httpStatus), _a));
        }
    }
    var automaticMethod = (function (error) {
        if (!error)
            return null;
        /* Code was given */
        if (error.code && Object.keys(mapObjectMethods).includes(String(error.code))) {
            for (var _i = 0, _a = Object.entries(http_status_codes_1.default); _i < _a.length; _i++) {
                var _b = _a[_i], httpStatus = _b[0], httpCode = _b[1];
                if (!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1', '2'].includes(String(httpCode).charAt(0))) {
                    if (httpCode == error.code) {
                        return {
                            code: httpCode,
                            status: httpStatus
                        };
                    }
                }
            }
        }
        /* Status was given */
        if (error.status) {
            for (var _c = 0, _d = Object.entries(http_status_codes_1.default); _c < _d.length; _c++) {
                var _e = _d[_c], httpStatus = _e[0], httpCode = _e[1];
                if (!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1', '2'].includes(String(httpCode).charAt(0))) {
                    if (String(httpStatus).trim().toUpperCase() == String(error.status).trim().toUpperCase()) {
                        return {
                            code: httpCode,
                            status: httpStatus
                        };
                    }
                }
            }
        }
        return null;
    })(error);
    var getStatusText = function (code) {
        try {
            return http_status_codes_1.default.getStatusText(code);
        }
        catch (e) {
            return undefined;
        }
    };
    var statusText = automaticMethod ? getStatusText(automaticMethod.code) : null;
    /* inferred */
    if (automaticMethod) {
        responseObject.code = automaticMethod === null || automaticMethod === void 0 ? void 0 : automaticMethod.code,
            responseObject.status = automaticMethod === null || automaticMethod === void 0 ? void 0 : automaticMethod.status;
    }
    if (statusText)
        responseObject.message = statusText;
    // @ts-ignore
    if ((automaticMethod === null || automaticMethod === void 0 ? void 0 : automaticMethod.status) && typeof response["send_".concat(automaticMethod.status)] === 'function') {
        // @ts-ignore
        console.log('REALLYYYYY!!!', response["send_".concat(automaticMethod)]((_b = error === null || error === void 0 ? void 0 : error.message) !== null && _b !== void 0 ? _b : statusText, error === null || error === void 0 ? void 0 : error.content));
        // @ts-ignore
        return response["send_".concat(automaticMethod)]((_c = error === null || error === void 0 ? void 0 : error.message) !== null && _c !== void 0 ? _c : statusText, error === null || error === void 0 ? void 0 : error.content);
    }
    return response.status(responseObject.code).json(__assign(__assign({}, responseObject), error));
};
exports.default = errorHandler;
