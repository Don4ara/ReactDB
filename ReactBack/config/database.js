// config/database.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('database_lab', 'root', 'root', {
  host: 'localhost',  // Для Docker используйте имя контейнера или сервис в docker-compose, если работаете с Docker
  port: 54321,  // Порт по умолчанию для PostgreSQL
  dialect: 'postgres',
  logging: false, // Включите логирование, если хотите отслеживать запросы
});

module.exports = sequelize;
