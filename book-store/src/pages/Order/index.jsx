import {
  Button,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  Radio,
  Result,
  Row,
  Steps,
} from "antd";
import React, { useEffect, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import "./order.scss";
import {
  doChangeCartItem,
  doDeleteCartItem,
} from "../../redux/order/orderSlice";
import { SmileOutlined } from "@ant-design/icons";
import Payment from "./Payment";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
  const carts = useSelector((state) => state.order.carts);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleQuantityChange = (e, book) => {
    dispatch(
      doChangeCartItem({
        _id: book._id,
        quantity: parseInt(e),
        detail: book.detail,
      })
    );
  };
  const convertToOrder = (cartItems = []) => {
    return cartItems.map((item) => {
      return {
        _id: item._id,
        quantity: item.quantity,
        bookName: item.detail?.mainText,
      };
    });
  };

  useEffect(() => {
    setCartItems(carts);
    const total = carts.reduce((total, item) => {
      return parseInt(item.quantity) * parseInt(item.detail.price) + total;
    }, 0);
    setTotalPrice(total);
  }, [carts]);

  return (
    <Row gutter={[16, 16]} style={{ padding: "16px" }}>
      <Col span={24}>
        <Steps
          current={step}
          items={[
            {
              title: "Đơn hàng",
            },
            {
              title: "Đặt hàng",
            },
            {
              title: "Thanh toán",
            },
          ]}
        />
      </Col>
      {step !== 3 && (
        <>
          <Col md={18} xs={24}>
            {cartItems.length > 0 ? (
              cartItems.map((item, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fff",
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                    className="popup-item"
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{ width: "60px" }}
                        src={`${import.meta.env.VITE_BASE_URL}/images/book/${
                          item?.detail?.thumbnail
                        }`}
                      />
                      <span>{item?.detail?.mainText}</span>
                      <span className="popup-price">
                        {item?.detail?.price?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <div className="quantity-wrapper">
                      <div style={{ marginLeft: "8px" }}>
                        <InputNumber
                          style={{ width: "40px" }}
                          onChange={(e) => handleQuantityChange(e, item)}
                          value={item.quantity}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => dispatch(doDeleteCartItem(item._id))}
                    >
                      <AiFillDelete color="red " />
                    </button>
                  </div>
                );
              })
            ) : (
              <Empty
                description={<span>Chưa có sản phẩm trong giỏ hàng</span>}
              />
            )}
          </Col>
          <Col
            md={6}
            xs={24}
            className="bill-container"
            style={{ backgroundColor: "#fff" }}
          >
            {step === 1 && (
              <div className="bill-wrapper">
                <div>
                  <div className="bill-item">
                    <span>Tạm tính</span>
                    <span>
                      {totalPrice?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                  <div className="bill-item">
                    <span>Tổng tiền </span>
                    <span className="price-detail">
                      {totalPrice?.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="btn btn-solid-red w-100 "
                >{`Mua hàng (${carts?.length})`}</button>
              </div>
            )}
            {step === 2 && (
              <Payment
                totalPrice={totalPrice}
                detail={convertToOrder(cartItems)}
                setStep={setStep}
              />
            )}
          </Col>
        </>
      )}
      {step === 3 && (
        <Col span={24}>
          <Result
            icon={<SmileOutlined />}
            title="Tuyệt vời, bạn đã đặt hàng thành công!"
            extra={
              <button
                onClick={() => navigate("/history")}
                className="btn btn-tinded"
              >
                Xem lịch sử{" "}
              </button>
            }
          />
        </Col>
      )}
    </Row>
  );
};

export default OrderPage;
