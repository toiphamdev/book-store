import { Table, Tabs, Tag } from "antd";
import React, { useEffect, useState } from "react";
import { callViewHistory } from "../../services/api";
import ReactJson from "react-json-view";
import moment from "moment";

const ViewOrderHistory = () => {
  const [loading, setLoading] = useState(true);
  const columns = [
    {
      title: "STT",
      dataIndex: "key",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalPrice",
      render: (text, record) => {
        return (
          <span>
            {record?.totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (text, record) => {
        return <Tag color="green">{text}</Tag>;
      },
    },
    {
      title: "Chi tiết",
      dataIndex: "detail",
      render: (text, record) => {
        return (
          <ReactJson
            displayDataTypes={false}
            collapsed
            name={"Chi tiết đơn hàng"}
            src={text}
          />
        );
      },
    },
  ];
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    setLoading(true);
    const getHistory = async () => {
      const res = await callViewHistory();
      if (res && res.statusCode === 200) {
        const dataTable = res?.data?.length
          ? res.data.map((item, index) => {
              return {
                key: index,
                createdAt: moment(item.createdAt).format(" DD/MM/YYYY, HH:mm"),
                totalPrice: item.totalPrice,
                detail: item.detail,
                status: "Thành công",
              };
            })
          : [];
        setDataSource(dataTable);
      }
      setLoading(false);
    };
    getHistory();
  }, []);

  return (
    <div>
      <h5>Lịch sử đặt hàng</h5>
      <Table
        dataSource={dataSource}
        style={{ width: "100%", fontSize: "12px", overflowX: "auto" }}
        loading={loading}
        columns={columns}
        pagination={false}
      />
    </div>
  );
};

export default ViewOrderHistory;
