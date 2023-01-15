import React, { useState } from "react";
import { useContext } from "react";
import { Context } from "..";
import config from '../utils/utils';
import { observer } from 'mobx-react-lite';
import { useNavigate } from "react-router-dom";
import style from '../styles/style.module.css';
export default observer(function Registration() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const registration = async () => {
    const user = {
      email,
      password
    }
    const res = await fetch(`${config.SERVER_URL}/registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user),
      credentials: 'include'
    })
    setEmail('');
    setPassword('');
    const data = await res.json();
    if (data.status == 403) {
      console.log('Регистрация не удалась');
      return;
    }
    localStorage.setItem('token', data.accessToken);
    store.setAuth(true);
      navigate('/content');
    console.log(data);
  }
  return (
    <div className={style.container__component}>
      <h1>Пройдите регистрацию</h1>
      <div className={style.wrapper}>
        <input className={style.input} onChange={e => setEmail(e.target.value)} value={email} type='text' placeholder="Email" />
        <input className={style.input} onChange={e => setPassword(e.target.value)} value={password} type='password' placeholder="Password" />
      </div>
      <div className={style.wrapper}>
        <button className={style.button} onClick={registration}>Регистрация</button>
      </div>
    </div>
  )
})