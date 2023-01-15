import React, { useState } from "react";
import config from '../utils/utils';
import style from '../styles/style.module.css';
export default function Content() {
    const [users, setUsers] = useState([]);
    const [checked, setChecked] = useState(false);
    const getUsers = async () => {
        const res = await fetch(`${config.SERVER_URL}/users`, {
            method: 'GET',
            headers: {
                authorization: `Bearer ${localStorage.getItem('token')}`
            },
            credentials: 'include'
        })
        const data = await res.json();
        if (res.status == 500 && data.message == 'jwt expired') {
            const res = await fetch(`${config.SERVER_URL}/refreshToken`, {
                method: 'GET',
                credentials: 'include'
            })
            const data = await res.json();
            localStorage.setItem('token', data.accessToken);
            getUsers();
            return;
        }
        if (res.status === 500) {
            console.log('Вы не авторизованы');
            return;
        }
        setChecked(true);
        setUsers(data)
    }
    return (
        <div className={style.container__users}>
            <div className={style.container__get}>
                <h1>Получите пользователей</h1>
                <div className={style.wrapper}>
                    <button className={style.button} onClick={getUsers}>Получить пользователей</button>
                </div>
            </div>
            {
                checked
                    ?
                    <div className={style.container__get}>{users.map(user => <div className={style.user} key={user.email}>{user.email}</div>)}</div>
                    :
                    <div></div>
            }
        </div>

    )
}