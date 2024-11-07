import { useEffect, useState } from 'react';
import { Input, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Button, useDisclosure } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { DeleteIcon } from './DeleteIcon';
import { EditIcon } from './EditIcon';
import axios from 'axios';
import { message } from 'antd';
import './TableSectionDB.css';

export default function TableSection({ onEditUser }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [data, setData] = useState([]); // Данные для отображения в таблице
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    country: '',
    weight: '',
    height: ''
  });
  const [searchQuery, setSearchQuery] = useState(''); // Строка для поиска

  // Функция для загрузки всех пользователей
  const getAllData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users');
      setData(response.data); // Устанавливаем все данные в state
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Не удалось загрузить данные с сервера',
        duration: 1,
      });
    }
  };

  // Функция для поиска пользователей
  const getSearchData = async (query) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/search?query=${query}`);
      setData(response.data); // Устанавливаем найденные данные в state
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Не удалось выполнить поиск по запросу',
        duration: 1,
      });
    }
  };

  // Обработчик изменения строки поиска
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Обновляем строку поиска
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      // Если строка поиска пустая, загружаем все данные
      getAllData();
    } else {
      // Если строка поиска не пустая, делаем поиск
      getSearchData(searchQuery);
    }
  }, [searchQuery]); // Перезапускаем поиск при изменении строки поиска

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/delete/${id}`);
      if (response.status === 204) {
        setData(prevData => prevData.filter(user => user.id !== id));
        messageApi.open({
          type: 'success',
          content: 'Пользователь успешно удалён',
          duration: 1,
        });
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Не удалось удалить пользователя',
        duration: 1,
      });
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      country: user.country,
      weight: user.weight,
      height: user.height
    });
    onOpen(); // Открываем модальное окно для редактирования
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/update/${selectedUser.id}`, formData);
      if (response.status === 200) {
        setData(prevData => prevData.map(user => user.id === selectedUser.id ? { ...user, ...formData } : user));
        messageApi.open({
          type: 'success',
          content: 'Пользователь успешно обновлён',
          duration: 1,
        });
        onOpenChange(false); // Закрываем модальное окно
      }
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'Данный пользователь существует',
        duration: 1,
      });
    }
  };

  useEffect(() => {
    // Загрузка всех пользователей при монтировании компонента
    getAllData();
  }, []);

  return (
    <>
      {contextHolder}
      <Input
        aria-label="Поиск пользователей"
        placeholder="Поиск по имени, фамилии, стране и т.д."
        value={searchQuery}
        onChange={handleSearchChange}
        clearable
        underlined
      />
      <Table aria-label="Users table">
        <TableHeader>
          <TableColumn>Имя</TableColumn>
          <TableColumn>Фамилия</TableColumn>
          <TableColumn>Отчество</TableColumn>
          <TableColumn>Страна</TableColumn>
          <TableColumn>Вес</TableColumn>
          <TableColumn>Рост</TableColumn>
          <TableColumn>Действия</TableColumn>
        </TableHeader>
        <TableBody emptyContent={"Нет пользователей для отображения."}>
          {data.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{user.middleName}</TableCell>
              <TableCell>{user.country}</TableCell>
              <TableCell>{user.weight}</TableCell>
              <TableCell>{user.height}</TableCell>
              <TableCell className='flex gap-2'>
                <Tooltip content="Редактировать пользователя">
                  <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </span>
                </Tooltip>
                <Tooltip color="danger" content="Удалить пользователя">
                  <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={() => handleDeleteUser(user.id)}>
                    <DeleteIcon />
                  </span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Модальное окно для редактирования пользователя */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Редактировать пользователя</ModalHeader>
          <ModalBody>
            <form onSubmit={e => { e.preventDefault(); handleSubmitEdit(); }} className='form-content'>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Имя"
                required
              />
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Фамилия"
                required
              />
              <Input
                name="middleName"
                value={formData.middleName}
                onChange={handleChange}
                placeholder="Отчество"
                required
              />
              <Input
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Страна"
                required
              />
              <Input
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Вес"
                required
              />
              <Input
                name="height"
                type="number"
                value={formData.height}
                onChange={handleChange}
                placeholder="Рост"
                required
              />
            </form>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => onOpenChange(false)}>
              Закрыть
            </Button>
            <Button color="primary" onPress={handleSubmitEdit}>
              Обновить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
