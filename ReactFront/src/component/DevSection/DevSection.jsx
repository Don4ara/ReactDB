import { useState } from 'react';
import { Link, Button } from "@nextui-org/react";
import axios from 'axios';
import { message } from 'antd';

export default function DevSection() {
    const [messageApi, contextHolder] = message.useMessage();
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData);
            messageApi.open({
                type: 'success',
                content: response.data.message,
                duration: 1,
            });
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error.response ? error.response.data : error.message);
            messageApi.open({
                type: 'error',
                content: error.response ? error.response.data.message : 'Ошибка загрузки файла',
                duration: 1,
            });
        } finally {
            // Сбрасываем выбранный файл независимо от результата
            setFile(null);
            event.target.reset();  // Сбрасываем форму
        }
    };

    const handleDownload = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/download', {
                responseType: 'blob', // Ожидаем бинарные данные
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'data.json'); // Устанавливаем имя файла для скачивания
            document.body.appendChild(link);
            link.click();
            link.remove();
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            message.error('Ошибка загрузки файла с сервера.');
        }
    };

    return (
        <>
            {contextHolder}
            <div className='form-container-d-u'>
                <h1>Upload JSON File</h1>
                <form onSubmit={handleUpload}>
                    <input type="file" accept=".json" onChange={handleFileChange} required />
                    <button type="submit">Upload</button>
                </form>
                <Button
                    onClick={handleDownload}
                    as={Link}
                    color="primary"
                    showAnchorIcon
                    variant="solid"
                >Скачать data.json</Button>
            </div>
        </>
    );
}
