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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var cli_color_1 = __importDefault(require("cli-color"));
var lodash_1 = __importDefault(require("lodash"));
var defaultConfig = {
    logLevel: 'info',
    ui: { show: false },
    time: true
};
var bad = cli_color_1.default.red('Error');
var good = cli_color_1.default.green('OK');
var test = cli_color_1.default.cyan('test');
var prod = cli_color_1.default.red('prod');
exports.default = (function (config) {
    if (config === void 0) { config = {}; }
    return __awaiter(void 0, void 0, void 0, function () {
        var _config, app, doRun, handleTest;
        var _a, _b;
        return __generator(this, function (_c) {
            _config = __assign(__assign({}, defaultConfig), config);
            app = require('./' + _config.year + '/' + _config.day + '/index' + (_config.mode ? '.' + _config.mode : '')).default;
            doRun = function (run, isTest, params) { return __awaiter(void 0, void 0, void 0, function () {
                var targetFile, _params, lineReader, answer;
                var _a, _b, _c, _d, _e, _f;
                return __generator(this, function (_g) {
                    switch (_g.label) {
                        case 0:
                            targetFile = isTest ? run.id : 'input';
                            _params = __assign(__assign(__assign({}, (params !== null && params !== void 0 ? params : {})), ((_a = run.params) !== null && _a !== void 0 ? _a : {})), { isTest: isTest, logLevel: _config.logLevel, ui: _config.ui });
                            _params = __assign(__assign({}, _params), (isTest ? (_b = _params.test) !== null && _b !== void 0 ? _b : {} : (_c = _params.prod) !== null && _c !== void 0 ? _c : {}));
                            delete _params.test;
                            delete _params.prod;
                            if (fs_1.default.existsSync(_config.day + '/' + targetFile + '.txt')) {
                                lineReader = require('readline').createInterface({
                                    input: fs_1.default.createReadStream(_config.day + '/' + targetFile + '.txt')
                                });
                            }
                            if (_config.time) {
                                console.time('Answer time ' + targetFile);
                            }
                            if (_config.mode) {
                                console.log('Running ' + ((_d = _config.mode) !== null && _d !== void 0 ? _d : 'normal'));
                            }
                            return [4 /*yield*/, app(lineReader, _params)];
                        case 1:
                            answer = _g.sent();
                            if (_config.time) {
                                console.timeEnd('Answer time ' + targetFile);
                            }
                            if (((_e = _params.part1) === null || _e === void 0 ? void 0 : _e.skip) === true) {
                                console.log('Year', _config.year, 'Day', _config.day, 'Part 1', isTest ? 'test' : 'prod', '- skipped');
                            }
                            else {
                                if (run === null || run === void 0 ? void 0 : run.part1) {
                                    console.log('Year', _config.year, 'Day', _config.day, 'Part 1', isTest ? test : prod, '- got', answer.part1, run.part1.answer === answer.part1 ? good : 'Expected ' + run.part1.answer + ' ' + bad);
                                }
                            }
                            if (((_f = _params.part2) === null || _f === void 0 ? void 0 : _f.skip) === true) {
                                console.log('Year', _config.year, 'Day', _config.day, 'Part 2', isTest ? 'test' : 'prod', '- skipped');
                            }
                            else {
                                if (run === null || run === void 0 ? void 0 : run.part2) {
                                    console.log('Year', _config.year, 'Day', _config.day, 'Part 2', isTest ? test : prod, '- got', answer.part2, run.part2.answer === answer.part2 ? good : 'Expected ' + run.part2.answer + ' ' + bad);
                                }
                            }
                            return [2 /*return*/];
                    }
                });
            }); };
            handleTest = function (t, params) {
                if (t.skip !== true) {
                    doRun(t, true, params);
                }
                else {
                    console.log('Test run', t.id, 'skipped');
                }
            };
            if (lodash_1.default.get(_config, 'test')) {
                if (Array.isArray(_config.test)) {
                    _config.test.forEach(function (t) { var _a; return handleTest(t, (_a = _config.params) !== null && _a !== void 0 ? _a : {}); });
                }
                else {
                    handleTest(_config.test, (_a = _config.params) !== null && _a !== void 0 ? _a : {});
                }
            }
            if (!!lodash_1.default.get(_config, 'prod') && lodash_1.default.get(_config, 'prod.skip') !== true) {
                doRun(_config.prod, false, (_b = _config.params) !== null && _b !== void 0 ? _b : {});
            }
            else {
                console.log('Prod run skipped');
            }
            return [2 /*return*/];
        });
    });
});
