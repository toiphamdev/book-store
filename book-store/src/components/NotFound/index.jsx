import { Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang này không tồn tại."
      extra={
        <Link to="/" type="primary">
          Về trang chủ
        </Link>
      }
    />
  );
};

export default NotFound;
