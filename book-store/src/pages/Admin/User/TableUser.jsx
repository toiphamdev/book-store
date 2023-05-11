import {
  Avatar,
  Button,
  Form,
  Input,
  Popconfirm,
  Table,
  Typography,
  message,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import {
  callDeleteUser,
  callGetUserPaginate,
  callRegister,
  callUpdateUser,
} from "../../../services/api";
import InputSearch from "./InputSearch";
import {
  AiFillEdit,
  AiOutlineDelete,
  AiOutlineExport,
  AiOutlineImport,
  AiOutlinePlus,
} from "react-icons/ai";
import { IoRefreshOutline } from "react-icons/io5";
import UserDetail from "./UserDetail";
import UserImport from "./data/UserImport";
import * as XLSX from "xlsx";
import CreateUserModal from "./CreateUserModal";
import moment from "moment";
const TableUser = () => {
  const [sortingOrder, setSortingOrder] = useState({});
  const [sortingField, setSortingField] = useState("");
  const [sorterString, setSorterString] = useState("");
  const [dataDetail, setDataDetail] = useState({});
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const [total, setTotal] = useState(0);
  const [dataSource, setDataSource] = useState([]);
  const [filterString, setFilterString] = useState("");
  const [createModal, setCreateModal] = useState(false);
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const [flagDataTable, setFlagDataTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    form.setFieldsValue({
      _id: record._id,
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey("");
  };
  const save = async (key) => {
    try {
      form.validateFields();
      const res = await callUpdateUser(form.getFieldsValue());
      if (res && res.statusCode === 200) {
        message.success("Update user success");
        form.resetFields();
        setEditingKey("");
        setFlagDataTable(!flagDataTable);
      } else {
        notification.error({
          message: res.message,
          placement: "topRight",
        });
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const [importModal, setImportModal] = useState(false);
  const handleDeleteUser = async (id) => {
    const res = await callDeleteUser(id);
    if (res && res.statusCode === 200) {
      message.success("Delete user success!");
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
      title: "Avatar",
      dataIndex: "avatar",
      editable: true,
      render: (text, record) => {
        return (
          <Avatar
            src={`${import.meta.env.VITE_BASE_URL}/images/avatar/${text}`}
          />
        );
      },
    },
    {
      title: "Tên hiển thị",
      dataIndex: "fullName",
      sorter: true,
      sortOrder: sortingField === "fullName" && sortingOrder,
      editable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: true,
      sortOrder: sortingField === "email" && sortingOrder,
      editable: true,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      sortOrder: sortingField === "updatedAt" && sortingOrder,
      sorter: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      sortOrder: sortingField === "phone" && sortingOrder,
      sorter: true,
      editable: true,
    },
    {
      title: "Action",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <div style={{ minWidth: "80px" }}>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </div>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <AiFillEdit color="yellow" />
            </Typography.Link>
            <Typography.Link>
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => handleDeleteUser(record._id)}
              >
                <AiOutlineDelete color="red" />
              </Popconfirm>
            </Typography.Link>
          </>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

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
    XLSX.writeFile(wb, "ExportUser.csv");
  };
  const capitalized = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const query =
        `current=${current}&pageSize=${pageSize}` + filterString + sorterString;
      const res = await callGetUserPaginate(query);
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
    getUser();
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
            onClick={() => setImportModal(true)}
            className="table__nav-btn"
            type="primary"
          >
            <AiOutlineImport style={{ marginRight: "4px" }} />
            Import
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
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode =
      dataIndex === "avatar" ? (
        <Avatar
          src={`${import.meta.env.VITE_BASE_URL}/images/avatar/${
            record.avatar
          }`}
        />
      ) : (
        <Input
          disabled={dataIndex === "_id" || dataIndex === "email" ? true : false}
        />
      );
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
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
      <Form form={form} component={false}>
        <Table
          title={renderHeaderTable}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          loading={loading}
          bordered
          dataSource={dataSource}
          columns={mergedColumns}
          rowClassName="editable-row"
          onChange={onChange}
          pagination={pagination}
        />
      </Form>
      <UserDetail
        show={isShowDetail}
        dataDetail={dataDetail}
        onClose={() => setIsShowDetail(false)}
        title={"Chi tiết người dùng"}
      />
      <CreateUserModal
        onClose={() => setCreateModal(false)}
        reloadTable={() => setFlagDataTable(!flagDataTable)}
        open={createModal}
      />
      <UserImport open={importModal} onClose={() => setImportModal(false)} />
    </>
  );
};
export default TableUser;
