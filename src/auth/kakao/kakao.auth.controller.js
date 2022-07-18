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
exports.__esModule = true;
exports.KakaoAuthController = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var KakaoAuthController = /** @class */ (function () {
    function KakaoAuthController(kakaoAuthService, configService) {
        this.kakaoAuthService = kakaoAuthService;
        this.configService = configService;
    }
    KakaoAuthController.prototype.getKakaoLoginPage = function () {
        return "\n      <div>\n        <h1>\uCE74\uCE74\uC624 \uB85C\uADF8\uC778</h1>\n\n        <form action=\"/auth/kakao/login\" method=\"GET\">\n          <input type=\"submit\" value=\"\uCE74\uCE74\uC624 \uB85C\uADF8\uC778\" />\n        </form>\n        \n         <form action=\"/auth/kakao/logout\" method=\"GET\">\n          <input type=\"submit\" value=\"\uCE74\uCE74\uC624 \uB85C\uADF8\uC544\uC6C3(\uC77C\uBC18)\" />\n        </form>\n\n        <form action=\"/auth/kakao/unlink\" method=\"GET\">\n          <input type=\"submit\" value=\"\uCE74\uCE74\uC624 \uB85C\uADF8\uC544\uC6C3(unlink)\" />\n        </form>\n    ";
    };
    KakaoAuthController.prototype.kakaoLoginLogic = function (res) {
        // kakaoGuard 가 처리해줌
    };
    KakaoAuthController.prototype.kakaoLoginLogicRedirect = function (req, res) {
        this.kakaoAuthService.login(req.user);
        return res.send("\n          <div>\n            <h2>\uCD95\uD558\uD569\uB2C8\uB2E4!</h2>\n            <p>\uCE74\uCE74\uC624 \uB85C\uADF8\uC778 \uC131\uACF5\uD558\uC600\uC2B5\uB2C8\uB2E4!</p>\n            <a href=\"/auth/kakao/menu\">\uBA54\uC778\uC73C\uB85C</a>\n          </div>\n        ");
    };
    __decorate([
        common_1.Get('menu'),
        common_1.Header('Content-Type', 'text/html')
    ], KakaoAuthController.prototype, "getKakaoLoginPage");
    __decorate([
        common_1.Get('/login'),
        common_1.Header('Content-Type', 'text/html'),
        common_1.UseGuards(passport_1.AuthGuard('kakao')),
        __param(0, common_1.Res())
    ], KakaoAuthController.prototype, "kakaoLoginLogic");
    __decorate([
        common_1.Get('/loginRedirect'),
        common_1.Header('Content-Type', 'text/html'),
        common_1.UseGuards(passport_1.AuthGuard('kakao')),
        __param(0, common_1.Req()),
        __param(1, common_1.Res())
    ], KakaoAuthController.prototype, "kakaoLoginLogicRedirect");
    KakaoAuthController = __decorate([
        common_1.Controller('auth/kakao')
    ], KakaoAuthController);
    return KakaoAuthController;
}());
exports.KakaoAuthController = KakaoAuthController;
