import { Col, Row, Skeleton } from "antd";
import React from "react";

const BookLoading = () => {
  return (
    <>
      <Col md={10} sm={0} xs={0}>
        <Row gutter={[16, 16]}>
          <Col md={24}>
            <Skeleton.Image
              size={"large"}
              style={{ width: "100%", minHeight: "300px" }}
              active
            />
          </Col>
          <Col md={24}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Skeleton.Image active style={{ width: "100%" }} />
              </Col>
              <Col span={8}>
                <Skeleton.Image active style={{ width: "100%" }} />
              </Col>
              <Col span={8}>
                <Skeleton.Image active style={{ width: "100%" }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col md={14} sm={24} xs={24}>
        <Row>
          <Col span={24}>
            <Skeleton
              paragraph={{
                rows: 3,
              }}
              active
            />
            <Skeleton
              paragraph={{
                rows: 2,
              }}
              active
            />
          </Col>
          <Col span={24}>
            <Row gutter={[16, 16]}>
              <Col>
                <Skeleton.Button active style={{ minWidth: "150px" }} />
              </Col>
              <Col>
                <Skeleton.Button active style={{ minWidth: "150px" }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default BookLoading;
