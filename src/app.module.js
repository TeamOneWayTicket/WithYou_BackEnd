"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var user_module_1 = require("./user/user.module");
var config_1 = require("@nestjs/config");
var shared_module_1 = require("./shared/shared.module");
var api_config_service_1 = require("./shared/services/api-config.service");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var auth_module_1 = require("./auth/auth.module");
var diary_module_1 = require("./diary/diary.module");
var AppModule = /** @class */ (function () {
    function AppModule(dataSource) {
        this.dataSource = dataSource;
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env'
                }),
                typeorm_1.TypeOrmModule.forRootAsync({
                    imports: [shared_module_1.SharedModule],
                    useFactory: function (configService) {
                        return configService.postgresConfig;
                    },
                    inject: [api_config_service_1.ApiConfigService]
                }),
                user_module_1.UserModule,
                auth_module_1.AuthModule,
                diary_module_1.DiaryModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
