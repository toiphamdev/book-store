import { Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NotPermitted = () => {
  return (
    <Result
      status="403"
      title="403"
      subTitle="Xin lỗi, bạn không có quyền truy cập."
      extra={
        <Link to="/" type="primary">
          Về trang chủ
        </Link>
      }
    />
  );
};

export default NotPermitted;
