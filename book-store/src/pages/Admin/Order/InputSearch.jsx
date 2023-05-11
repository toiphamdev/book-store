import { Button, Col, Form, Input, Row } from "antd";
import React, { useRef } from "react";

const InputSearch = (props) => {
  const formRef = useRef();
  const onFinish = async (values) => {
    const { phone, name, address } = values;
    let filter = "";
    if (phone) {
      filter = filter + `&phone=/${phone}/i`;
    }
    if (name) {
      filter = filter + `&name=/${name}/i`;
    }
    if (address) {
      filter = filter + `&address=/${address}/i`;
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
            <Form.Item
              label="Số điện thoại"
              labelCol={{ span: 12 }}
              name="phone"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              label="Tên khách hàng"
              labelCol={{ span: 12 }}
              name="name"
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item
              label="Địa chỉ giao hàng"
              labelCol={{ span: 12 }}
              name="address"
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
