import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment/moment";
import React from "react";
import "moment/locale/vi";
moment.locale("vi");

const UserDetail = ({ dataDetail, title, show, onClose }) => {
  const { fullName, email, _id, role, phone, createdAt, updatedAt } = dataDetail
    ? dataDetail
    : {
        fullName: null,
        email: null,
        _id: null,
        role: null,
        phone: null,
        createdAt: null,
        updatedAt: null,
      };
  const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  return (
    <Drawer
      title={title}
      width={"60%"}
      placement="right"
      onClose={onClose}
      open={show}
    >
      {dataDetail ? (
        <Descriptions column={2} bordered>
          <Descriptions.Item label="Id">{_id}</Descriptions.Item>
          <Descriptions.Item label="Tên hiển thị">{fullName}</Descriptions.Item>
          <Descriptions.Item label="Email">{email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{phone}</Descriptions.Item>
          <Descriptions.Item label="Role" span={3}>
            <Badge status="success" text={role} />
          </Descriptions.Item>
          <Descriptions.Item label="CreatedAt">
            {capitalized(
              moment(createdAt).format(
                "dddd, DD [tháng] MM [năm] YYYY, HH:mm:ss a"
              )
            )}
          </Descriptions.Item>
          <Descriptions.Item label="UpdatedAt">{updatedAt}</Descriptions.Item>
        </Descriptions>
      ) : (
        <p>Có lỗi xảy ra!</p>
      )}
    </Drawer>
  );
};

export default UserDetail;
