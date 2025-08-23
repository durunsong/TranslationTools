import React, { useState, useEffect } from "react";
import {
  Typography,
  Segmented,
  Space,
  Input,
  Button,
  App,
} from "antd";
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
        content: "App ID 和 Key 已保存！",
        className: document.documentElement.classList.contains("dark")
          ? "message-dark"
          : "message-light",
      });
    } else {
      message.error({
        content: "请输入 App ID 和 Key！",
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
          🧭请输入百度翻译AppID和Key：
        </Title>
        <Space>
          <Input
            placeholder="App ID"
            allowClear
            value={localAppid}
            onChange={(e) => setLocalAppid(e.target.value)}
          />
          <Input
            placeholder="Key"
            allowClear
            value={localKey}
            onChange={(e) => setLocalKey(e.target.value)}
          />
          <Button type="primary" onClick={handleSaveCredentials}>
            保存
          </Button>
        </Space>
      </Space>
      <Space className="responsive-space">
        <Title level={5} className="responsive-space-title">
          🧭请选择你需要的模式：
        </Title>
        <Segmented
          size="large"
          defaultValue={mode}
          onChange={handleModeChange}
          options={[
            {
              label: "文本模式",
              value: "textMode",
            },
            {
              label: "简单JSON模式",
              value: "simpleJSONMode",
            },
            {
              label: "复杂JSON模式",
              value: "complexJSONMode",
            },
            {
              label: "PHP数组模式",
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
