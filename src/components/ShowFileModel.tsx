import React, { useState } from "react";
import { Modal, Flex, Radio, Button, Space, Typography } from "antd";
import type { RadioChangeEvent } from "antd";

interface ShowFileModelProps {
  open: boolean;
  onCancel: () => void;
  onSuffixSelect: (suffix: string) => void; // 父组件事件，通过确认按钮触发
  toLang?: string; // 选择的目标语言
}

const { Text } = Typography;

const ShowFileModel: React.FC<ShowFileModelProps> = ({
  open,
  onCancel,
  onSuffixSelect,
  toLang,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSuffix, setSelectedSuffix] = useState<string>("js");

  const file_suffix = [
    { value: "js", label: "js" },
    { value: "ts", label: "ts" },
    { value: "jsx", label: "jsx" },
    { value: "tsx", label: "tsx" },
    { value: "json", label: "json" },
    { value: "md", label: "md" },
    { value: "txt", label: "txt" },
    { value: "php", label: "php" },
    { value: "go", label: "go" },
    { value: "java", label: "java" },
    { value: "py", label: "py" },
    { value: "yaml", label: "yaml" },
  ];

  const showLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuffixSelect(selectedSuffix); // 调用父组件的事件，传递选中的后缀名
      onCancel(); // 关闭模态框
    }, 500);
  };

  const handleSuffixChange = (e: RadioChangeEvent) => {
    setSelectedSuffix(e.target.value);
  };

  return (
    <Modal
      title={<p className="mb-5">选择你想要的文件后缀名</p>}
      footer={
        <Button type="primary" onClick={showLoading} loading={loading}>
          确认
        </Button>
      }
      open={open}
      onCancel={onCancel}
    >
      <Flex vertical gap="middle">
        <Radio.Group
          value={selectedSuffix}
          buttonStyle="solid"
          onChange={handleSuffixChange}
        >
          {file_suffix.map((item) => (
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
        <Space className="text-[18px]">
          <Text>输出文件为：</Text>
          <Text>
            {toLang}.{selectedSuffix}
          </Text>
        </Space>
      </Flex>
    </Modal>
  );
};

export default ShowFileModel;
