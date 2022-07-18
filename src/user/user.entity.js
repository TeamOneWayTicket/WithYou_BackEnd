"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.User = void 0;
var typeorm_1 = require("typeorm");
var local_user_entity_1 = require("./local.user.entity");
var kakao_user_entity_1 = require("./kakao.user.entity");
var diary_entity_1 = require("../diary/diary.entity");
var User = /** @class */ (function () {
    function User() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn() // 이 Annotation을 통해 기본키로 사용함을 명시함
    ], User.prototype, "id");
    __decorate([
        typeorm_1.Column({
            nullable: true
        }),
        typeorm_1.Index()
    ], User.prototype, "familyId");
    __decorate([
        typeorm_1.Column({
            nullable: true
        })
    ], User.prototype, "nickname");
    __decorate([
        typeorm_1.Column({
            nullable: true
        })
    ], User.prototype, "gender");
    __decorate([
        typeorm_1.OneToOne(function () { return local_user_entity_1.LocalUser; }, function (localUser) { return localUser.user; }, {
            nullable: true
        })
    ], User.prototype, "localUser");
    __decorate([
        typeorm_1.OneToOne(function () { return kakao_user_entity_1.KakaoUser; }, function (kakaoUser) { return kakaoUser.user; }, {
            nullable: true
        })
    ], User.prototype, "kakaoUser");
    __decorate([
        typeorm_1.OneToMany(function () { return diary_entity_1.Diary; }, function (diary) { return diary.author; })
    ], User.prototype, "diarys");
    User = __decorate([
        typeorm_1.Entity()
    ], User);
    return User;
}());
exports.User = User;
