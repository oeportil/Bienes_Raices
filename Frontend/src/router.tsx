import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Error404 from "./Error404 ";
import Home from "./pages/Home";
import States from "./pages/States";
import Registro from "./pages/Registro";
import Login from "./pages/Login";

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
    ],
  },
]);

export default router;
