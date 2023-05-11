import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, notification } from "antd";
import "../Register/register.scss";
import { callLogin } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { doLoginAction } from "../../redux/account/accountSlice";

const Login = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsSubmit(true);
    const { username, password } = values;
    const res = await callLogin(username, password);
    if (res.statusCode === 201) {
      localStorage.setItem("access_token", res.data.access_token);
      dispatch(doLoginAction(res.data.user));
      setIsSubmit(false);
      message.open({
        type: "success",
        content: "Đăng nhập thành công!",
      });
      navigate("/");
    } else {
      setIsSubmit(false);
      notification.error({
        message: res.message,
        placement: "topRight",
      });
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Đăng Nhập</h3>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          labelCol={{ span: 24 }}
          name="username"
          rules={[
            { required: true, message: "Email không được để trống!" },
            { type: "email", message: "Bắt buộc phải là email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          labelCol={{ span: 24 }}
          name="password"
          rules={[{ required: true, message: "Mật khẩu không được để trống!" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <span>
            Bạn chưa có tài khoản?<Link to={"/register"}>Đăng kí</Link>
          </span>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
