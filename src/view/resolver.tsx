import React, { useState, useEffect } from "react";
import {
  Typography,
  Segmented,
  Space,
  Popover,
  Input,
  Button,
  App,
} from "antd";
import TranslateText from "@/components/TranslateText";
import TranslateSimplerJSON from "@/components/TranslateSimplerJSON";
import TransEintricateJSON from "@/components/TransEintricateJSON";
import { useCredentialsStore } from "@/stores/useCredentialsStore";
import useResponsivePlacement from "@/hooks/useResponsivePlacement";
import "./css/resolver.css";
// 演示JSON数据
import simpleData from "./json/simple.json";
import complexData from "./json/complex.json";

const { Paragraph, Title } = Typography;

const ResolveComponent: React.FC = () => {
  const [mode, setMode] = useState("textMode");
  const { appid, apiKey, setCredentials } = useCredentialsStore();
  const [localAppid, setLocalAppid] = useState<string>(appid || "");
  const [localKey, setLocalKey] = useState<string>(apiKey || "");
  const { message } = App.useApp();

  // 调用自定义 Hook 获取 Popover 的 placement
  const placement = useResponsivePlacement();

  // 复杂JSON数据处理
  const complexDataJson: any = (data: any) => {
    return `{\n${Object.entries(data)
      .map(
        ([key, value]) =>
          ` "${key}": ${
            typeof value === "object" ? complexDataJson(value) : `"${value}"`
          },`
      )
      .join("\n")}\n}`;
  };

  useEffect(() => {
    // 获取 appid 和 apiKey 更新状态
    if (appid) setLocalAppid(appid);
    if (apiKey) setLocalKey(apiKey);
  }, [appid, apiKey]);

  const handleSaveCredentials = () => {
    if (localAppid && localKey) {
      // 使用 Zustand 更新状态
      setCredentials(localAppid, localKey);
      message.success("App ID 和 Key 已保存！");
    } else {
      message.error("请输入 App ID 和 Key！");
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
      default:
        return null;
    }
  };

  const popoverContent = {
    textMode: (
      <div>
        <p>🌐用于文本翻译</p>
        🖨eg：这是一个翻译程序，可以翻译各种语言。
      </div>
    ),
    simpleJSONMode: (
      <div>
        <p>🌐简单JSON模式适合基础的JSON翻译</p>
        🖨eg：
        {simpleData && (
          <Paragraph
            copyable
            className="rounded mt-4 whitespace-pre-wrap font-mono"
          >
            {`{\n${Object.entries(simpleData)
              .map(([key, value]) => `  "${key}": "${value}",`)
              .join("\n")}\n}`}
          </Paragraph>
        )}
      </div>
    ),
    complexJSONMode: (
      <div>
        <p>🌐复杂JSON模式适合嵌套结构的JSON翻译</p>
        🖨eg：
        {complexData && (
          <Paragraph
            copyable
            className="rounded mt-4 whitespace-pre-wrap font-mono"
          >
            {complexDataJson(complexData)}
          </Paragraph>
        )}
      </div>
    ),
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
              label: (
                <Popover trigger="hover" content={popoverContent.textMode}>
                  <span>文本模式</span>
                </Popover>
              ),
              value: "textMode",
            },
            {
              label: (
                <Popover
                  trigger="hover"
                  content={popoverContent.simpleJSONMode}
                >
                  <span>简单JSON模式</span>
                </Popover>
              ),
              value: "simpleJSONMode",
            },
            {
              label: (
                <Popover
                  trigger="hover"
                  placement={placement}
                  content={popoverContent.complexJSONMode}
                >
                  <span>复杂JSON模式</span>
                </Popover>
              ),
              value: "complexJSONMode",
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
