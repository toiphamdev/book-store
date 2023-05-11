import { Form, Input, Modal, message, notification } from "antd";
import React, { useState } from "react";
import { callRegister } from "../../../services/api";

const CreateUserModal = ({ open, onClose, reloadTable }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const form = Form.useForm()[0];
  const onFinish = async (values) => {
    setIsSubmit(true);
    const { fullName, email, password, phone } = values;
    const res = await callRegister(fullName, email, password, phone);
    if (res.statusCode === 201) {
      setIsSubmit(false);
      onClose();
      form.resetFields();
      reloadTable();
      message.open({
        type: "success",
        content: "Đăng kí thành công!",
      });
    } else {
      setIsSubmit(false);
      notification.error({
        message: res.message,
        placement: "topRight",
      });
    }
  };
  return (
    <Modal
      title={"Thêm mới người dùng."}
      open={open}
      onCancel={() => {
        onClose();
        setIsSubmit(false);
        form.resetFields();
      }}
      onOk={() => {
        form.submit();
      }}
      confirmLoading={isSubmit}
    >
      <Form
        form={form}
        name="create-user"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
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
          rules={[{ required: true, message: "Email không được để trống!" }]}
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
      </Form>
    </Modal>
  );
};

export default CreateUserModal;
