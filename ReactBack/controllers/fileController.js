const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '../data/data.json');

// Проверка валидности структуры данных
const validateFileStructure = (data) => {
  const requiredFields = ['name', 'surname', 'patronymic', 'weight', 'height', 'country'];

  // Проверка на наличие всех обязательных полей и отсутствие лишних
  const dataFields = Object.keys(data);
  const hasRequiredFields = requiredFields.every(field => dataFields.includes(field));
  const noExtraFields = dataFields.every(field => requiredFields.includes(field));

  return hasRequiredFields && noExtraFields;
};

// Функция для проверки дубликатов
const checkForDuplicates = (existingData, newData) => {
  return existingData.some(item => 
    Object.keys(item).every(key => item[key] === newData[key])
  );
};

// Добавление данных из загруженного файла в существующий data.json
const appendDataToFile = (newData) => {
  let fileData = [];

  if (fs.existsSync(dataFilePath)) {
    const rawData = fs.readFileSync(dataFilePath);
    fileData = JSON.parse(rawData);
  }

  // Фильтруем новые данные, исключая дубликаты
  const filteredNewData = newData.filter(item => !checkForDuplicates(fileData, item));

  // Добавляем только уникальные данные
  if (filteredNewData.length > 0) {
    fileData = [...fileData, ...filteredNewData];
    fs.writeFileSync(dataFilePath, JSON.stringify(fileData, null, 2));
  }
};

// Обработка загрузки файла
const handleFileUpload = (req, res) => {
  const tempFilePath = req.file.path;

  fs.readFile(tempFilePath, 'utf8', (err, fileContent) => {
    if (err) {
      console.error('Ошибка при чтении файла:', err);
      fs.unlinkSync(tempFilePath); // Удаляем файл при ошибке чтения
      return res.status(500).json({ message: 'Ошибка при чтении файла' });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(fileContent);
    } catch (parseError) {
      console.error('Ошибка при парсинге JSON:', parseError);
      fs.unlinkSync(tempFilePath); // Удаляем файл при ошибке парсинга
      return res.status(400).json({ message: 'Некорректный формат файла' });
    }

    // Проверяем на корректность структуры
    if (Array.isArray(jsonData)) {
      const isValid = jsonData.every(item => validateFileStructure(item));
      if (!isValid) {
        fs.unlinkSync(tempFilePath); // Удаляем файл при ошибке структуры
        return res.status(400).json({ message: 'Файл содержит неверные данные' });
      }
    } else {
      if (!validateFileStructure(jsonData)) {
        fs.unlinkSync(tempFilePath); // Удаляем файл при ошибке структуры
        return res.status(400).json({ message: 'Файл содержит неверные данные' });
      }
      jsonData = [jsonData];
    }

    // Данные корректны — добавляем их в data.json
    appendDataToFile(jsonData);
    fs.unlinkSync(tempFilePath); // Удаляем файл после обработки
    res.status(200).json({ message: 'Данные успешно загружены и добавлены в data.json!' });
  });
};

// Обработка скачивания файла
const handleFileDownload = (req, res) => {
  res.download(dataFilePath, 'data.json', (err) => {
    if (err) {
      console.error('Ошибка при загрузке файла:', err);
      res.status(500).json({ message: 'Ошибка при загрузке файла' });
    }
  });
};

// Получение данных из файла
const getFileData = (req, res) => {
  if (fs.existsSync(dataFilePath)) {
    const rawData = fs.readFileSync(dataFilePath);
    const jsonData = JSON.parse(rawData);
    res.status(200).json(jsonData); // Отправляем данные в ответ
  } else {
    res.status(404).json({ message: 'Файл не найден' });
  }
};

// Экспорт функций для использования в других файлах
module.exports = { handleFileUpload, handleFileDownload, getFileData };
