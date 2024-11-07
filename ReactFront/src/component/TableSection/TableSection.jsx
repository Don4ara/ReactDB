import { useEffect, useState } from 'react';
import axios from 'axios';
import './TableSection.css';
import { message } from 'antd';

export default function TableSection() {
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/getfile');
      setData(response.data);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      messageApi.open({
        type: 'error',
        content: 'На сервере нету файла',
        duration: 1,
    });
    }
  };

  


  useEffect(() => {
    getData();
  }, [])

  return (
    <>
    {contextHolder}
      <div>
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Отчество</th>
              <th>Вес</th>
              <th>Рост</th>
              <th>Страна</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.surname}</td>
                <td>{item.patronymic}</td>
                <td>{item.weight}</td>
                <td>{item.height}</td>
                <td>{item.country}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>

  );
}
