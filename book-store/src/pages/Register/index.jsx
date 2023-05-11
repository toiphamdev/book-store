import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, notification } from "antd";
import "./register.scss";
import { callRegister } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (values) => {
    setIsSubmit(true);
    const { fullName, email, password, phone } = values;
    const res = await callRegister(fullName, email, password, phone);
    if (res.statusCode === 201) {
      setIsSubmit(false);
      message.open({
        type: "success",
        content: "Đăng kí thành công!",
      });
      navigate("/login");
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
      <h3 className="form-title">Đăng kí</h3>
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
          label="Họ và tên"
          labelCol={{ span: 24 }}
          name="fullName"
          rules={[
            { required: true, message: "Tên của bạn không được để trống!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          labelCol={{ span: 24 }}
          name="email"
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

        <Form.Item
          label="Số điện thoại"
          labelCol={{ span: 24 }}
          name="phone"
          rules={[
            { required: true, message: "Số điện thoại không được để trống!" },
            // { type: "number", message: "Chỉ được nhập số!" },
            {
              len: 10,
              message: "Số điện thoại cần ít nhất 10 kí tự!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <span>
            Bạn đã có tài khoản?<Link to={"/login"}>Đăng nhập</Link>
          </span>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" loading={isSubmit}>
            Đăng kí
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
