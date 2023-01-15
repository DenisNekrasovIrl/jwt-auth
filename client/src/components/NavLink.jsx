import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "..";
import config from '../utils/utils';
import { observer } from 'mobx-react-lite';
import style from '../styles/style.module.css';
export default observer(function NavLink() {
    const { store } = useContext(Context)
    const logout = async () => {
        const res = await fetch(`${config.SERVER_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        const data = await res.json();
        localStorage.removeItem('token');
        store.setAuth(false);
        console.log(data);
    }
    return (
        <div className={style.main}>
            {
                store.auth
                    ?
                    <div className={style.container}>
                        <Link className={style.link} to='/' onClick={logout}>Выйти</Link>
                    </div>
                    :
                    <div className={style.container}>
                        <Link className={style.link} to='/login'>Авторизация</Link>
                        <Link className={style.link} to='/'>Регистрация</Link>
                    </div>
            }
        </div>
    )
})