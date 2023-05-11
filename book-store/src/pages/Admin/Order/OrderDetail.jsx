import { Badge, Descriptions, Drawer } from "antd";
import moment from "moment/moment";
import React from "react";
import "moment/locale/vi";
import ReactJson from "react-json-view";
moment.locale("vi");

const OrderDetail = ({ dataDetail, title, show, onClose }) => {
  const {
    _id,
    name,
    address,
    totalPrice,
    phone,
    detail,
    createdAt,
    updatedAt,
  } = dataDetail;

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
        <>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Id">{_id}</Descriptions.Item>
            <Descriptions.Item label="Tên khách hàng">{name}</Descriptions.Item>
            <Descriptions.Item label="Số ddienj thoại">
              {phone}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {totalPrice &&
                totalPrice.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ giao hàng" span={3}>
              {address}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đơn hàng" span={3}>
              <Badge status="success" text={"Thành công"} />
            </Descriptions.Item>
            <Descriptions.Item label="Chi tiết đơn hàng" span={3}>
              <ReactJson
                collapsed
                displayDataTypes={false}
                name={""}
                src={detail}
              />
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
        </>
      ) : (
        <p>Có lỗi xảy ra!</p>
      )}
    </Drawer>
  );
};

export default OrderDetail;
