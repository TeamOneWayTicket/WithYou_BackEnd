"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Diary = void 0;
var typeorm_1 = require("typeorm");
var user_entity_1 = require("../user/user.entity");
var Diary = /** @class */ (function () {
    function Diary() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Diary.prototype, "id");
    __decorate([
        typeorm_1.Column({
            nullable: true
        }),
        typeorm_1.Index()
    ], Diary.prototype, "familyId");
    __decorate([
        typeorm_1.Column(),
        typeorm_1.Index()
    ], Diary.prototype, "authorId");
    __decorate([
        typeorm_1.Column({
            nullable: true
        })
    ], Diary.prototype, "content");
    __decorate([
        typeorm_1.CreateDateColumn(),
        typeorm_1.Index()
    ], Diary.prototype, "createdAt");
    __decorate([
        typeorm_1.ManyToOne(function () { return user_entity_1.User; }, function (user) { return user.diarys; }, {
            createForeignKeyConstraints: false
        }),
        typeorm_1.JoinColumn({ name: 'author_id' })
    ], Diary.prototype, "author");
    Diary = __decorate([
        typeorm_1.Entity()
    ], Diary);
    return Diary;
}());
exports.Diary = Diary;
