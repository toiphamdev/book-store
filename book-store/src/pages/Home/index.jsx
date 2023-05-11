import { FilterTwoTone, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Row,
  Col,
  Form,
  Checkbox,
  Divider,
  InputNumber,
  Button,
  Rate,
  Tabs,
  Pagination,
  Spin,
  Drawer,
} from "antd";
import "./home.scss";
import { useEffect, useState } from "react";
import { callGetBookCategory, callGetBookPaginate } from "../../services/api";
import { useNavigate, useOutletContext } from "react-router-dom";
import { FaMinus } from "react-icons/fa";
const Home = () => {
  const [categories, setCategories] = useState([]);
  const [sorterString, setSorterString] = useState("&sort=-sold");
  const [filterString, setFilterString] = useState("");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [bookArr, setBookArr] = useState([]);
  const [form] = Form.useForm();
  const [modalFilter, setModalFilter] = useState(false);
  const { searchTemp, setSearchText, setSearchTemp } = useOutletContext();
  const navigate = useNavigate();
  const handleChangeFilter = (changedValues, values) => {
    if (changedValues.category) {
      const cate = values.category;

      if (cate && cate.length > 0) {
        const f = cate.join(",");

        setFilterString(`&category=${f}`);
      } else {
        setFilterString("");
      }
    }
  };

  const onFinish = (values) => {
    if (values?.range?.from >= 0 && values?.range?.to >= 0) {
      let f = `&price>=${values?.range?.from}&price<=${values?.range?.to}`;
      if (values?.category?.length > 0) {
        const cate = values?.category?.join(",");
        f += `&category=${cate}`;
      }
      setFilterString(f);
    }
  };

  const onChange = (key) => {
    setSorterString(`&sort=${key}`);
  };

  const items = [
    {
      key: "-sold",
      label: `Phổ biến`,
      children: <></>,
    },
    {
      key: "-createdAt",
      label: `Hàng Mới`,
      children: <></>,
    },
    {
      key: "price",
      label: `Giá Thấp Đến Cao`,
      children: <></>,
    },
    {
      key: "-price",
      label: `Giá Cao Đến Thấp`,
      children: <></>,
    },
  ];

  const onChangePage = (p, ps) => {
    setCurrent(p);
    if (ps !== pageSize) {
      setPageSize(ps);
    }
  };

  const convertSlug = (str) => {
    // Chuyển hết sang chữ thường
    str = str.toLowerCase();

    // xóa dấu
    str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, "a");
    str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, "e");
    str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, "i");
    str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, "o");
    str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, "u");
    str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, "y");
    str = str.replace(/(đ)/g, "d");

    // Xóa ký tự đặc biệt
    str = str.replace(/([^0-9a-z-\s])/g, "");

    // Xóa khoảng trắng thay bằng ký tự -
    str = str.replace(/(\s+)/g, "-");

    // Xóa ký tự - liên tiếp
    str = str.replace(/-+/g, "-");

    // xóa phần dự - ở đầu
    str = str.replace(/^-+/g, "");

    // xóa phần dư - ở cuối
    str = str.replace(/-+$/g, "");

    // return
    return str;
  };
  const handleRedirect = (book) => {
    const slug = convertSlug(book.mainText);
    navigate(`/book/${slug}?id=${book._id}`);
  };

  useEffect(() => {
    const getBookCategory = async () => {
      const res = await callGetBookCategory();
      if (res && res.statusCode === 200) {
        setCategories(res.data);
      }
    };
    getBookCategory();
  }, []);
  useEffect(() => {
    const getBook = async () => {
      setIsLoading(true);
      const query = searchTemp
        ? `current=${current}&pageSize=${pageSize}&mainText=/${searchTemp}/i` +
          filterString +
          sorterString
        : `current=${current}&pageSize=${pageSize}` +
          filterString +
          sorterString;
      const res = await callGetBookPaginate(query);
      if (res && res.statusCode === 200) {
        setIsLoading(false);
        setBookArr(res.data?.result);
        setTotal(res.data.meta.total);
      }
    };
    getBook();
  }, [pageSize, current, filterString, sorterString, searchTemp]);
  return (
    <div
      className="homepage-container"
      style={{
        maxWidth: 1440,
        margin: "0 auto",
        border: "1px solid transparent",
      }}
    >
      <Row
        gutter={[24, 24]}
        style={{
          marginTop: "12px",
          width: "calc(100% - 32px)",
          marginLeft: "16px",
          marginRight: "16px",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Col
          xl={4}
          md={6}
          sm={8}
          xs={0}
          style={{ backgroundColor: "#fff", borderRadius: "4px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px",
            }}
          >
            <span>
              <FilterTwoTone /> Bộ lọc tìm kiếm
            </span>
            <ReloadOutlined
              title="Reset"
              onClick={() => {
                form.resetFields();
                setFilterString("");
                setSearchTemp("");
                setSearchText("");
              }}
            />
          </div>
          <Form
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues, values) =>
              handleChangeFilter(changedValues, values)
            }
          >
            <Form.Item
              name="category"
              label="Danh mục sản phẩm"
              labelCol={{ span: 24 }}
            >
              <Checkbox.Group>
                <Row>
                  {categories.length > 0 &&
                    categories.map((item, index) => {
                      return (
                        <Col key={index} span={24}>
                          <Checkbox value={item}>{item}</Checkbox>
                        </Col>
                      );
                    })}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />
            <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name="from"
                    min={0}
                    placeholder="đ TỪ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span>-</span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name="to"
                    min={0}
                    placeholder="đ ĐẾN"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <Button
                  onClick={() => form.submit()}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  Áp dụng
                </Button>
              </div>
            </Form.Item>
            <Divider />
          </Form>
        </Col>
        <Col
          xl={20}
          md={18}
          sm={16}
          xs={24}
          style={{ backgroundColor: "transparent" }}
          className="padding__mobile-0"
        >
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fff",
              borderRadius: "4px",
            }}
          >
            <Row>
              <Tabs
                tabBarGutter={10}
                defaultActiveKey="1"
                items={items}
                style={{ width: "100%" }}
                onChange={onChange}
              />
            </Row>
            <Row className="header__mobile" style={{ marginBottom: "16px" }}>
              <button onClick={() => setModalFilter(true)}>
                <FilterTwoTone />
              </button>
            </Row>
            <Spin spinning={isLoading} tip="Loading...">
              <Row className="customize-row">
                {bookArr.length > 0 &&
                  bookArr.map((item, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => handleRedirect(item)}
                        className="column"
                      >
                        <div className="wrapper">
                          <div className="thumbnail">
                            <img
                              src={`${
                                import.meta.env.VITE_BASE_URL
                              }/images/book/${item.thumbnail}`}
                              alt="thumbnail book"
                            />
                          </div>
                          <div className="text">{item.mainText}</div>
                          <div className="price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(item.price)}
                          </div>
                          <div className="rating">
                            <Rate
                              value={5}
                              disabled
                              style={{ color: "#ffce3d", fontSize: 10 }}
                            />
                            <span>Đã bán {item.sold}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </Row>
            </Spin>
            <Divider />
            <Row style={{ display: "flex", justifyContent: "center" }}>
              <Pagination
                onChange={(p, ps) => onChangePage(p, ps)}
                showQuickJumper
                showSizeChanger
                current={current}
                pageSize={pageSize}
                total={total}
                responsive
              />
            </Row>
          </div>
        </Col>
      </Row>
      <Drawer
        title={"Lọc sản phẩm"}
        width={"60%"}
        open={modalFilter}
        onClose={() => setModalFilter(false)}
        style={{ padding: 0 }}
      >
        <Col
          md={0}
          sm={0}
          xs={18}
          style={{
            backgroundColor: "#fff",
            borderRadius: "4px",
            padding: 0,
            margin: "0 auto",
          }}
        >
          <Form
            onFinish={onFinish}
            form={form}
            onValuesChange={(changedValues, values) =>
              handleChangeFilter(changedValues, values)
            }
          >
            <Form.Item
              name="category"
              label="Danh mục sản phẩm"
              labelCol={{ span: 24 }}
            >
              <Checkbox.Group>
                <Row>
                  {categories.length > 0 &&
                    categories.map((item, index) => {
                      return (
                        <Col key={index} span={24}>
                          <Checkbox value={item}>{item}</Checkbox>
                        </Col>
                      );
                    })}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            <Divider />
            <Form.Item label="Khoảng giá" labelCol={{ span: 24 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Form.Item name={["range", "from"]}>
                  <InputNumber
                    name="from"
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="đ TỪ"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
                <span>
                  <FaMinus size={8} />
                </span>
                <Form.Item name={["range", "to"]}>
                  <InputNumber
                    name="to"
                    style={{ width: "100%" }}
                    min={0}
                    placeholder="đ ĐẾN"
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                </Form.Item>
              </div>
              <div>
                <Button
                  onClick={() => form.submit()}
                  style={{ width: "100%" }}
                  type="primary"
                >
                  Áp dụng
                </Button>
              </div>
            </Form.Item>
            <Divider />
          </Form>
        </Col>
      </Drawer>
    </div>
  );
};

export default Home;
