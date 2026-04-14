import React from "react";
import { Modal, Typography, Button, App } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Paragraph, Title } = Typography;

export interface ExampleFormatModalProps {
  open: boolean;
  onCancel: () => void;
  title: string;
  description: string;
  example: string;
  mode: "text" | "simpleJSON" | "complexJSON" | "php";
}

const MODE_CONFIG: Record<
  ExampleFormatModalProps["mode"],
  { icon: string; color: string }
> = {
  text: { icon: "T", color: "#1890ff" },
  simpleJSON: { icon: "{}", color: "#52c41a" },
  complexJSON: { icon: "{...}", color: "#fa8c16" },
  php: { icon: "PHP", color: "#722ed1" },
};

const ExampleFormatModal: React.FC<ExampleFormatModalProps> = ({
  open,
  onCancel,
  title,
  description,
  example,
  mode,
}) => {
  const { message } = App.useApp();
  const { t } = useTranslation();

  const handleCopyExample = async () => {
    try {
      await navigator.clipboard.writeText(example);
      message.success({
        content: t("translation.exampleCopied"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = example;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        message.success({
          content: t("translation.exampleCopied"),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      } catch {
        message.error({
          content: t("translation.copyError"),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      } finally {
        document.body.removeChild(textArea);
      }
    }
  };

  const config = MODE_CONFIG[mode];

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span style={{ fontSize: "20px" }}>{config.icon}</span>
          <span style={{ color: config.color }}>{title}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="close" onClick={onCancel}>
          {t("common.close")}
        </Button>,
      ]}
      className="example-format-modal"
    >
      <div className="space-y-4">
        <div className="rounded-lg border-l-4 border-blue-400 bg-blue-50 p-3 dark:bg-blue-900/20">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-500">i</span>
            <p className="m-0 text-blue-700 dark:text-blue-300">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">#</span>
            <Title level={5} className="m-0">
              {t("translation.exampleFormat")}
            </Title>
          </div>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={handleCopyExample}
            className="flex items-center text-blue-500 hover:text-blue-600"
            size="small"
          >
            {t("translation.copyExample")}
          </Button>
        </div>

        <div className="relative">
          <Paragraph
            copyable={{
              icon: [
                <CopyOutlined
                  key="copy"
                  className="text-gray-500 hover:text-blue-500"
                />,
                <span key="copied" className="text-xs text-green-500">
                  {t("common.copied", "Copied")}
                </span>,
              ],
              text: example,
              tooltips: [
                t("common.copyCode", "Copy code"),
                t("common.copied", "Copied"),
              ],
            }}
            className="whitespace-pre-wrap rounded-lg border bg-gray-50 p-4 font-mono text-sm dark:bg-gray-800"
            style={{
              marginBottom: 0,
              maxHeight: "400px",
              overflowY: "auto",
              lineHeight: "1.5",
            }}
          >
            {example}
          </Paragraph>
        </div>

        <div className="rounded-lg border-l-4 border-green-400 bg-green-50 p-3 dark:bg-green-900/20">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-green-500">+</span>
            <div className="text-green-700 dark:text-green-300">
              <p className="m-0 font-medium">{t("translation.usageTips")}</p>
              <p className="m-0 mt-1 text-sm">
                {t("translation.usageDescription")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExampleFormatModal;
