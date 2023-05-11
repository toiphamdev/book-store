import { Button, Col, Form, Input, Row } from "antd";
import React, { useRef } from "react";

const InputSearch = (props) => {
  const formRef = useRef();
  const onFinish = async (values) => {
    const { mainText, author, category } = values;
    let filter = "";
    if (mainText) {
      filter = filter + `&mainText=/${mainText}/i`;
    }
    if (author) {
      filter = filter + `&author=/${author}/i`;
    }
    if (category) {
      filter = filter + `&category=/${category}/i`;
    }
    props.onSubmit(filter);
  };
  const handleClear = () => {
    formRef.current.resetFields();
    props.handleClear();
  };
  return (
    <div className="input__search-wrapper">
      <Form
        ref={formRef}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{
          span: 24,
        }}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Row className="input__search-group">
          <Col span={7}>
            <Form.Item label="Tên sách" labelCol={{ span: 12 }} name="mainText">
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Tác giả" labelCol={{ span: 12 }} name="author">
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Thể loại" labelCol={{ span: 12 }} name="category">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ float: "right" }}>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{ marginLeft: "12px" }}
            type="primary"
            onClick={handleClear}
          >
            Clear
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default InputSearch;
