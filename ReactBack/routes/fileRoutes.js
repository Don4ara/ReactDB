const express = require('express');
const { handleFileUpload, handleFileDownload, getFileData } = require('../controllers/fileController.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../data');
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath);  // Создаем директорию, если она не существует
      }
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);  // Генерация уникального имени для файла
    },
});

const upload = multer({ storage });
const router = express.Router();

// POST-запрос для загрузки файла (данные добавляются к существующим)
router.post('/upload', upload.single('file'), handleFileUpload);

// GET-запрос для скачивания файла
router.get('/download', handleFileDownload);

// GET-запрос для получения данных о файле
router.get('/getfile', getFileData);

// Экспорт маршрута для использования в других файлах
module.exports = router;
