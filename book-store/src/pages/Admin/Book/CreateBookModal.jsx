import {
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  Row,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  callCreateBook,
  callGetBookCategory,
  callUploadImage,
} from "../../../services/api";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

const CreateBookModal = ({ open, onClose, reloadTable }) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const [bookCategories, setBookCategories] = useState([]);
  const [loadingThumbnail, setLoadingThumbnail] = useState(false);
  const [imageUrlThumbNail, setImageUrlThumbNail] = useState();
  const [loadingSlider, setLoadingSlider] = useState(false);
  const [fileListSlider, setFileListSlider] = useState([]);
  const [previewImageSlider, setPreviewImageSlider] = useState("");
  const [previewTitleSlider, setPreviewTitleSlider] = useState("");
  const [previewOpenSlider, setPreviewOpenSlider] = useState(false);
  const [dataThumbnail, setDataThumbnail] = useState([]);
  const [dataSlider, setDataSlider] = useState([]);
  const handleCancel = () => setPreviewOpenSlider(false);
  const form = Form.useForm()[0];

  const handleUploadThumbnail = async ({ file, onSuccess, onError }) => {
    const res = await callUploadImage(file, "book");
    if (res && res.statusCode === 201) {
      setDataThumbnail([
        {
          name: res.data.fileUploaded,
          uid: file.uid,
        },
      ]);

      onSuccess("oke");
    } else {
      onError("error");
    }
  };
  const handleUploadSlider = async ({ file, onSuccess, onError }) => {
    const res = await callUploadImage(file, "book");
    if (res && res.statusCode === 201) {
      setDataSlider((prevState) => [
        ...prevState,
        {
          uid: file.uid,
          name: res.data.fileUploaded,
        },
      ]);
      onSuccess("ok");
    } else {
      onError("error");
    }
  };
  const handleRemoveFile = (file, type) => {
    if (type === "thumbnail") {
      setDataThumbnail([]);
    }
    if (type === "slider") {
      const newSilder = dataSlider.filter((item) => item.uid !== file.uid);
      setDataSlider(newSilder);
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };
  const handleChange = (info, type) => {
    if (type === "thumbnail") {
      if (info.file.status === "uploading") {
        setLoadingThumbnail(true);
        return;
      }
      if (info.file.status === "done") {
        // Get this url from response in real world.
        getBase64(info.file.originFileObj, (url) => {
          setLoadingThumbnail(false);
          setImageUrlThumbNail(url);
        });
      }
    } else {
      setLoadingSlider(true);
      setFileListSlider(info.fileList);

      setLoadingSlider(false);
    }
  };
  const onFinish = async (values) => {
    setIsSubmit(true);
    if (dataThumbnail.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh thumbnail",
      });
    }
    if (dataSlider.length === 0) {
      notification.error({
        message: "Lỗi validate",
        description: "Vui lòng upload ảnh slider",
      });
    }
    const thumbnail = dataThumbnail[0].name;
    const slider = dataSlider.map((item) => item.name);
    const res = await callCreateBook({ ...values, thumbnail, slider });
    if (res.statusCode === 201) {
      setIsSubmit(false);
      onClose();
      form.resetFields();
      reloadTable();
      message.open({
        type: "success",
        content: "Đăng kí thành công!",
      });
    } else {
      setIsSubmit(false);
      notification.error({
        message: res.message,
        placement: "topRight",
      });
    }
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj, (url) => {
        setPreviewImageSlider(url);
      });
    }
    setPreviewOpenSlider(true);
    setPreviewTitleSlider(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const uploadButton = (loading) => {
    return (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div
          style={{
            marginTop: 8,
          }}
        >
          Upload
        </div>
      </div>
    );
  };

  useEffect(() => {
    const getBookCategories = async () => {
      const res = await callGetBookCategory();
      if (res && res.statusCode === 200) {
        const list = res.data.map((item) => {
          return {
            label: item,
            value: item,
          };
        });
        setBookCategories(list);
      }
    };
    getBookCategories();
  }, []);

  return (
    <Modal
      title={"Thêm mới người dùng."}
      open={open}
      onCancel={() => {
        onClose();
        setIsSubmit(false);
        setImageUrlThumbNail("");
        setDataSlider([]);
        setDataThumbnail([]);
        setFileListSlider([]);
        form.resetFields();
      }}
      onOk={() => {
        form.submit();
      }}
      confirmLoading={isSubmit}
    >
      <Form
        form={form}
        name="create-user"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
        layout="vertical"
      >
        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          <Col span={11}>
            <Form.Item
              label="Tên sách"
              labelCol={{ span: 24 }}
              name="mainText"
              rules={[
                { required: true, message: "Tên sách không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tác giả"
              labelCol={{ span: 11 }}
              name="author"
              rules={[
                { required: true, message: "Tác giả không được để trống!" },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row style={{ display: "flex", justifyContent: "space-between" }}>
          <Col span={5}>
            <Form.Item
              style={{ width: "100%" }}
              label="Giá tiền"
              labelCol={{ span: 24 }}
              name="price"
              rules={[
                { required: true, message: "Giá tiền không được để trống!" },
              ]}
            >
              <InputNumber
                formatter={(amount) => {
                  return amount.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                }}
                addonAfter={"đ"}
              />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              style={{ width: "100%" }}
              label="Thể loại"
              labelCol={{ span: 24 }}
              name="category"
              rules={[
                { required: true, message: "Thể loại không được để trống!" },
              ]}
            >
              <Select options={bookCategories} showSearch />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              style={{ width: "100%" }}
              label="Số lượng"
              labelCol={{ span: 24 }}
              name="quantity"
              rules={[
                { required: true, message: "Số lượng không được để trống!" },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item
              style={{ width: "100%" }}
              label="Đã bán"
              labelCol={{ span: 24 }}
              name="sold"
              rules={[
                { required: true, message: "Số lượng không được để trống!" },
              ]}
              initialValue={0}
            >
              <InputNumber />
            </Form.Item>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <Form.Item
              style={{ width: "100%" }}
              label="Ảnh thumbnail"
              labelCol={{ span: 24 }}
              name="thumbnail"
            >
              <Upload
                multiple={false}
                maxCount={1}
                showUploadList={false}
                beforeUpload={beforeUpload}
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                onChange={(info) => handleChange(info, "thumbnail")}
                customRequest={handleUploadThumbnail}
                onRemove={(file) => handleRemoveFile(file, "thumbnail")}
              >
                {imageUrlThumbNail ? (
                  <img
                    src={imageUrlThumbNail}
                    alt="avatar"
                    style={{
                      width: "100%",
                    }}
                  />
                ) : (
                  uploadButton(loadingThumbnail)
                )}
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              style={{ width: "100%" }}
              label="Ảnh slider"
              labelCol={{ span: 24 }}
              name="slider"
            >
              <Upload
                customRequest={handleUploadSlider}
                listType="picture-card"
                fileList={fileListSlider}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple={true}
                maxCount={10}
                onRemove={(file) => handleRemoveFile(file, "slider")}
              >
                {fileListSlider.length >= 8
                  ? null
                  : uploadButton(loadingSlider)}
              </Upload>
              <Modal
                open={previewOpenSlider}
                title={previewTitleSlider}
                footer={null}
                onCancel={handleCancel}
              >
                <img
                  alt="example"
                  style={{
                    width: "100%",
                  }}
                  src={previewImageSlider}
                />
              </Modal>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CreateBookModal;
