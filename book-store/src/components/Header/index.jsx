import {
  Layout,
  Input,
  Menu,
  Badge,
  Avatar,
  Dropdown,
  Drawer,
  message,
  Popover,
  Empty,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { FaReact } from "react-icons/fa";
import { AiOutlineUnorderedList } from "react-icons/ai";
import "./header.scss";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { callLogout } from "../../services/api";
import { doLogoutAction } from "../../redux/account/accountSlice";
import { useNavigate } from "react-router-dom";
import UserUpdateModal from "../user/UserUpdateModal";
const { Header } = Layout;

const AppHeader = ({ searchText, setSearchText, setSearchTemp }) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  const carts = useSelector((state) => state.order.carts);
  const user = useSelector((state) => state.account.user);
  const [open, setOpen] = useState(false);
  const [userUpdateModal, setUserUpdateModal] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
  const menu = isAuthenticated ? (
    <Menu>
      {user.role === "ADMIN" && (
        <Menu.Item
          onClick={() => {
            navigate("/admin");
          }}
          key="1"
        >
          Trang quản trị
        </Menu.Item>
      )}

      <Menu.Item
        onClick={() => {
          setUserUpdateModal(true);
        }}
        key="2"
      >
        Quản lí tài khoản
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          navigate("/history");
        }}
        key="3"
      >
        Lịch sử mua hàng
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          handleLogout();
        }}
        key="5"
      >
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
    <>
      <Header className="header" style={{ backgroundColor: "#fff" }}>
        <div className="header__logo" onClick={() => navigate("/")}>
          <FaReact className="header__logo-icon" size={24} />
          toiphamdev
        </div>
        <div className="header__mobile-list">
          <button onClick={showDrawer}>
            <AiOutlineUnorderedList />
          </button>
          <Drawer
            title="Menu chức năng"
            placement="left"
            onClose={onClose}
            style={{ zIndex: 10000 }}
            open={open}
          >
            {isAuthenticated ? (
              <Menu>
                {user.role === "ADMIN" && (
                  <Menu.Item
                    onClick={() => {
                      navigate("/admin");
                      setOpen(false);
                    }}
                    key="1"
                  >
                    Trang quản trị
                  </Menu.Item>
                )}
                <Menu.Item
                  onClick={() => {
                    navigate("/");
                    setOpen(false);
                  }}
                  key="6"
                >
                  Trang chủ
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    setUserUpdateModal(true);
                  }}
                  key="2"
                >
                  Quản lí tài khoản
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    navigate("/history");
                    setOpen(false);
                  }}
                  key="3"
                >
                  Lịch sử mua hàng
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  key="5"
                >
                  Đăng xuất
                </Menu.Item>
              </Menu>
            ) : (
              <Menu>
                <Menu.Item
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  key="1"
                >
                  Đăng nhập
                </Menu.Item>
                <Menu.Item
                  onClick={() => {
                    navigate("/register");
                    setOpen(false);
                  }}
                  key="2"
                >
                  Đăng kí
                </Menu.Item>
              </Menu>
            )}
          </Drawer>
        </div>
        <Input.Search
          value={searchText}
          className="header__search header__window"
          placeholder="Tìm kiếm"
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => setSearchTemp(searchText)}
        />
        <Input.Search
          value={searchText}
          className="header__search header__tablet"
          placeholder="Tìm kiếm"
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => setSearchTemp(searchText)}
        />
        <Input
          value={searchText}
          className="header__search header__mobile"
          placeholder="Tìm kiếm"
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={(key) => {
            if (key.code === "Enter") {
              setSearchTemp(searchText);
            }
          }}
        />
        <Popover
          placement="bottom"
          title={"Sản phẩm mới thêm"}
          content={
            carts.length > 0 ? (
              <div>
                {carts.map((item, index) => {
                  return (
                    <div key={index} className="popup-item">
                      <img
                        style={{ width: "48px" }}
                        src={`${import.meta.env.VITE_BASE_URL}/images/book/${
                          item?.detail?.thumbnail
                        }`}
                      />
                      <span>{item?.detail?.mainText}</span>
                      <span className="popup-price">
                        {item?.detail?.price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                  );
                })}
                <div className="btn-wrapper-end">
                  <button
                    onClick={() => navigate("/order")}
                    className="btn-solid-red"
                    style={{ padding: "4px 8px" }}
                  >
                    Xem giỏ hàng
                  </button>
                </div>
              </div>
            ) : (
              <Empty
                description={<span>Chưa có sản phẩm trong giỏ hàng</span>}
              />
            )
          }
          trigger="hover"
        >
          <Badge showZero className="header__cart" count={carts.length}>
            <ShoppingCartOutlined
              style={{ fontSize: "20px", cursor: "pointer" }}
            />
          </Badge>
        </Popover>
        <Dropdown className="header__subnav" overlay={menu}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              className="header__window"
              src={`${import.meta.env.VITE_BASE_URL}/images/avatar/${
                user.avatar
              }`}
            />
            <Avatar
              className="header__tablet "
              src={`${import.meta.env.VITE_BASE_URL}/images/avatar/${
                user.avatar
              }`}
            />
            <span className="header__window">{user.fullName}</span>
          </div>
        </Dropdown>
      </Header>
      <UserUpdateModal
        open={userUpdateModal}
        close={() => setUserUpdateModal(false)}
        getContainer={() => document.querySelector(".ant-drawer-content")}
      />
    </>
  );
};
export default AppHeader;
