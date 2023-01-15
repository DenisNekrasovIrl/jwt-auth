import React, { useEffect } from "react";
import { useContext } from "react";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Context } from "..";
import NavLink from "../components/NavLink";
import { routes } from '../routes/routes'
import config from '../utils/utils';
import { observer } from 'mobx-react-lite';
import { useState } from "react";
import style from '../styles/style.module.css';
export default observer(function AppRouter() {
  const { store } = useContext(Context);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setLoading(true);
      setTimeout(() => {
        refreshToken();
        setLoading(false);
      }, 500)

    }
  }, [])
  const refreshToken = async () => {
    const res = await fetch(`${config.SERVER_URL}/refreshToken`, {
      method: 'GET',
      credentials: 'include'
    })
    const data = await res.json();
    if (res.status == 500) {
      console.log('Вы не авторизованы');
      return;
    }
    localStorage.setItem('token', data.accessToken);
    store.setAuth(true);
    console.log(store.auth);
  }
  if (loading) {
    return (
      <div className={style.container__load}>
        <h1>Загрузка данных...</h1>
      </div>
    )
  }
  return (
    <BrowserRouter>
      <NavLink />
      <Routes>
        {
          store.auth
            ?
            <>
              <Route path={routes.content.path} element={routes.content.component} />
              <Route path = {routes.registration.path} element = {<Navigate replace to = '/content'/>}/>
              <Route path = {routes.login.path} element = {<Navigate replace to = '/content'/>}/>
              <Route path = {routes.refresh.path} element = {<Navigate replace to = '/content'/>}/>
            </>
            :
            <Route path={routes.content.path} element={<Navigate replace to='/login' />} />
        }
        <Route path={routes.registration.path} element={routes.registration.component} />
        <Route path={routes.login.path} element={routes.login.component} />
        <Route path={routes.refresh.path} element={routes.refresh.component} />
      </Routes>
    </BrowserRouter>
  )
})