import React, { useState } from "react";
import { Modal, Flex, Radio, Button, Space, Typography } from "antd";
import type { RadioChangeEvent } from "antd";
import { useTranslation } from "react-i18next";
import { ShowFileModelProps } from "@/types/textTranslation";

const { Text, Title } = Typography;

const FILE_SUFFIXES = [
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

interface FileSelectionContentProps extends ShowFileModelProps {
  defaultSuffix: string;
  defaultExport: string;
}

const FileSelectionContent: React.FC<FileSelectionContentProps> = ({
  open,
  onCancel,
  onSuffixSelect,
  toLang,
  defaultSuffix,
  defaultExport,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedSuffix, setSelectedSuffix] = useState(defaultSuffix);
  const [selectedExport, setSelectedExport] = useState(defaultExport);
  const { t } = useTranslation();

  const exportOptions = [
    { value: "No", label: t("common.no", "No") },
    { value: "Yes", label: t("common.yes", "Yes") },
  ];

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuffixSelect(selectedSuffix, selectedExport);
      onCancel();
    }, 500);
  };

  const handleSuffixChange = (event: RadioChangeEvent) => {
    setSelectedSuffix(event.target.value);
  };

  const handleExportChange = (event: RadioChangeEvent) => {
    setSelectedExport(event.target.value);
  };

  return (
    <Modal
      title={<p className="mb-5">{t("fileModal.selectFileFormat")}</p>}
      footer={
        <Button type="primary" onClick={handleConfirm} loading={loading}>
          {t("common.confirm")}
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
          {FILE_SUFFIXES.map((item) => (
            <Radio.Button key={item.value} value={item.value}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
        <Space>
          <Title level={5} className="mt-2">
            {t("fileModal.useJSExport")}
          </Title>
          <Radio.Group
            value={selectedExport}
            buttonStyle="solid"
            onChange={handleExportChange}
          >
            {exportOptions.map((item) => (
              <Radio.Button key={item.value} value={item.value}>
                {item.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </Space>
        <Space className="text-[18px]">
          <Text>{t("fileModal.outputFile")}</Text>
          <Text className="text-[17px] text-blue-500">
            {toLang}.{selectedSuffix}
          </Text>
        </Space>
      </Flex>
    </Modal>
  );
};

const ShowFileModel: React.FC<ShowFileModelProps> = ({
  open,
  onCancel,
  onSuffixSelect,
  toLang,
  defaultSuffix = "js",
  defaultExport = "No",
}) => {
  const resetKey = `${String(open)}-${defaultSuffix}-${defaultExport}`;

  return (
    <FileSelectionContent
      key={resetKey}
      open={open}
      onCancel={onCancel}
      onSuffixSelect={onSuffixSelect}
      toLang={toLang}
      defaultSuffix={defaultSuffix}
      defaultExport={defaultExport}
    />
  );
};

export default ShowFileModel;
