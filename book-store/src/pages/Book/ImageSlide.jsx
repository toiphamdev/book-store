import React, { useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "./book.scss";
import { Col, Image, Modal, Row } from "antd";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

const ImageSlide = ({ images }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef();
  const slideModalRef = useRef();
  return (
    <div className="modal-container">
      <ImageGallery
        ref={slideRef}
        onClick={() => {
          setIsModalOpen(true);
          setCurrentIndex(slideRef?.current?.getCurrentIndex());
        }}
        items={images}
        showFullscreenButton={false}
        showPlayButton={false}
        showNav={false}
        slideOnThumbnailOver={true}
      />
      <Modal
        open={isModalOpen}
        footer={null}
        width={800}
        onCancel={() => setIsModalOpen(false)}
        closeIcon={() => <></>}
      >
        <Row gutter={[16, 16]}>
          <Col span={18}>
            <ImageGallery
              ref={slideModalRef}
              onClick={() => setIsModalOpen(true)}
              items={images}
              showFullscreenButton={false}
              startIndex={currentIndex}
              showThumbnails={false}
              slideOnThumbnailOver={true}
              onSlide={(current) => {
                setCurrentIndex(current);
              }}
              renderLeftNav={(onClick, disabled) => {
                return (
                  <BsChevronLeft
                    className="nav-slide"
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "0",
                      color: "#cecece",
                      zIndex: 1,
                      transform: "translateY(-50%)",
                    }}
                    size={40}
                    fontWeight={"bold"}
                    onClick={onClick}
                    disabled={disabled}
                  />
                );
              }}
              renderRightNav={(onClick, disabled) => {
                return (
                  <BsChevronRight
                    className="nav-slide"
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "0",
                      color: "#cecece",
                      zIndex: 1,
                      transform: "translateY(-50%)",
                    }}
                    size={40}
                    fontWeight={"bold"}
                    onClick={onClick}
                    disabled={disabled}
                  />
                );
              }}
            />
          </Col>
          <Col span={6}>
            {images?.length > 0 && (
              <Row gutter={[16, 16]}>
                {images.map((item, index) => {
                  return (
                    <Col key={index} span={12}>
                      <Image
                        className={
                          index === currentIndex
                            ? "thumbnail-modal active"
                            : "thumbnail-modal"
                        }
                        key={index}
                        preview={false}
                        src={item.thumbnail}
                        onClick={() => {
                          setCurrentIndex(index);
                          slideModalRef?.current?.slideToIndex(index);
                        }}
                      />
                    </Col>
                  );
                })}
              </Row>
            )}
          </Col>
        </Row>
      </Modal>
    </div>
  );
};

export default ImageSlide;
