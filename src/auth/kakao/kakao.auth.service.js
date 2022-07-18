"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
        while (_) try {
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
exports.__esModule = true;
exports.KakaoAuthService = void 0;
var common_1 = require("@nestjs/common");
var kakao_user_entity_1 = require("../../user/kakao.user.entity");
var typeorm_1 = require("@nestjs/typeorm");
var user_entity_1 = require("../../user/user.entity");
var KakaoAuthService = /** @class */ (function () {
    function KakaoAuthService(kakaoUserRepository, userRepository, myDataSource) {
        this.kakaoUserRepository = kakaoUserRepository;
        this.userRepository = userRepository;
        this.myDataSource = myDataSource;
    }
    KakaoAuthService.prototype.findKakaoUser = function (kakaoId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.kakaoUserRepository.findOne({
                            where: { kakaoId: kakaoId }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KakaoAuthService.prototype.register = function (kakaoId, accessToken, refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            var queryRunner, user, kakaoUser, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryRunner = this.myDataSource.createQueryRunner();
                        return [4 /*yield*/, queryRunner.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, queryRunner.startTransaction()];
                    case 2:
                        _a.sent();
                        user = {};
                        _a.label = 3;
                    case 3:
                        _a.trys.push([3, 7, 9, 11]);
                        return [4 /*yield*/, this.userRepository.save(user)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.kakaoUserRepository.save({
                                user: user,
                                userId: user.id,
                                accessToken: accessToken,
                                kakaoId: kakaoId,
                                refreshToken: refreshToken
                            })];
                    case 5:
                        kakaoUser = _a.sent();
                        return [4 /*yield*/, queryRunner.commitTransaction()];
                    case 6:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 7:
                        err_1 = _a.sent();
                        return [4 /*yield*/, queryRunner.rollbackTransaction()];
                    case 8:
                        _a.sent();
                        return [3 /*break*/, 11];
                    case 9: return [4 /*yield*/, queryRunner.release()];
                    case 10:
                        _a.sent();
                        return [7 /*endfinally*/];
                    case 11: return [2 /*return*/, kakaoUser];
                }
            });
        });
    };
    KakaoAuthService.prototype.updateUser = function (_user) {
        return __awaiter(this, void 0, void 0, function () {
            var targetUser, id, userId, user, accessToken, refreshToken, kakaoId, updatedUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findKakaoUser(_user.kakaoId)];
                    case 1:
                        targetUser = _a.sent();
                        id = targetUser.id, userId = targetUser.userId, user = targetUser.user;
                        accessToken = _user.accessToken, refreshToken = _user.refreshToken, kakaoId = _user.kakaoId;
                        updatedUser = {
                            id: id,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            kakaoId: kakaoId,
                            userId: userId,
                            user: user
                        };
                        return [4 /*yield*/, this.kakaoUserRepository.update(targetUser.id, updatedUser)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, updatedUser];
                }
            });
        });
    };
    KakaoAuthService.prototype.login = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var existUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.validateUser(user.kakaoId)];
                    case 1:
                        existUser = _a.sent();
                        if (!existUser) {
                            return [2 /*return*/, this.register(user.kakaoId, user.accessToken, user.refreshToken)];
                        }
                        else {
                            return [2 /*return*/, this.updateUser(user)];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    KakaoAuthService.prototype.validateUser = function (kakaoId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.findKakaoUser(kakaoId)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    KakaoAuthService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(kakao_user_entity_1.KakaoUser)),
        __param(1, typeorm_1.InjectRepository(user_entity_1.User))
    ], KakaoAuthService);
    return KakaoAuthService;
}());
exports.KakaoAuthService = KakaoAuthService;
