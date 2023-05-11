import { Col, Row, Table } from "antd";
import React from "react";
import { useState } from "react";
import InputSearch from "./InputSearch";
import { callOrdersPaginate } from "../../../services/api";
import { useEffect } from "react";
import moment from "moment";
import OrderDetail from "./OrderDetail";

function Order() {
  const [dataSource, setDataSource] = useState([]);
  const [dataDetail, setDataDetail] = useState({});
  const [sortingOrder, setSortingOrder] = useState({});
  const [sortingField, setSortingField] = useState("");
  const [sorterString, setSorterString] = useState("&sort=-updatedAt");
  const [filterString, setFilterString] = useState("");
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(1);
  const [isShowDetail, setIsShowDetail] = useState(false);

  const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const renderShowDetailPaginateTable = (total, range) => {
    return (
      <div>
        {range[0]} - {range[1]} trên {total} rows
      </div>
    );
  };
  const pagination = {
    pageSize: pageSize, // Số phần tử trên mỗi trang
    total: total, // Tổng số phần tử
    showSizeChanger: true, // Cho phép người dùng chọn số phần tử trên mỗi trang
    pageSizeOptions: ["5", "10", "20", "50"], // Các lựa chọn số phần tử trên mỗi trang
    showTotal: renderShowDetailPaginateTable,
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
      render: (text, record, index) => {
        return (
          <a
            onClick={(e) => {
              e.preventDefault();
              setDataDetail(record);
              setIsShowDetail(true);
            }}
          >
            {text}
          </a>
        );
      },
      editable: true,
    },

    {
      title: "Giá tiền",
      dataIndex: "totalPrice",
      sorter: true,
      sortOrder: sortingField === "totalPrice" && sortingOrder,
      render: (text, record) => {
        return (
          <span>
            {text.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        );
      },
    },
    {
      title: "Tên",
      dataIndex: "name",
      sorter: true,
      sortOrder: sortingField === "name" && sortingOrder,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
    },
    {
      title: "Số điện thoại",
      dataIndex: "price",
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sortOrder: sortingField === "updatedAt" && sortingOrder,
      sorter: true,
    },
  ];
  const onChange = (pagination, filters, sorter, extra) => {
    if (pagination && pagination.current !== current) {
      setCurrent(pagination.current);
    }
    if (pagination && pagination.pageSize !== pageSize) {
      setPageSize(pagination.pageSize);
    }
    if (sorter) {
      let sorterString = "";

      if (sorter.order === "ascend") {
        sorterString = sorterString + `&sort=${sorter.field}`;
      }
      if (sorter.order === "descend") {
        sorterString = sorterString + `&sort=-${sorter.field}`;
      }
      setSortingOrder(sorter.order);
      setSortingField(sorter.field);
      setSorterString(sorterString);
    }
  };

  useEffect(() => {
    const getOrders = async () => {
      setLoading(true);
      const query =
        `current=${current}&pageSize=${pageSize}` + filterString + sorterString;
      const res = await callOrdersPaginate(query);
      if (res && res.statusCode === 200) {
        setDataSource(
          res.data?.result.map((item, index) => {
            item.updatedAt = capitalized(
              moment(item.updatedAt).format(
                "dddd, DD [tháng] MM [năm] YYYY, HH:mm:ss a"
              )
            );
            return {
              key: index,
              ...item,
            };
          })
        );
        setLoading(false);
        setTotal(res.data.meta.total);
      }
    };
    getOrders();
  }, [pageSize, current, filterString, sorterString]);
  return (
    <Row>
      <Col span={24}>
        <InputSearch
          onSubmit={setFilterString}
          handleClear={() => setFilterString("")}
        />
      </Col>
      <Col span={24}>
        <Table
          title={() => "Table List Orders"}
          loading={loading}
          bordered
          dataSource={dataSource}
          columns={columns}
          onChange={onChange}
          pagination={pagination}
        />
      </Col>
      <OrderDetail
        dataDetail={dataDetail}
        show={isShowDetail}
        title={"Chi tiết đơn hàng"}
        onClose={() => setIsShowDetail(false)}
      />
    </Row>
  );
}

export default Order;
