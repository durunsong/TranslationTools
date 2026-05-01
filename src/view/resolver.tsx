import React, { useEffect, useRef, useState } from "react";
import { Typography, Segmented, Space, Input, Button, App } from "antd";
import { useTranslation } from "react-i18next";
import TranslateText from "@/components/TranslateText";
import TranslateSimplerJSON from "@/components/TranslateSimplerJSON";
import TransEintricateJSON from "@/components/TransEintricateJSON";
import TranslatePHP from "@/components/TranslatePHP";
import { useCredentialsStore } from "@/stores/useCredentialsStore";
import "./css/resolver.css";

const { Title } = Typography;

type TranslationMode =
  | "textMode"
  | "simpleJSONMode"
  | "complexJSONMode"
  | "phpMode";

interface CredentialsSectionProps {
  initialAppid: string;
  initialApiKey: string;
  onSave: (appid: string, apiKey: string) => void;
}

const CredentialsSection: React.FC<CredentialsSectionProps> = ({
  initialAppid,
  initialApiKey,
  onSave,
}) => {
  const [localAppid, setLocalAppid] = useState(initialAppid);
  const [localApiKey, setLocalApiKey] = useState(initialApiKey);
  const { t } = useTranslation();

  return (
    <Space className="input-appid-key">
      <Title level={5} className="input-appid-key-title">
        {t("header.inputCredentials")}
      </Title>
      <Space className="flex flex-col">
        <Input
          placeholder={t("header.appIdPlaceholder")}
          allowClear
          value={localAppid}
          onChange={(event) => setLocalAppid(event.target.value)}
        />
        <Input
          placeholder={t("header.keyPlaceholder")}
          allowClear
          value={localApiKey}
          onChange={(event) => setLocalApiKey(event.target.value)}
        />
      </Space>
      <Button type="primary" onClick={() => onSave(localAppid, localApiKey)}>
        {t("common.save")}
      </Button>
    </Space>
  );
};

const ResolveComponent: React.FC = () => {
  const [mode, setMode] = useState<TranslationMode>("textMode");
  const modeChangeFrameRef = useRef<number | null>(null);
  const { appid, apiKey, setCredentials } = useCredentialsStore();
  const { message } = App.useApp();
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (modeChangeFrameRef.current !== null) {
        cancelAnimationFrame(modeChangeFrameRef.current);
      }
    };
  }, []);

  const handleSaveCredentials = (nextAppid: string, nextApiKey: string) => {
    if (nextAppid && nextApiKey) {
      setCredentials(nextAppid, nextApiKey);
      message.success({
        content: t("translation.credentialsSaved"),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
      return;
    }

    message.error({
      content: t("translation.pleaseInputCredentials"),
      className: document.documentElement.classList.contains("dark")
        ? "message-dark"
        : "message-light",
    });
  };

  const renderComponent = () => {
    switch (mode) {
      case "textMode":
        return <TranslateText appid={appid} apiKey={apiKey} />;
      case "simpleJSONMode":
        return <TranslateSimplerJSON appid={appid} apiKey={apiKey} />;
      case "complexJSONMode":
        return <TransEintricateJSON appid={appid} apiKey={apiKey} />;
      case "phpMode":
        return <TranslatePHP appid={appid} apiKey={apiKey} />;
      default:
        return null;
    }
  };

  const handleModeChange = (value: string | number) => {
    const nextMode = value as TranslationMode;

    if (modeChangeFrameRef.current !== null) {
      cancelAnimationFrame(modeChangeFrameRef.current);
    }

    modeChangeFrameRef.current = requestAnimationFrame(() => {
      setMode(nextMode);
      modeChangeFrameRef.current = null;
    });
  };

  return (
    <div className="flex flex-col">
      <CredentialsSection
        key={`${appid ?? ""}:${apiKey ?? ""}`}
        initialAppid={appid ?? ""}
        initialApiKey={apiKey ?? ""}
        onSave={handleSaveCredentials}
      />
      <Space className="responsive-space">
        <Title level={5} className="responsive-space-title">
          {t("header.selectMode")}
        </Title>
        <Segmented
          size="large"
          defaultValue={mode}
          onChange={handleModeChange}
          options={[
            { label: t("modes.textMode"), value: "textMode" },
            { label: t("modes.simpleJSONMode"), value: "simpleJSONMode" },
            { label: t("modes.complexJSONMode"), value: "complexJSONMode" },
            { label: t("modes.phpMode"), value: "phpMode" },
          ]}
        />
      </Space>
      {renderComponent()}
    </div>
  );
};

const Resolver: React.FC = () => (
  <App>
    <ResolveComponent />
  </App>
);

export default Resolver;
