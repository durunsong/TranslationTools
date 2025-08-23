import React, { useState, useEffect } from "react";
import {
  Typography,
  Segmented,
  Space,
  Input,
  Button,
  App,
} from "antd";
import { useTranslation } from "react-i18next";
import TranslateText from "@/components/TranslateText";
import TranslateSimplerJSON from "@/components/TranslateSimplerJSON";
import TransEintricateJSON from "@/components/TransEintricateJSON";
import TranslatePHP from "@/components/TranslatePHP";
import { useCredentialsStore } from "@/stores/useCredentialsStore";
import "./css/resolver.css";

const { Title } = Typography;

const ResolveComponent: React.FC = () => {
  const [mode, setMode] = useState("textMode");
  const { appid, apiKey, setCredentials } = useCredentialsStore();
  const [localAppid, setLocalAppid] = useState<string>(appid || "");
  const [localKey, setLocalKey] = useState<string>(apiKey || "");
  const { message } = App.useApp();
  const { t } = useTranslation();

  useEffect(() => {
    // 获取 appid 和 apiKey 更新状态
    if (appid) setLocalAppid(appid);
    if (apiKey) setLocalKey(apiKey);
  }, [appid, apiKey]);

  const handleSaveCredentials = () => {
    if (localAppid && localKey) {
      // 使用 Zustand 更新状态
      setCredentials(localAppid, localKey);
      message.success({
        content: t('translation.credentialsSaved'),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } else {
      message.error({
        content: t('translation.pleaseInputCredentials'),
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    }
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



  const handleModeChange = (value:string) => {
    requestAnimationFrame(() => {
      setMode(value);
    });
  };

  return (
    <div className="flex flex-col">
      <Space className="input-appid-key">
        <Title level={5} className="input-appid-key-title">
          {t('header.inputCredentials')}
        </Title>
        <Space className="flex flex-col">
          <Input
            placeholder={t('header.appIdPlaceholder')}
            allowClear
            value={localAppid}
            onChange={(e) => setLocalAppid(e.target.value)}
          />
          <Input
            placeholder={t('header.keyPlaceholder')}
            allowClear
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
          />
        </Space>
          <Button type="primary" onClick={handleSaveCredentials}>
            {t('common.save')}
          </Button>
      </Space>
      <Space className="responsive-space">
        <Title level={5} className="responsive-space-title">
          {t('header.selectMode')}
        </Title>
        <Segmented
          size="large"
          defaultValue={mode}
          onChange={handleModeChange}
          options={[
            {
              label: t('modes.textMode'),
              value: "textMode",
            },
            {
              label: t('modes.simpleJSONMode'),
              value: "simpleJSONMode",
            },
            {
              label: t('modes.complexJSONMode'),
              value: "complexJSONMode",
            },
            {
              label: t('modes.phpMode'),
              value: "phpMode",
            },
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
