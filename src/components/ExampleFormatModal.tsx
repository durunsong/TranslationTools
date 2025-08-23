import React from "react";
import { Modal, Typography, Button } from "antd";
import { CopyOutlined } from "@ant-design/icons";

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
          关闭
        </Button>
      ]}
      className="example-format-modal"
    >
      <div className="space-y-4">
        {/* 描述 */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border-l-4 border-blue-400">
          <div className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">🌐</span>
            <p className="text-blue-700 dark:text-blue-300 m-0">{description}</p>
          </div>
        </div>

        {/* 示例标题 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 dark:text-gray-400">🖨</span>
          <Title level={5} className="m-0">
            示例格式：
          </Title>
        </div>

        {/* 示例代码 */}
        <div className="relative">
          <Paragraph
            copyable={{
              icon: [
                <CopyOutlined key="copy" className="text-gray-500 hover:text-blue-500" />,
                <span key="copied" className="text-green-500 text-xs">已复制</span>
              ],
              text: example,
              tooltips: ['复制代码', '已复制'],
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

        {/* 使用提示 */}
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border-l-4 border-green-400">
          <div className="flex items-start gap-2">
            <span className="text-green-500 mt-0.5">💡</span>
            <div className="text-green-700 dark:text-green-300">
              <p className="m-0 font-medium">使用提示：</p>
              <p className="m-0 mt-1 text-sm">
                您可以直接复制上面的示例代码到输入框中进行测试，或者参考格式编写您自己的内容。
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExampleFormatModal;
