import { Input, Button } from "@nextui-org/react";
import { Select, SelectItem, Avatar } from "@nextui-org/react";
import './FormSection.css';
import { message } from 'antd';
import { useState } from "react";
import axios from 'axios';


export default function FormSection() {
    const [messageApi, contextHolder] = message.useMessage();

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        patronymic: '',
        weight: '',
        height: '',
    });
    const [countryValue, setCountryValue] = useState('')

    const handleSelectionChange = (e) => {
        setCountryValue(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const formatName = (name) => {
        if (!name) return '';
        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const namePattern = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
        if (
            !namePattern.test(formData.name) ||
            !namePattern.test(formData.surname) ||
            !namePattern.test(formData.patronymic)
        ) {
            messageApi.open({
                type: 'error',
                content: 'Имя, фамилия и отчество должны содержать только буквы и пробелы!',
                duration: 1,
            });
            return;
        }

        const formattedData = {
            name: formatName(formData.name),
            surname: formatName(formData.surname),
            patronymic: formatName(formData.patronymic),
            weight: formData.weight,
            height: formData.height,
            country: countryValue,
        };

        if (!formattedData.name || !formattedData.surname || !formattedData.patronymic || !formattedData.weight || !formattedData.height || !countryValue) {
            messageApi.open({
                type: 'error',
                content: 'Все поля должны быть заполнены!',
                duration: 1,
            });
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/submit', formattedData);
            messageApi.open({
                type: 'success',
                content: response.data.message,
                duration: 1,
            });
            setFormData({
                name: '',
                surname: '',
                patronymic: '',
                weight: '',
                height: '',
            });
            setCountryValue('')
        } catch (error) {
            console.log(error);
            messageApi.open({
                type: 'error',
                content: error.response ? error.response.data.message : 'Ошибка при отправке данных',
                duration: 1,
            });
        }
    };

    return (
        <>
            {contextHolder}
            <section className="form-page">
                <div className="form-page-container">
                    <h1 className="form-page-h1">Данные о спортсмене</h1>
                    <form className="form-content" onSubmit={handleSubmit}>
                        <Input
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            errorMessage="Введите фамилию"
                            isRequired
                            size={'sm'}
                            label="Фамилия"
                        />
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            errorMessage="Введите имя"
                            isRequired
                            size={'sm'}
                            label="Имя"
                        />
                        <Input
                            name="patronymic"
                            value={formData.patronymic}
                            onChange={handleChange}
                            errorMessage="Введите отчество"
                            isRequired
                            size={'sm'}
                            label="Отчество"
                        />
                        <div className="form-height-width">
                            <Input
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                errorMessage="Введите вес"
                                isRequired
                                size={'sm'}
                                type="number"
                                label="Вес"
                                className="bg-number"
                            />
                            <Input
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                errorMessage="Введите рост"
                                isRequired
                                size={'sm'}
                                type="number"
                                label="Рост"
                                className="bg-number"
                            />
                        </div>
                        <div className="form-select">
                            <Select
                                className="max-w-xs"
                                isRequired
                                label="Выберите страну"
                                selectedKeys={[countryValue]}
                                size="sm"
                                onChange={handleSelectionChange}
                                errorMessage="Выберите страну"
                            >
                                <SelectItem
                                    key="argentina"
                                    startContent={<Avatar alt="Argentina" className="w-6 h-6" src="https://flagcdn.com/ar.svg" />}
                                >
                                    Argentina
                                </SelectItem>
                                <SelectItem
                                    key="russia"
                                    startContent={<Avatar alt="Russia" className="w-6 h-6" src="https://flagcdn.com/ru.svg" />}
                                >
                                    Russia
                                </SelectItem>
                                <SelectItem
                                    key="venezuela"
                                    startContent={<Avatar alt="Venezuela" className="w-6 h-6" src="https://flagcdn.com/ve.svg" />}
                                >
                                    Venezuela
                                </SelectItem>
                                <SelectItem
                                    key="brazil"
                                    startContent={<Avatar alt="Brazil" className="w-6 h-6" src="https://flagcdn.com/br.svg" />}
                                >
                                    Brazil
                                </SelectItem>
                                <SelectItem
                                    key="switzerland"
                                    startContent={
                                        <Avatar alt="Switzerland" className="w-6 h-6" src="https://flagcdn.com/ch.svg" />
                                    }
                                >
                                    Switzerland
                                </SelectItem>
                                <SelectItem
                                    key="germany"
                                    startContent={<Avatar alt="Germany" className="w-6 h-6" src="https://flagcdn.com/de.svg" />}
                                >
                                    Germany
                                </SelectItem>
                                <SelectItem
                                    key="spain"
                                    startContent={<Avatar alt="Spain" className="w-6 h-6" src="https://flagcdn.com/es.svg" />}
                                >
                                    Spain
                                </SelectItem>
                                <SelectItem
                                    key="france"
                                    startContent={<Avatar alt="France" className="w-6 h-6" src="https://flagcdn.com/fr.svg" />}
                                >
                                    France
                                </SelectItem>
                                <SelectItem
                                    key="italy"
                                    startContent={<Avatar alt="Italy" className="w-6 h-6" src="https://flagcdn.com/it.svg" />}
                                >
                                    Italy
                                </SelectItem>
                                <SelectItem
                                    key="mexico"
                                    startContent={<Avatar alt="Mexico" className="w-6 h-6" src="https://flagcdn.com/mx.svg" />}
                                >
                                    Mexico
                                </SelectItem>
                            </Select>
                        </div>
                        <Button type="submit" color="primary">
                            Отправить
                        </Button>
                        <Button
                            type="button"
                            color="default"
                            onClick={() => {
                                setFormData({ name: '', surname: '', patronymic: '', weight: '', height: '' });
                                setCountryValue('');
                            }}
                        >
                            Сбросить
                        </Button>

                    </form>
                </div>
            </section>
        </>
    );
}
