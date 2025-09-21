import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import RootLayout from "../Layouts/RootLayout";
import Home from "../Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import JoinUs from "../Authentication/JoinUs";
import Register from "../Authentication/Register";
import AddPost from "../User/AddPost";
import AddAnnouncement from "../Admin/AddAnnouncement";
import PrivateRoute from "./PrivateRoute";
import Forbidden from "../Components/Forbidden";
import AdminRoute from "./AdminRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: RootLayout,
        children:
            [
                {
                    index: true,
                    Component: Home
                },
                {
                    path: 'addpost',
                    element: <PrivateRoute><AddPost></AddPost></PrivateRoute>
                },
                {
                    path: 'addannouncements',
                    element: <AdminRoute><AddAnnouncement></AddAnnouncement></AdminRoute>
                },
                {
                    path: 'forbidden',
                    element: <Forbidden></Forbidden>
                },


            ]
    },
    {
        path: '/',
        Component: AuthLayout,
        children:
            [
                {
                    path: 'joinus',
                    Component: JoinUs
                },
                {
                    path: 'register',
                    Component: Register
                }
            ]
    },


]);