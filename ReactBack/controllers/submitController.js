const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/data.json');

// Проверка и сохранение данных
const saveDataToFile = (data) => {
  let fileData = [];

  if (fs.existsSync(dataFilePath)) {
    const rawData = fs.readFileSync(dataFilePath);
    fileData = JSON.parse(rawData);
  }

  const isFieldValid = (field) => /^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(field);

  if (!isFieldValid(data.name) || !isFieldValid(data.surname) || !isFieldValid(data.patronymic)) {
    console.log('Некорректные данные:', data);
    return false;
  }

  const isDuplicate = fileData.some(item =>
    item.name.toLowerCase() === data.name.toLowerCase() &&
    item.surname.toLowerCase() === data.surname.toLowerCase() &&
    item.patronymic.toLowerCase() === data.patronymic.toLowerCase()
  );

  if (isDuplicate) {
    console.log('Данные дублируются:', data);
    return false;
  }

  fileData.push(data);
  fs.writeFileSync(dataFilePath, JSON.stringify(fileData, null, 2));
  return true;
};

// Обработчик для маршрута
const handleSubmit = (req, res) => {
  const { name, surname, patronymic, weight, height, country } = req.body;
  const saved = saveDataToFile({ name, surname, patronymic, weight, height, country });

  if (saved) {
    res.status(200).send({ message: 'Данные успешно получены и сохранены!' });
  } else {
    res.status(300).send({ message: 'Данные с таким именем, фамилией и отчеством уже существуют!' });
  }
};

// Экспорт обработчика для использования в других файлах
module.exports = { handleSubmit };
