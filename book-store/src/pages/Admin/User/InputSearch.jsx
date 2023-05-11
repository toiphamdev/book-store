import { Button, Col, Form, Input, Row } from "antd";
import React, { useRef } from "react";
import "./style.scss";

const InputSearch = (props) => {
  const formRef = useRef();
  const onFinish = async (values) => {
    const { fullName, email, phone } = values;
    let filter = "";
    if (fullName) {
      filter = filter + `&fullName=/${fullName}/i`;
    }
    if (email) {
      filter = filter + `&email=/${email}/i`;
    }
    if (phone) {
      filter = filter + `&phone=/${phone}/i`;
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
            <Form.Item label="Tên" labelCol={{ span: 12 }} name="fullName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item label="Email" labelCol={{ span: 12 }} name="email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              label="Số điện thoại"
              labelCol={{ span: 12 }}
              name="phone"
            >
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
