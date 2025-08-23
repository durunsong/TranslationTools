import React, { useState, useEffect } from "react";
import { Modal, Flex, Radio, Button, Space, Typography } from "antd";
import type { RadioChangeEvent } from "antd";
import { ShowFileModelProps } from "@/types/textTranslation";

const { Text, Title } = Typography;

const ShowFileModel: React.FC<ShowFileModelProps> = ({
  open,
  onCancel,
  onSuffixSelect,
  toLang,
  defaultSuffix = "js",
  defaultExport = "No",
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSuffix, setSelectedSuffix] = useState<string>(defaultSuffix);
  const [selectedExport, setSelectedExport] = useState<string>(defaultExport);

  // 当默认值改变时更新状态
  useEffect(() => {
    setSelectedSuffix(defaultSuffix);
    setSelectedExport(defaultExport);
  }, [defaultSuffix, defaultExport]);

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

  const is_export = [
    { value: "No", label: "No" },
    { value: "Yes", label: "Yes" },
  ];

  const showLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuffixSelect(selectedSuffix, selectedExport); // 调用父组件的事件，传递选中的后缀名
      onCancel(); // 关闭模态框
    }, 500);
  };

  const handleSuffixChange = (e: RadioChangeEvent) => {
    setSelectedSuffix(e.target.value);
  };

  const handleExportChange = (e: RadioChangeEvent) => {
    setSelectedExport(e.target.value);
  };

  return (
    <Modal
      title={<p className="mb-5">🧭 选择你想要的文件后缀名</p>}
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
        <Space>
          <Title level={5} className="mt-2">
            🧭 是否用 JS/TS 语法定义及导出
          </Title>
          <Radio.Group
            value={selectedExport}
            buttonStyle="solid"
            onChange={handleExportChange}
          >
            {is_export.map((item) => (
              <Radio.Button key={item.value} value={item.value}>
                {item.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Space>
        <Space className="text-[18px]">
          <Text>🌐 输出文件为：</Text>
          <Text className="text-blue-500 text-[17px]">
            {toLang}.{selectedSuffix}
          </Text>
        </Space>
      </Flex>
    </Modal>
  );
};

export default ShowFileModel;
