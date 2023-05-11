import {
  Button,
  Popconfirm,
  Table,
  Typography,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { callDeleteBook, callGetBookPaginate } from "../../../services/api";
import InputSearch from "./InputSearch";
import {
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlinePlus,
} from "react-icons/ai";
import { IoRefreshOutline } from "react-icons/io5";
import * as XLSX from "xlsx";
import moment from "moment";
import BookDetail from "./BookDetail";
import CreateBookModal from "./CreateBookModal";
import BookModalUpdate from "./BookModalUpdate";
const BookTable = () => {
  const [sortingOrder, setSortingOrder] = useState({});
  const [sortingField, setSortingField] = useState("");
  const [sorterString, setSorterString] = useState("&sort=-updatedAt");
  const [dataDetail, setDataDetail] = useState({});
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [filterString, setFilterString] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [flagDataTable, setFlagDataTable] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [dataUpdate, setDataUpdate] = useState({});
  const [loading, setLoading] = useState(true);
  const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);
  const handleDeleteBook = async (id) => {
    const res = await callDeleteBook(id);
    if (res && res.statusCode === 200) {
      message.success("Delete book success!");
      setFlagDataTable(!flagDataTable);
    } else {
      notification.error({
        message: res.message,
        placement: "topRight",
      });
    }
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
      title: "Tên sách",
      dataIndex: "mainText",
      sorter: true,
      sortOrder: sortingField === "mainText" && sortingOrder,
    },
    {
      title: "Thể Loại",
      dataIndex: "category",
      sorter: true,
      sortOrder: sortingField === "category" && sortingOrder,
    },
    {
      title: "Tác giả",
      dataIndex: "author",
      sorter: true,
      sortOrder: sortingField === "author" && sortingOrder,
    },
    {
      title: "Giá tiền",
      dataIndex: "price",
      sorter: true,
      sortOrder: sortingField === "price" && sortingOrder,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sortOrder: sortingField === "updatedAt" && sortingOrder,
      sorter: true,
    },
    {
      title: "Action",
      render: (_, record) => {
        return (
          <>
            <Typography.Link
              onClick={() => {
                setDataUpdate(record);
                setUpdateModal(true);
              }}
            >
              <AiFillEdit color="yellow" />
            </Typography.Link>
            <Typography.Link>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDeleteBook(record._id)}
              >
                <AiOutlineDelete color="red" />
              </Popconfirm>
            </Typography.Link>
          </>
        );
      },
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
  const exportFileCsv = () => {
    const ws = XLSX.utils.json_to_sheet(dataSource);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, "ExportBook.csv");
  };

  useEffect(() => {
    const getBook = async () => {
      setLoading(true);
      const query =
        `current=${current}&pageSize=${pageSize}` + filterString + sorterString;
      const res = await callGetBookPaginate(query);
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
    getBook();
  }, [pageSize, current, filterString, sorterString, flagDataTable]);
  const renderHeaderTable = () => {
    return (
      <div className="table__nav">
        <h4>Table List User</h4>
        <div className="table__nav-btn-group">
          <Button
            onClick={exportFileCsv}
            className="table__nav-btn"
            type="primary"
          >
            <AiOutlineExport style={{ marginRight: "4px" }} />
            Export
          </Button>
          <Button
            onClick={() => setCreateModal(true)}
            className="table__nav-btn"
            type="primary"
          >
            <AiOutlinePlus style={{ marginRight: "4px" }} />
            Thêm mới
          </Button>
          <Button
            onClick={() => {
              setSorterString("");
              setSortingField(null);
              setSortingOrder(null);
            }}
            className="table__nav-btn"
          >
            <IoRefreshOutline size={18} style={{ marginRight: "4px" }} />
          </Button>
        </div>
      </div>
    );
  };
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

  return (
    <>
      <InputSearch
        onSubmit={setFilterString}
        handleClear={() => setFilterString("")}
      />
      <Table
        title={renderHeaderTable}
        loading={loading}
        bordered
        dataSource={dataSource}
        columns={columns}
        onChange={onChange}
        pagination={pagination}
      />
      \
      <BookDetail
        show={isShowDetail}
        dataDetail={dataDetail}
        onClose={() => setIsShowDetail(false)}
        title={"Thông tin sách"}
      />
      <CreateBookModal
        onClose={() => setCreateModal(false)}
        open={createModal}
        reloadTable={() => setFlagDataTable(!flagDataTable)}
      />
      <BookModalUpdate
        dataUpdate={dataUpdate}
        onClose={() => setUpdateModal(false)}
        open={updateModal}
        reloadTable={() => setFlagDataTable(!flagDataTable)}
      />
    </>
  );
};
export default BookTable;
