import { Button, Form, Input, Radio, message, notification } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { callPlaceOrder } from "../../services/api";
import { doPlaceOrder } from "../../redux/order/orderSlice";

const Payment = ({ totalPrice, detail, setStep }) => {
  const user = useSelector((state) => state.account.user);
  const [isSubmit, setIsSubmit] = useState(false);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    setIsSubmit(true);
    const res = await callPlaceOrder({ ...values, detail, totalPrice });
    if (res && res.statusCode === 201) {
      message.success("Đặt hàng thành công!");
      setIsSubmit(false);
      dispatch(doPlaceOrder());
      setStep(3);
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra!",
        description: res.message,
      });
      setIsSubmit(false);
    }
  };
  return (
    <Form
      name="order"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 24 }}
      style={{ maxWidth: 600 }}
      initialValues={{
        name: user.fullName,
        phone: user.phone,
        address: "",
        payment: "COD",
      }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item
        label="Tên người nhận"
        labelCol={{ span: 24 }}
        name="name"
        rules={[
          {
            required: true,
            message: "Tên người nhận không được để trống!",
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        labelCol={{ span: 24 }}
        name="phone"
        rules={[
          {
            required: true,
            message: "Số điện thoại không được để trống!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Địa chỉ"
        labelCol={{ span: 24 }}
        name="address"
        rules={[
          {
            required: true,
            message: "Địa chỉ không được để trống!",
          },
        ]}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        label="Hình thức thanh toán"
        labelCol={{ span: 24 }}
        name="payment"
        rules={[
          {
            required: true,
            message: "Hình thức thanh toán không được để trống!",
          },
        ]}
      >
        <Radio.Group>
          <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button
          disabled={isSubmit}
          loading={isSubmit}
          className="btn btn-solid-red"
          htmlType="submit"
        >
          Thanh toán
        </Button>
      </Form.Item>
    </Form>
  );
};

export default Payment;
