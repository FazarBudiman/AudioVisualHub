import { Button, Form, Input, Layout, theme } from "antd";
const { Content } = Layout;
import { InboxOutlined, DeleteFilled } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useState } from "react";
const { Dragger } = Upload;
import Resizer from "react-image-file-resizer";
import Headers from "../Headers";

const ResizerImage = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [uploadedFile, setUploadedFile] = useState(null);

  const props = {
    name: "file",
    fileList: null,
    maxCount: 1,
    action: null,
    beforeUpload: (file) => {
      const isAudio = file.type.startsWith("image");
      if (!isAudio) {
        message.error(`${file.name} is not a image file`);
      } else {
        setUploadedFile(file);
      }
      return isAudio || Upload.LIST_IGNORE;
    },
  };

  const handleResize = (value) => {
    const { width, height } = value;
    Resizer.imageFileResizer(
      uploadedFile,
      width,
      height,
      "JPEG",
      100,
      0,
      (uri) => {
        const byteString = atob(uri.split(",")[1]); // Decode base64 string
        const mimeType = uri.split(";")[0].split(":")[1]; // Extract mime type
        const buffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(buffer);
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([buffer], { type: mimeType }); // Create Blob object
        const url = URL.createObjectURL(blob); // Create object URL for download
        // Create a download link and trigger the download
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = `compressed-${uploadedFile.name}`;
        downloadLink.click();
        // Revoke object URL after download is complete
        URL.revokeObjectURL(url);
        setUploadedFile(null);
      },
      "base64"
    );
  };

  return (
    <Layout>
      <Headers />

      <Content
        style={{
          padding: "0 0px",
        }}
      >
        <div
          style={{
            background: colorBgContainer,
            minHeight: 280,
            borderRadius: borderRadiusLG,
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <h1 style={{ margin: 50 }}>Resize Your Image</h1>
          <div
            style={{
              width: "80%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {uploadedFile === null ? (
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </Dragger>
            ) : (
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 40 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
                  <img src={URL.createObjectURL(uploadedFile)} height={300} />
                  <Button type="primary" danger icon={<DeleteFilled />} onClick={() => setUploadedFile(null)} />
                </div>
                <Form onFinish={handleResize}>
                  <div style={{ display: "flex", gap: 10, maxWidth: "70%", marginBottom: 30 }}>
                    <Form.Item name="width">
                      <Input type="number" addonBefore={"Width"} required />
                    </Form.Item>
                    <Form.Item name="height">
                      <Input type="number" addonBefore={"Height"} required />
                    </Form.Item>
                  </div>
                  <Button style={{ width: "100%" }} type="primary" size="large" htmlType="submit">
                    Resize
                  </Button>
                </Form>
              </div>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default ResizerImage;
