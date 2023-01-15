import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import config from '../utils/utils';
import style from '../styles/style.module.css';
export default function Refresh() {
  const [password, setPassword] = useState('');
  const [link, setLink] = useState('');
  const navigate = useNavigate();
  const getPassword = async () => {
    const userData = {
      refreshLink: link,
      password
    }
    const res = await fetch(`${config.SERVER_URL}/changePassword`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(userData),
      credentials: 'include'
    });
    const data = await res.json();
    console.log(data);
    setLink('');
    setPassword('');
    navigate('/login');
  }
  return (
    <div className={style.container__component}>
      <h1>Восстановите пароль</h1>
      <div className={style.wrapper}>
        <input className={style.input} onChange={e => setLink(e.target.value)} value={link} type='text' placeholder="Код доступа" />
        <input className={style.input} onChange={e => setPassword(e.target.value)} value={password} type='text' placeholder="Новый пароль" />
      </div>
      <div className={style.wrapper}>
        <button className={style.button} onClick={getPassword}>Изменить пароль</button>
      </div>
    </div>
  )
}