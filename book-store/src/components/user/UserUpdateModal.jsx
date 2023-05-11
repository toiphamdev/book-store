import { Modal, Row, Tabs } from "antd";
import React from "react";
import UpdateInfor from "./UpdateInfor";
import ChangePassword from "./ChangePassword";

const UserUpdateModal = ({ open, close, getContainer }) => {
  const items = [
    {
      key: "1",
      label: "Cập nhật thông tin",
      children: <UpdateInfor />,
    },
    {
      key: "2",
      label: "Đổi mật khẩu",
      children: <ChangePassword />,
    },
  ];

  return (
    <div>
      <Modal
        title={"Quản lí tài khoản"}
        closable={true}
        cancelButtonProps={true}
        footer={false}
        style={{ width: "96%", top: "32px" }}
        open={open}
        onCancel={close}
      >
        <Row span={24}>
          <Tabs items={items} defaultActiveKey="1" />
        </Row>
      </Modal>
    </div>
  );
};

export default UserUpdateModal;
