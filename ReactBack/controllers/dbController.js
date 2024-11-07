const { Op } = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Person = sequelize.define('User', {
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  middleName: DataTypes.STRING,
  weight: DataTypes.INTEGER,
  height: DataTypes.INTEGER,
  country: DataTypes.STRING,
});
sequelize.authenticate()
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Unable to connect to the database:', err));


// Функция для создания пользователя
const createUser = async (req, res) => {
  const { firstName, lastName, middleName, weight, height, country } = req.body;

  try {
    const existingUser = await Person.findOne({
      where: { firstName, lastName, middleName }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const user = await Person.create({ firstName, lastName, middleName, weight, height, country });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Функция для удаления пользователя
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Person.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Функция для обновления пользователя
const updateUser = async (req, res) => {
  const { firstName, lastName, middleName, weight, height, country } = req.body;
  const { id } = req.params;

  try {
    const user = await Person.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const existingUser = await Person.findOne({
      where: {
        [Op.and]: [
          { id: { [Op.ne]: id } },
          { firstName },
          { lastName },
          { middleName }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with these details already exists' });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.middleName = middleName;
    user.weight = weight;
    user.height = height;
    user.country = country;
    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Функция для получения всех пользователей
const getAllUsers = async (req, res) => {
  try {
    const users = await Person.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при загрузке пользователей' });
  }
};

// Функция для поиска пользователей
const searchUsers = async (req, res) => {
  const { query } = req.query;  // Get query from request
  
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Преобразование query в число для числовых полей, если это возможно
    const numericQuery = !isNaN(query) ? parseFloat(query) : null;

    const users = await Person.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${query}%` } },
          { lastName: { [Op.iLike]: `%${query}%` } },
          { middleName: { [Op.iLike]: `%${query}%` } },
          { country: { [Op.iLike]: `%${query}%` } },
          // Проверка числовых значений
          numericQuery !== null ? { weight: { [Op.eq]: numericQuery } } : {},
          numericQuery !== null ? { height: { [Op.eq]: numericQuery } } : {},
        ]
      }
    });
    res.json(users);  // Send filtered users back to frontend
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search users' });
  }
};


// Экспорт функций для использования в других файлах
module.exports = { createUser, deleteUser, updateUser, getAllUsers, searchUsers };
