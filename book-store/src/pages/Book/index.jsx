import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Col, Rate, Row, message } from "antd";
import "./book.scss";
import { BsCartPlus } from "react-icons/bs";
import ImageSlide from "./ImageSlide";
import BookLoading from "./BookLoading";
import { callBookDetailById } from "../../services/api";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { doAddToCartAction } from "../../redux/order/orderSlice";

const BookPage = () => {
  const search = useLocation().search;
  const query = new URLSearchParams(search);
  const [images, setImages] = useState([]);
  const [book, setBook] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  const handleQuantityChange = (type, e) => {
    if (quantity > 0 && type === "DES") {
      setQuantity((preState) => preState - 1);
    }
    if (quantity < book.quantity && type === "ASC") {
      setQuantity((preState) => preState + 1);
    }
    if (type === "INPUT" && e) {
      if (e.target.value > 0 && e.target.value <= book.quantity) {
        setQuantity(parseInt(e.target.value));
      } else {
        if (e.target.value < 0) {
          setQuantity(0);
        }
        if (e.target.value > book.quantity) {
          setQuantity(book.quantity);
        }
      }
    }
  };

  const handleAddToCart = (quantity, book) => {
    if (quantity > 0) {
      dispatch(doAddToCartAction({ quantity, _id: book._id, detail: book }));
    } else {
      message.error("Số lượng phản phẩm phải lớn hơn 0");
    }
  };

  useEffect(() => {
    const getBookDeatail = async () => {
      setIsLoading(true);
      const res = await callBookDetailById(query.get("id"));
      if (res.data && res.statusCode === 200) {
        const { thumbnail, slider } = res.data;
        const sliders = slider.map((item) => {
          return {
            original: `${import.meta.env.VITE_BASE_URL}/images/book/${item}`,
            thumbnail: `${import.meta.env.VITE_BASE_URL}/images/book/${item}`,
          };
        });
        const images = [
          ...sliders,
          {
            original: `${
              import.meta.env.VITE_BASE_URL
            }/images/book/${thumbnail}`,
            thumbnail: `${
              import.meta.env.VITE_BASE_URL
            }/images/book/${thumbnail}`,
          },
        ];
        setImages(images);
        setBook(res.data);
        setIsLoading(false);
      }
    };
    getBookDeatail();
  }, []);
  return (
    <Row
      gutter={[16, 16]}
      style={{ padding: "16px", display: "flex", flexWrap: "wrap" }}
    >
      {isLoading ? (
        <BookLoading />
      ) : (
        <>
          <Col md={10} sm={24} xs={24}>
            <ImageSlide images={images} />
          </Col>
          <Col className="detail-info" md={14} sm={24} xs={24}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <span>Tác giả: </span>
                <a style={{ paddingLeft: "4px" }}>{book?.author}</a>
              </Col>
              <Col span={24}>
                <span className="title">{book?.mainText}</span>
              </Col>
              <Col span={24}>
                <span>
                  <Rate value={5} />
                </span>
                <span
                  style={{ marginLeft: "16px" }}
                >{`Đã bán: ${book?.sold}`}</span>
              </Col>
              <Col span={24}>
                <span className="price-detail">
                  {book?.price?.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </span>
              </Col>
              <Col span={24} className="count-box">
                <span className="count-title">Vận chuyển</span>
                <span className="quantity-wrapper">Miễn phí vận chuyển</span>
              </Col>

              <Col span={24} className="count-box">
                <div className="count-title">Số lượng</div>
                <div className="quantity-wrapper">
                  <div className="quantity-input">
                    <button
                      onClick={() => handleQuantityChange("ASC")}
                      className="quantity-control"
                    >
                      <AiOutlinePlus />
                    </button>
                    <input
                      value={quantity}
                      onChange={(e) => handleQuantityChange("INPUT", e)}
                      className="quantity-control"
                    />
                    <button
                      onClick={() => handleQuantityChange("DES")}
                      className="quantity-control"
                    >
                      <AiOutlineMinus />
                    </button>
                  </div>
                </div>
                <div>{`${book?.quantity} sản phẩm có sẵn`}</div>
              </Col>
              <Col span={24} style={{ marginTop: "20px" }}>
                <button
                  className="btn btn-tinded"
                  onClick={() => handleAddToCart(quantity, book)}
                >
                  <BsCartPlus />
                  <span>Thêm vào giỏ hàng</span>
                </button>
                <button className="btn btn-solid-red">Mua ngay</button>
              </Col>
            </Row>
          </Col>
        </>
      )}
    </Row>
  );
};

export default BookPage;
