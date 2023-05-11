import { Card, Col, Row, Statistic } from "antd";
import React from "react";
import { useEffect } from "react";
import CountUp from "react-countup";
import { callGetDashBoard } from "../../services/api";
import { useState } from "react";

const AdminDashboard = () => {
  const [countOrder, setCountOrder] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const formatter = (value) => <CountUp end={value} separator="," />;
  useEffect(() => {
    const getDashBoard = async () => {
      const res = await callGetDashBoard();
      if (res && res.statusCode === 200) {
        setCountOrder(res.data.countOrder);
        setCountUser(res.data.countUser);
      }
    };
    getDashBoard();
  }, []);
  return (
    <Row gutter={32} style={{ display: "flex", justifyContent: "center" }}>
      <Col span={10}>
        <Card style={{ width: "100%" }}>
          <Statistic
            title="Tổng người dùng"
            value={countUser}
            formatter={formatter}
          />
        </Card>
      </Col>
      <Col span={10}>
        <Card style={{ width: "100%" }}>
          <Statistic
            title="Tổng đơn hàng"
            value={countOrder}
            precision={2}
            formatter={formatter}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AdminDashboard;
