"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AuthModule = void 0;
var common_1 = require("@nestjs/common");
var auth_controller_1 = require("./auth.controller");
var auth_service_1 = require("./auth.service");
var user_module_1 = require("../user/user.module");
var passport_1 = require("@nestjs/passport");
var kakao_auth_service_1 = require("./kakao/kakao.auth.service");
var kakao_strategy_1 = require("./strategy/kakao.strategy");
var kakao_auth_controller_1 = require("./kakao/kakao.auth.controller");
var AuthModule = /** @class */ (function () {
    function AuthModule() {
    }
    AuthModule = __decorate([
        common_1.Module({
            imports: [user_module_1.UserModule, passport_1.PassportModule],
            controllers: [auth_controller_1.AuthController, kakao_auth_controller_1.KakaoAuthController],
            providers: [auth_service_1.AuthService, kakao_auth_service_1.KakaoAuthService, kakao_strategy_1.KakaoStrategy]
        })
    ], AuthModule);
    return AuthModule;
}());
exports.AuthModule = AuthModule;
