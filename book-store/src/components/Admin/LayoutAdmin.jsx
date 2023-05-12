import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import "./style.scss";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AiFillBook, AiOutlineAppstore } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { callLogout } from "../../services/api";
import UserUpdateModal from "../user/UserUpdateModal";
import { useEffect } from "react";
const { Header, Sider, Content } = Layout;
const LayoutAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const user = useSelector((state) => state.account.user);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [userUpdateModal, setUserUpdateModal] = useState(false);
  const path = useLocation().pathname;
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    const res = await callLogout();
    if (res && res.statusCode === 201) {
      dispatch(doLogoutAction());
      message.open({
        type: "success",
        content: "Đăng xuất thành công!",
      });
      navigate("/");
    }
  };
  useEffect(() => {
    if (path === "/admin/user") {
      setActiveMenu("user");
    }
    if (path === "/admin/book") {
      setActiveMenu("book");
    }
    if (path === "/admin/order") {
      setActiveMenu("order");
    }
    if (path === "/admin") {
      setActiveMenu("dashboard");
    }
  }, [path]);
  const menu = isAuthenticated ? (
    <Menu>
      <Menu.Item
        onClick={() => {
          setUserUpdateModal(true);
        }}
        key="2"
      >
        Quản lí tài khoản
      </Menu.Item>
      <Menu.Item onClick={() => navigate("/history")} key="3">
        Lịch sử mua hàng
      </Menu.Item>
      <Menu.Item onClick={handleLogout} key="5">
        Đăng xuất
      </Menu.Item>
    </Menu>
  ) : (
    <Menu>
      <Menu.Item
        onClick={() => {
          navigate("/login");
        }}
        key="1"
      >
        Đăng nhập
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          navigate("/register");
        }}
        key="2"
      >
        Đăng kí
      </Menu.Item>
    </Menu>
  );
  return (
    <Layout>
      <Sider theme="light" trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeMenu]}
          items={[
            {
              key: "dashboard",
              icon: <AiOutlineAppstore />,
              label: <Link to={"/admin"}>Dash board</Link>,
            },
            {
              key: "user",
              icon: <UserOutlined />,
              label: <Link to={"/admin/user"}>Manage Users</Link>,
            },
            {
              key: "book",
              icon: <AiFillBook />,
              label: <Link to={"/admin/book"}>Manage Books</Link>,
            },
            {
              key: "order",
              icon: <RiMoneyDollarCircleLine />,
              label: <Link to={"/admin/order"}>Manage Orders</Link>,
            },
          ]}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: " 0 20px",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
          <Dropdown className="header__subnav" overlay={menu}>
            <div>
              <Avatar
                src={`${import.meta.env.VITE_BASE_URL}/images/avatar/${
                  user.avatar
                }`}
              />
              <span>{user.fullName}</span>
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
            background: colorBgContainer,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
      <UserUpdateModal
        open={userUpdateModal}
        close={() => setUserUpdateModal(false)}
      />
    </Layout>
  );
};
export default LayoutAdmin;
