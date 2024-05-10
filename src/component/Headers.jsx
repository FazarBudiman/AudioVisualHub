import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
const { Header } = Layout;

const Headers = () => {
  const items = [
    {
      key: "compress-audio",
      label: <Link to="/compress-audio">Compress Audio</Link>,
    },
    {
      key: "resize-image",
      label: <Link to="/resize-image">Resize Image</Link>,
    },
  ];

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ color: "white", backgroundColor: "#1677FF", height: "60%", display: "flex", alignItems: "center", padding: 20, borderRadius: 10 }}>
        <h2>AudioVisualHub</h2>
      </div>
      <Menu
        theme="dark"
        mode="horizontal"
        items={items}
        style={{
          paddingLeft: "55%",
          flex: 10,
          minWidth: 0,
        }}
      />
    </Header>
  );
};

export default Headers;
