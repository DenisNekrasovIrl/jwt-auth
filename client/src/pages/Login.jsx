import React, { useState } from "react";
import { useContext } from "react";
import { Context } from "..";
import config from '../utils/utils';
import { observer } from 'mobx-react-lite';
import { useNavigate } from "react-router-dom";
import style from '../styles/style.module.css';
export default observer(function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [refreshEmail, setRefreshEmail] = useState('');
  const { store } = useContext(Context);
  const navigate = useNavigate();
  const login = async () => {
    const user = {
      email,
      password
    }
    const res = await fetch(`${config.SERVER_URL}/login`, {
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
    if (data.status == 403 || data.status == 401) {
      console.log('Авторизация не удалась');
      return;
    }
    localStorage.setItem('token', data.accessToken);
    store.setAuth(true);
    navigate('/content');
    console.log(data);
  }
  const revivePassword = async () => {
    const user = {
      email: refreshEmail
    }
    const res = await fetch(`${config.SERVER_URL}/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user),
      credentials: 'include'
    })
    const data = await res.json();
    console.log(data);
    setRefreshEmail('');
  }
  return (
    <div>
      <div className={style.container__component}>
        <h1>Пройдите авторизацию</h1>
        <div className={style.wrapper}>
          <input className={style.input} onChange={e => setEmail(e.target.value)} value={email} type='text' placeholder="Email" />
          <input className={style.input} onChange={e => setPassword(e.target.value)} value={password} type='password' placeholder="Password" />
        </div>
        <div className={style.wrapper}>
          <button className={style.button} onClick={login}>Авторизация</button>
        </div>
      </div>
      <div className={style.container__component}>
        <h1>Забыли пароль?</h1>
        <div className={style.wrapper}>
          <input className={style.input} onChange={e => setRefreshEmail(e.target.value)} value={refreshEmail} type='text' placeholder="Email" />
        </div>
        <div className={style.wrapper}>
          <button className={style.button} onClick={revivePassword}>Забыли пароль?</button>
        </div>
      </div>
    </div>
  )
})