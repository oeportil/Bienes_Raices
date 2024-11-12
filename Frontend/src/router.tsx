import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Error404 from "./Error404 ";
import Home from "./pages/Home";
import States from "./pages/States";
import Registro from "./pages/Registro";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CRUDState from "./pages/User/CRUDState";
import MyAuctions from "./pages/User/MyAuctions";
import Auctions from "./pages/User/Auctions";
import Subasta from "./pages/User/Subasta";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <Error404 />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "propiedades",
        element: <States />,
      },
      {
        path: "inicio-sesion",
        element: <Login />,
      },
      {
        path: "registro",
        element: <Registro />,
      },
      {
        path: "perfil",
        element: <Profile />,
      },
      {
        path: "myproperties",
        element: <CRUDState />,
      },
      {
        path: "myauctions",
        element: <MyAuctions />,
      },
      {
        path: "auction",
        element: <Auctions />,
      },
      {
        path: "auction/:id",
        element: <Subasta />,
      },
    ],
  },
]);

export default router;
