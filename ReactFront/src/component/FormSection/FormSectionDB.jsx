import { Input, Button, Select, SelectItem, Avatar, Spinner } from "@nextui-org/react";
import { message } from 'antd';
import { useState, useEffect } from "react";
import axios from 'axios';
import './FormSectionDB.css';

export default function FormSection() {
    const [messageApi, contextHolder] = message.useMessage();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        weight: '',
        height: '',
    });
    const [countryValue, setCountryValue] = useState('');
    const [users, setUsers] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async (query = '') => {
        try {
            const url = query
                ? `http://localhost:5000/api/users/search?query=${query}`
                : 'http://localhost:5000/api/users';
            const response = await axios.get(url);
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSelectionChange = (e) => {
        setCountryValue(e.target.value);
    };

    const formatName = (name) => {
        return name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const namePattern = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
        if (!namePattern.test(formData.firstName) ||
            !namePattern.test(formData.lastName) ||
            !namePattern.test(formData.middleName)) {
            messageApi.open({
                type: 'error',
                content: 'Имя, фамилия и отчество должны содержать только буквы и пробелы!',
                duration: 1,
            });
            setLoading(false);
            return;
        }

        const formattedData = {
            firstName: formatName(formData.firstName),
            lastName: formatName(formData.lastName),
            middleName: formatName(formData.middleName),
            weight: formData.weight,
            height: formData.height,
            country: countryValue,
        };

        if (!formattedData.firstName || !formattedData.lastName || !formattedData.middleName || !formattedData.weight || !formattedData.height || !countryValue) {
            messageApi.open({
                type: 'error',
                content: 'Все поля должны быть заполнены!',
                duration: 1,
            });
            setLoading(false);
            return;
        }

        // Проверка на дубликаты среди существующих пользователей
        const duplicateUser = users.find(user =>
            user.firstName.toLowerCase() === formattedData.firstName.toLowerCase() &&
            user.lastName.toLowerCase() === formattedData.lastName.toLowerCase() &&
            user.middleName.toLowerCase() === formattedData.middleName.toLowerCase()
        );

        if (duplicateUser) {
            messageApi.open({
                type: 'error',
                content: 'Пользователь с такими данными уже существует!',
                duration: 1,
            });
            setLoading(false);
            return;
        }

        try {
            if (editingUser) {
                const response = await axios.put(`http://localhost:5000/api/update/${editingUser.id}`, formattedData);
                messageApi.open({
                    type: 'success',
                    content: 'Пользователь обновлен!',
                    duration: 1,
                });
                setUsers(users.map(user => user.id === editingUser.id ? response.data : user));
            } else {
                const response = await axios.post('http://localhost:5000/api/create', formattedData);
                messageApi.open({
                    type: 'success',
                    content: 'Пользователь создан!',
                    duration: 1,
                });
                setUsers(prevUsers => [...prevUsers, response.data]);
            }

            setFormData({
                firstName: '',
                lastName: '',
                middleName: '',
                weight: '',
                height: '',
            });
            setCountryValue('');
            setEditingUser(null);
        } catch (error) {
            console.error(error);
            messageApi.open({
                type: 'error',
                content: error.response ? error.response.data.message : 'Ошибка при отправке данных',
                duration: 1,
            });
        } finally {
            setLoading(false);
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
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            errorMessage="Введите фамилию"
                            isRequired
                            size="sm"
                            label="Фамилия"
                        />
                        <Input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            errorMessage="Введите имя"
                            isRequired
                            size="sm"
                            label="Имя"
                        />
                        <Input
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            errorMessage="Введите отчество"
                            isRequired
                            size="sm"
                            label="Отчество"
                        />
                        <div className="form-height-width">
                            <Input
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                errorMessage="Введите вес"
                                isRequired
                                size="sm"
                                type="number"
                                label="Вес"
                            />
                            <Input
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                errorMessage="Введите рост"
                                isRequired
                                size="sm"
                                type="number"
                                label="Рост"
                            />
                        </div>
                        <div className="form-select">
                            <Select
                                isRequired
                                label="Выберите страну"
                                selectedKeys={[countryValue]}
                                size="sm"
                                onChange={handleSelectionChange}
                                errorMessage="Выберите страну"
                            >
                                <SelectItem key="argentina" startContent={<Avatar alt="Argentina" className="w-6 h-6" src="https://flagcdn.com/ar.svg" />}>
                                    Argentina
                                </SelectItem>
                                <SelectItem key="russia" startContent={<Avatar alt="Russia" className="w-6 h-6" src="https://flagcdn.com/ru.svg" />}>
                                    Russia
                                </SelectItem>
                                <SelectItem key="venezuela" startContent={<Avatar alt="Venezuela" className="w-6 h-6" src="https://flagcdn.com/ve.svg" />}>
                                    Venezuela
                                </SelectItem>
                                <SelectItem key="brazil" startContent={<Avatar alt="Brazil" className="w-6 h-6" src="https://flagcdn.com/br.svg" />}>
                                    Brazil
                                </SelectItem>
                                <SelectItem key="switzerland" startContent={<Avatar alt="Switzerland" className="w-6 h-6" src="https://flagcdn.com/ch.svg" />}>
                                    Switzerland
                                </SelectItem>
                                <SelectItem key="germany" startContent={<Avatar alt="Germany" className="w-6 h-6" src="https://flagcdn.com/de.svg" />}>
                                    Germany
                                </SelectItem>
                                <SelectItem key="spain" startContent={<Avatar alt="Spain" className="w-6 h-6" src="https://flagcdn.com/es.svg" />}>
                                    Spain
                                </SelectItem>
                                <SelectItem key="france" startContent={<Avatar alt="France" className="w-6 h-6" src="https://flagcdn.com/fr.svg" />}>
                                    France
                                </SelectItem>
                                <SelectItem key="italy" startContent={<Avatar alt="Italy" className="w-6 h-6" src="https://flagcdn.com/it.svg" />}>
                                    Italy
                                </SelectItem>
                                <SelectItem key="mexico" startContent={<Avatar alt="Mexico" className="w-6 h-6" src="https://flagcdn.com/mx.svg" />}>
                                    Mexico
                                </SelectItem>
                                <SelectItem key="uk" startContent={<Avatar alt="UK" className="w-6 h-6" src="https://flagcdn.com/gb.svg" />}>
                                    United Kingdom
                                </SelectItem>
                            </Select>
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Spinner size="sm" /> : (editingUser ? 'Обновить' : 'Добавить')}
                        </Button>
                    </form>
                </div>
            </section>
        </>
    );
}
