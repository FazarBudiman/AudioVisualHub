import { Button, Layout, Spin, theme } from "antd";
const { Content } = Layout;
import { InboxOutlined, DeleteFilled } from "@ant-design/icons";
import { message, Upload } from "antd";
import { useState } from "react";
import ffmpeg from "ffmpeg.js/ffmpeg-mp4.js";
import Headers from "../Headers";
const { Dragger } = Upload;

const CompressAudio = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const props = {
    name: "file",
    fileList: null,
    maxCount: 1,
    action: null,
    beforeUpload: (file) => {
      const isAudio = file.type === "audio/mpeg";
      if (!isAudio) {
        message.error(`${file.name} is not a audio file`);
      } else {
        setUploadedFile(file);
      }
      return isAudio || Upload.LIST_IGNORE;
    },
  };

  const handleCompress = async () => {
    try {
      setIsLoading(true);
      const transcode = await ffmpeg({
        MEMFS: [{ name: uploadedFile.name, data: new Uint8Array(await uploadedFile.arrayBuffer()) }],
        arguments: ["-i", uploadedFile.name, "-vn", "-b:a", "64k", "-f", "mp3", "output.mp3"],
      });

      console.log("Transcode result:", transcode);

      if (!transcode || !transcode.MEMFS || transcode.MEMFS.length === 0 || !transcode.MEMFS[0].data) {
        console.error("Error: No compressed audio data found.");
        return;
      }

      const compressedData = transcode.MEMFS[0].data; // Get the compressed audio data
      const compressedBlob = new Blob([compressedData], { type: "audio/mp3" });

      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(compressedBlob);
      downloadLink.download = `compressed-${uploadedFile.name}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      setUploadedFile(null);
    } catch (error) {
      console.error("Error compressing audio", error);
      message.error("Error compressing audio");
    } finally {
      setIsLoading(false);
    }
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
            justifyContent: "center",
          }}
        >
          <h1 style={{ margin: 50 }}>Compress Audio</h1>

          <div
            style={{
              width: "60%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isLoading ? (
              <Spin tip="Compressing"></Spin>
            ) : (
              <div>
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
                      <audio src={URL.createObjectURL(uploadedFile)} controls />
                      <Button type="primary" danger icon={<DeleteFilled />} onClick={() => setUploadedFile(null)} />
                    </div>

                    <Button type="primary" size="large" onClick={handleCompress}>
                      Compress
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default CompressAudio;
