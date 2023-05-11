import {
  Col,
  Form,
  Row,
  message,
  notification,
  Avatar,
  Upload,
  Button,
  Input,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import React from "react";
import { callUpdateUser, callUploadImage } from "../../services/api";
import { useDispatch, useSelector } from "react-redux";
import {
  doSetPreviewAvatar,
  doUpdateUserInfo,
} from "../../redux/account/accountSlice";
import { useState } from "react";
import { useEffect } from "react";

const UpdateInfor = () => {
  const previewAvatar = useSelector((state) => state.account.previewAvatar);
  const user = useSelector((state) => state.account.user);
  const [isSubmit, setIsSubmit] = useState(false);
  const form = Form.useForm()[0];
  const dispatch = useDispatch();

  const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
    const res = await callUploadImage(file, "avatar");
    if (res && res.statusCode === 201) {
      dispatch(doSetPreviewAvatar(res?.data?.fileUploaded));
      form.setFieldValue("avatar", res?.data?.fileUploaded);

      onSuccess("oke");
    } else {
      onError("error");
    }
  };
  const props = {
    name: "file",
    customRequest: handleUploadAvatar,
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== "uploading") {
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  const onFinish = async (values) => {
    setIsSubmit(true);
    const res = await callUpdateUser({
      avatar: previewAvatar,
      _id: user.id,
      fullName: values.fullName,
      phone: values.phone,
    });
    if (res && res.statusCode === 200) {
      dispatch(
        doUpdateUserInfo({
          avatar: previewAvatar,
          fullName: values.fullName,
          phone: values.phone,
        })
      );
      message.success("Cập nhật thông tin thành công!");
      setIsSubmit(false);
    } else {
      notification.error({
        message: "Cập nhật thất bại!",
        description: res.message,
      });
      setIsSubmit(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
    });
  }, []);
  return (
    <Row>
      <Col
        span={12}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          style={{
            marginBottom: "16px",
            border: "1px solid #cecece",
          }}
          size={80}
          src={`${
            import.meta.env.VITE_BASE_URL
          }/images/avatar/${previewAvatar}`}
        />
        <Upload {...props}>
          <Button style={{ width: "100%" }} icon={<UploadOutlined />}>
            Tải lên
          </Button>
        </Upload>
      </Col>
      <Col span={12}>
        <Form
          form={form}
          name="update"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item label="Email" labelCol={{ span: 24 }} name="email">
            <Input readOnly />
          </Form.Item>
          <Form.Item
            label="Họ và tên"
            labelCol={{ span: 24 }}
            name="fullName"
            rules={[
              {
                required: true,
                message: "Tên của bạn không được để trống!",
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
              {
                len: 10,
                message: "Số điện thoại cần ít nhất 10 kí tự!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" loading={isSubmit}>
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default UpdateInfor;
