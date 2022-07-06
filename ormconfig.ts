const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy;
require('dotenv');

module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity.{ts,js}'],
  synchronize: true,
  namingStrategy: new SnakeNamingStrategy(),
};
