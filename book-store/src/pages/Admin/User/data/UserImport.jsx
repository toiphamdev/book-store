import React, { useState } from "react";
import { callCreateListUsers } from "../../../../services/api";
import { Modal, Table, message, notification } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import Dragger from "antd/es/upload/Dragger";
import templateFile from "./template.xlsx?url";

const UserImport = ({ open, onClose }) => {
  const [dataExcel, setDataExcel] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const dummyRequest = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 1000);
  };
  const readFileExcel = (file) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, {
        header: ["fullName", "email", "phone"],
        range: 1,
      });
      setDataExcel(
        jsonData.map((item, index) => {
          return {
            key: index,
            ...item,
          };
        })
      );
    };
    reader.readAsBinaryString(file.originFileObj);
  };
  const propsDragger = {
    name: "file",
    customRequest: dummyRequest,
    onChange: (info) => {
      const { status } = info.file;
      const data = [];
      data.push({
        key: 1,
        ...info.file,
      });
      setFileList(data);
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        readFileExcel(info.file);

        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }

      if (status === "removed") {
        setDataExcel([]);
        setFileList([]);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };
  const onSumitImportExcel = async () => {
    setIsSubmit(true);
    const createData = dataExcel.map((item) => {
      return {
        ...item,
        password: "123456",
      };
    });
    const res = await callCreateListUsers(createData);
    if (res.statusCode === 201) {
      setIsSubmit(false);
      onClose();
      message.success({
        content: `Thành công: ${res.data.countSuccess}, Thất bại: ${res.data.countError}`,
      });
    } else {
      setIsSubmit(false);
      notification.error({
        message: res.message,
        placement: "topRight",
      });
    }
  };
  return (
    <Modal
      title={"Import data user"}
      open={open}
      onCancel={() => {
        onClose();
        setFileList([]);
        setDataExcel([]);
      }}
      okButtonProps={{
        disabled: dataExcel.length < 1,
      }}
      okText={"Import"}
      onOk={onSumitImportExcel}
      maskClosable={false}
      confirmLoading={isSubmit}
    >
      <Dragger
        {...propsDragger}
        multiple={false}
        fileList={fileList}
        maxCount={1}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single such as .csv, xls, xlsx or{" "}
          <a
            href={templateFile}
            onClick={(e) => {
              e.stopPropagation();
            }}
            download
          >
            Download Sample File
          </a>
        </p>
      </Dragger>

      <p>Dữ liệu upload:</p>
      <Table
        columns={[
          {
            title: "Tên hiển thị",
            dataIndex: "fullName",
          },
          {
            title: "Email",
            dataIndex: "email",
          },
          {
            title: "Số điện thoại",
            dataIndex: "phone",
          },
        ]}
        dataSource={dataExcel}
      />
    </Modal>
  );
};

export default UserImport;
