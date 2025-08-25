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
  mode: 'text' | 'simpleJSON' | 'complexJSON' | 'php';
}

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

  // 复制案例格式到剪贴板
  const handleCopyExample = async () => {
    try {
      await navigator.clipboard.writeText(example);
      message.success({
        content: t('translation.exampleCopied', '案例格式已复制到剪贴板'),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } catch (error) {
      // 如果现代API失败，使用传统方法
      const textArea = document.createElement('textarea');
      textArea.value = example;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        message.success({
          content: t('translation.exampleCopied', '案例格式已复制到剪贴板'),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      } catch {
        message.error({
          content: t('translation.copyError'),
          className: document.documentElement.classList.contains("dark")
            ? "message-dark"
            : "message-light",
        });
      }
      document.body.removeChild(textArea);
    }
  };

  // 根据模式设置不同的图标和颜色
  const getModeConfig = () => {
    switch (mode) {
      case 'text':
        return { icon: '📝', color: '#1890ff' };
      case 'simpleJSON':
        return { icon: '📄', color: '#52c41a' };
      case 'complexJSON':
        return { icon: '🔗', color: '#fa8c16' };
      case 'php':
        return { icon: '🐘', color: '#722ed1' };
      default:
        return { icon: '📋', color: '#1890ff' };
    }
  };

  const config = getModeConfig();

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '20px' }}>{config.icon}</span>
          <span style={{ color: config.color }}>{title}</span>
        </div>
      }
      open={open}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="close" onClick={onCancel}>
          {t('common.close')}
        </Button>
      ]}
      className="example-format-modal"
    >
      <div className="space-y-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">🌐</span>
            <p className="text-blue-700 dark:text-blue-300 m-0">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-400">🖨</span>
            <Title level={5} className="m-0">
              {t('translation.exampleFormat')}：
            </Title>
          </div>
          <Button
            type="text"
            icon={<CopyOutlined />}
            onClick={handleCopyExample}
            className="flex items-center text-blue-500 hover:text-blue-600"
            size="small"
          >
            {t('translation.copyExample')}
          </Button>
        </div>

        <div className="relative">
          <Paragraph
            copyable={{
              icon: [
                <CopyOutlined key="copy" className="text-gray-500 hover:text-blue-500" />,
                <span key="copied" className="text-green-500 text-xs">{t('common.copied', '已复制')}</span>
              ],
              text: example,
              tooltips: [t('common.copyCode', '复制代码'), t('common.copied', '已复制')],
            }}
            className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg font-mono text-sm whitespace-pre-wrap border"
            style={{
              marginBottom: 0,
              maxHeight: '400px',
              overflowY: 'auto',
              lineHeight: '1.5',
            }}
          >
            {example}
          </Paragraph>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-400">
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">💡</span>
            <div className="text-green-700 dark:text-green-300">
              <p className="m-0 font-medium">{t('translation.usageTips')}：</p>
              <p className="m-0 mt-1 text-sm">
                {t('translation.usageDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExampleFormatModal;
