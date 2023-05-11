import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Footer from "./components/Footer";
import Register from "./pages/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { callGetAccount } from "./services/api";
import { doGetAccountAction } from "./redux/account/accountSlice";
import Loading from "./components/Loading";
import NotFound from "./components/NotFound";
import Home from "./pages/Home";
import AdminDashboard from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import AppHeader from "./components/Header";
import LayoutAdmin from "./components/Admin/LayoutAdmin";
import Order from "./pages/Admin/Order";
import TableUser from "./pages/Admin/User/TableUser";
import BookTable from "./pages/Admin/Book/BookTable";
import BookPage from "./pages/Book";
import "./styles/global/globalStyles.scss";
import OrderPage from "./pages/Order";
import ViewOrderHistory from "./pages/Order/ViewOrderHistory";

const Layout = () => {
  const [searchTemp, setSearchTemp] = useState("");
  const [searchText, setSearchText] = useState("");
  return (
    <div
      style={{
        display: "flex",
        minHeight: "98vh",
        flexDirection: "column",
        backgroundColor: "#efefef",
        justifyContent: "space-between",
      }}
    >
      <div>
        <AppHeader
          searchText={searchText}
          setSearchText={setSearchText}
          setSearchTemp={setSearchTemp}
        />
        <div>
          <Outlet context={{ searchTemp, setSearchText, setSearchTemp }} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.account.isLoading);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      errorElement: <NotFound />,
      children: [
        { index: true, element: <Home /> },
        { path: "contact", element: <Contact /> },
        { path: "book/:slug", element: <BookPage /> },
        {
          path: "order",
          element: (
            <ProtectedRoute role={"USER"}>
              <OrderPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "history",
          element: (
            <ProtectedRoute role={"USER"}>
              <ViewOrderHistory />
            </ProtectedRoute>
          ),
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/admin",
      element: <LayoutAdmin />,
      errorElement: <NotFound />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "user",
          element: (
            <ProtectedRoute>
              <TableUser />
            </ProtectedRoute>
          ),
        },
        {
          path: "book",
          element: (
            <ProtectedRoute>
              <BookTable />
            </ProtectedRoute>
          ),
        },
        {
          path: "order",
          element: (
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);
  useEffect(() => {
    const getAccount = async () => {
      if (
        window.location.pathname === "/login" ||
        window.location.pathname === "/register"
      )
        return;
      const res = await callGetAccount();
      if (res.statusCode === 200) {
        dispatch(doGetAccountAction(res.data.user));
      }
    };
    getAccount();
  }, []);

  return (
    <>
      {isLoading === false ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/" ? (
        <RouterProvider router={router} />
      ) : (
        <Loading />
      )}
    </>
  );
}

export default App;
