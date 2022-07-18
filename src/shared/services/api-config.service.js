"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ApiConfigService = void 0;
var common_1 = require("@nestjs/common");
var lodash_1 = require("lodash");
var typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
var ApiConfigService = /** @class */ (function () {
    function ApiConfigService(configService) {
        this.configService = configService;
    }
    Object.defineProperty(ApiConfigService.prototype, "isDevelopment", {
        get: function () {
            return this.nodeEnv === 'development';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "isProduction", {
        get: function () {
            return this.nodeEnv === 'production';
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "isTest", {
        get: function () {
            return this.nodeEnv === 'test';
        },
        enumerable: false,
        configurable: true
    });
    ApiConfigService.prototype.getNumber = function (key) {
        var value = this.get(key);
        try {
            return Number(value);
        }
        catch (_a) {
            throw new Error(key + ' environment variable is not a number');
        }
    };
    ApiConfigService.prototype.getBoolean = function (key) {
        var value = this.get(key);
        try {
            return Boolean(JSON.parse(value));
        }
        catch (_a) {
            throw new Error(key + ' env var is not a boolean');
        }
    };
    ApiConfigService.prototype.getString = function (key) {
        var value = this.get(key);
        return value.replace(/\\n/g, '\n');
    };
    Object.defineProperty(ApiConfigService.prototype, "nodeEnv", {
        get: function () {
            return this.getString('NODE_ENV');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "fallbackLanguage", {
        get: function () {
            return this.getString('FALLBACK_LANGUAGE');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "postgresConfig", {
        get: function () {
            var entities = [
                __dirname + '/../../**/*.entity{.ts,.js}',
                __dirname + '/../../**/*.view-entity{.ts,.js}',
            ];
            var migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];
            return {
                entities: entities,
                migrations: migrations,
                type: 'postgres',
                name: 'default',
                host: this.getString('DB_HOST'),
                port: this.getNumber('DB_PORT'),
                username: this.getString('DB_USERNAME'),
                password: this.getString('DB_PASSWORD'),
                database: this.getString('DB_DATABASE'),
                migrationsRun: false,
                synchronize: true,
                logging: this.getBoolean('ENABLE_ORM_LOGS'),
                namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy()
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "awsS3Config", {
        get: function () {
            return {
                bucketRegion: this.getString('AWS_S3_BUCKET_REGION'),
                bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
                bucketName: this.getString('AWS_S3_BUCKET_NAME')
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "documentationEnabled", {
        get: function () {
            return this.getBoolean('ENABLE_DOCUMENTATION');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "natsEnabled", {
        get: function () {
            return this.getBoolean('NATS_ENABLED');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "natsConfig", {
        get: function () {
            return {
                host: this.getString('NATS_HOST'),
                port: this.getNumber('NATS_PORT')
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "authConfig", {
        get: function () {
            return {
                privateKey: this.getString('JWT_PRIVATE_KEY'),
                publicKey: this.getString('JWT_PUBLIC_KEY'),
                jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME')
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "kakaoConfig", {
        get: function () {
            return {
                restApiKey: this.getString('REST_API_KEY'),
                callBackUrl: this.getString('CALLBACK_URL')
            };
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ApiConfigService.prototype, "appConfig", {
        get: function () {
            return {
                port: this.getString('PORT')
            };
        },
        enumerable: false,
        configurable: true
    });
    ApiConfigService.prototype.get = function (key) {
        var value = this.configService.get(key);
        if (lodash_1.isNil(value)) {
            throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
        }
        return value;
    };
    ApiConfigService = __decorate([
        common_1.Injectable()
    ], ApiConfigService);
    return ApiConfigService;
}());
exports.ApiConfigService = ApiConfigService;
