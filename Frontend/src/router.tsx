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
import SingleState from "./pages/SingleState";

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
        path: "propiedades/:id",
        element: <SingleState/>
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
        path: "perfil/mis-propiedades",
        element: <CRUDState />,
      },
      {
        path: "perfil/mis-subastas",
        element: <MyAuctions />,
      },
      {
        path: "subastas",
        element: <Auctions />,
      },
      {
        path: "subastas/:id",
        element: <Subasta />,
      },
    ],
  },
]);

export default router;
