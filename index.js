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
var Responserror = /** @class */ (function () {
    function Responserror(options) {
        if (options === void 0) { options = { promptErrors: false }; }
        var _this = this;
        this.preFunctions = [];
        this.posFunctions = [];
        this.pre = function (fn) { return _this.preFunctions.push(fn); };
        this.pos = function (fn) { return _this.posFunctions.push(fn); };
        this.mapStatusByCode = {};
        this.responserror = {
            code: 500,
            status: 'INTERNAL_SERVER_ERROR',
            message: 'Internal Server Error',
            success: false,
            errors: undefined
        };
        this.setMapStatusByCode = function () {
            var _a;
            for (var _i = 0, _b = Object.entries(http_status_codes_1.default); _i < _b.length; _i++) {
                var _c = _b[_i], httpStatus = _c[0], httpCode = _c[1];
                if (!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1', '2'].includes(String(httpCode).charAt(0))) {
                    Object.assign(_this.mapStatusByCode, (_a = {}, _a[httpCode] = httpStatus, _a));
                }
            }
        };
        this.setDefaultValuesForResponserror = function () {
            // @ts-ignore
            if (!['code', 'status', 'message'].some(function (prop) { return _this.responserror[prop]; })) {
                _this.responserror.code = 500;
                _this.responserror.status = 'INTERNAL_SERVER_ERROR';
                _this.responserror.message = 'Internal Server Error';
            }
            if (!_this.responserror.success)
                _this.responserror.success = false;
            if (!_this.responserror.errors)
                _this.responserror.errors = undefined;
        };
        this.getMessageByCode = function (code) {
            try {
                return http_status_codes_1.default.getStatusText(code);
            }
            catch (e) {
                return undefined;
            }
        };
        this.getStatusByCode = function (code) { return _this.mapStatusByCode[code]; };
        this.getCodeByStatus = function (status) {
            for (var _i = 0, _a = Object.entries(http_status_codes_1.default); _i < _a.length; _i++) {
                var _b = _a[_i], httpStatus = _b[0], httpCode = _b[1];
                if (!httpStatus.startsWith('get') && typeof httpCode !== 'function' && !['1', '2'].includes(String(httpCode).charAt(0))) {
                    if (String(httpStatus).trim().toUpperCase() == String(status).trim().toUpperCase()) {
                        return httpCode;
                    }
                }
            }
        };
        this.errorHandler = function (error, request, response, next) {
            var _a, _b;
            _this.preFunctions.forEach(function (fn) { return fn.apply(null); });
            if (error.status) {
                _this.responserror.status = error.status;
                var code = _this.getCodeByStatus(error.status);
                if (code)
                    _this.responserror.code = code;
            }
            if (error.code) {
                _this.responserror.code = error.code;
                var status_1 = _this.getStatusByCode(error.code);
                if (status_1)
                    _this.responserror.status = status_1;
            }
            _this.responserror.message = (_a = error.message) !== null && _a !== void 0 ? _a : _this.getMessageByCode(_this.responserror.code);
            _this.responserror.errors = (_b = error.errors) !== null && _b !== void 0 ? _b : error.content;
            var responserLikeStatus = camelCase(_this.responserror.status);
            _this.setDefaultValuesForResponserror();
            var responserrorObject = __assign(__assign({}, _this.responserror), error);
            if (_this.options.promptErrors === true || (typeof _this.options.promptErrors === 'function' && _this.options.promptErrors())) {
                // To be implemented
                console.warn('[Responserror]', responserrorObject);
            }
            _this.posFunctions.forEach(function (fn) { return fn.apply(null); });
            delete error.code;
            delete error.status;
            delete error.message;
            delete error.success;
            delete error.errors;
            // @ts-ignore
            if (typeof response["send_".concat(responserLikeStatus)] === 'function') {
                // @ts-ignore
                return response["send_".concat(responserLikeStatus)](_this.responserror.message, error);
            }
            return response.status(_this.responserror.code).json(responserrorObject);
        };
        this.options = options;
        this.setMapStatusByCode();
    }
    return Responserror;
}());
exports.default = Responserror;
