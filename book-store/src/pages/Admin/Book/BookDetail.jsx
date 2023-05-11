import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from "antd";
import moment from "moment/moment";
import React, { useState } from "react";
import "moment/locale/vi";
moment.locale("vi");

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const BookDetail = ({ dataDetail, title, show, onClose }) => {
  const {
    mainText,
    author,
    thumbnail,
    slider = [],
    _id,
    price,
    category,
    createdAt,
    updatedAt,
  } = dataDetail
    ? dataDetail
    : {
        mainText: null,
        author: null,
        _id: null,
        price: 0,
        category: null,
        createdAt: null,
        updatedAt: null,
        thumbnail: "",
        slider: [],
      };
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const images = [...slider, thumbnail];
  const fileList = slider.map((item) => {
    return {
      url: `${import.meta.env.VITE_BASE_URL}/images/book/${item}`,
    };
  });
  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
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
        <>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Id">{_id}</Descriptions.Item>
            <Descriptions.Item label="Tên sách">{mainText}</Descriptions.Item>
            <Descriptions.Item label="Tác giả">{author}</Descriptions.Item>
            <Descriptions.Item label="Giá tiền">
              {price &&
                price.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
            </Descriptions.Item>
            <Descriptions.Item label="Thể loại" span={3}>
              <Badge status="processing" text={category} />
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
          <Divider orientation={"left"}>Ảnh sách</Divider>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            showUploadList={{
              showRemoveIcon: false,
            }}
          ></Upload>
          <Modal
            open={previewOpen}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </>
      ) : (
        <p>Có lỗi xảy ra!</p>
      )}
    </Drawer>
  );
};

export default BookDetail;
