import React from "react";
import { useState } from "react";
import { callChangePassword } from "../../services/api";
import { Col, Form, Input, Row, message, notification, Button } from "antd";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const formChangPassword = Form.useForm()[0];
  const user = useSelector((state) => state.account.user);

  const [isSubmitChangePassword, setIsSubmitChangePassword] = useState(false);

  const handleChangePassword = async (values) => {
    setIsSubmitChangePassword(true);
    const res = await callChangePassword(values);
    if (res && res.statusCode === 201) {
      message.success("Đổi mật khẩu thành công!");
      formChangPassword.setFieldValue("oldpass", "");
      formChangPassword.setFieldValue("newpass", "");
      setIsSubmitChangePassword(false);
    } else {
      notification.error({
        message: "Đổi mật khẩu thất bại!",
        description: res.message,
      });
      setIsSubmitChangePassword(false);
    }
  };
  useEffect(() => {
    formChangPassword.setFieldsValue({
      email: user.email,
      oldpass: "",
      newpass: "",
    });
  }, []);
  return (
    <Row>
      <Col span={24}>
        <Form
          form={formChangPassword}
          name="update"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          onFinish={handleChangePassword}
          autoComplete="off"
        >
          <Form.Item label="Email" labelCol={{ span: 24 }} name="email">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Mật khẩu hiện tại"
            labelCol={{ span: 24 }}
            name="oldpass"
            rules={[
              {
                required: true,
                message: "Mật khẩu hiện tại của bạn không được để trống!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Mật khẩu mới"
            labelCol={{ span: 24 }}
            name="newpass"
            rules={[
              {
                required: true,
                message: "Mật khẩu mới không được để trống!",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitChangePassword}
            >
              Đổi mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default ChangePassword;
