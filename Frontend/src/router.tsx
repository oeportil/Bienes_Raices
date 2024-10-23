import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout";
import Error404 from "./Error404 ";
import Home from "./pages/Home";

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
    ],
  },
]);

export default router;
