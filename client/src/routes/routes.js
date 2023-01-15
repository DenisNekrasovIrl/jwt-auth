import { Navigate } from "react-router-dom";
import Content from "../pages/Content";
import Login from "../pages/Login";
import Refresh from "../pages/Refresh";
import Registration from "../pages/Registration";

export const routes = {
    content: {
        path: '/content',
        component: <Content />,
        subComponent: <Login />
    },
    login: {
        path: '/login',
        component: <Login />
    },
    registration: {
        path: '/',
        component: <Registration />
    },
    refresh: {
        path: '/refresh',
        component: <Refresh />
    }
}

