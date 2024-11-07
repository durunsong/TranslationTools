import React, { useEffect } from "react";
import {
  Layout,
  Space,
  ConfigProvider,
  Segmented,
  theme,
  Dropdown,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import {
  DownOutlined,
  BaiduOutlined,
  GithubOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import LightIcon from "@/assets/themeIcons/LightIcon.tsx";
import DarkIcon from "@/assets/themeIcons/DarkIcon.tsx";
import Resolver from "@/view/resolver.tsx";
import { useThemeStore } from "@/stores/useThemeStore";
import "@/assets/css/App.css";

const { Text } = Typography;

const App: React.FC = () => {
  const { themeMode, setThemeMode } = useThemeStore();
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://fanyi-api.baidu.com/doc/21"
        >
          百度翻译API文档
        </a>
      ),
      extra: "⌘D",
      icon: <BaiduOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/durunsong/TranslationTools"
        >
          github 地址
        </a>
      ),
      extra: "⌘R",
      icon: <GithubOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/durunsong/TranslationTools"
        >
          记得得点个Star哦！🌹
        </a>
      ),
      extra: "⌘S",
      icon: <HeartOutlined />,
    },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  const handleThemeChange = (value: string) => {
    setThemeMode(value);
    document.documentElement.classList.toggle("dark", value === "dark");
  };

  return (
    <ConfigProvider
      theme={{
        algorithm:
          themeMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
        components: {
          Segmented: {
            itemColor: themeMode === "light" ? "#000" : "#fff",
            itemHoverColor: themeMode === "light" ? "#1890ff" : "#40a9ff",
            itemSelectedBg: themeMode === "light" ? "#eab308" : "#662626",
            trackPadding: 6,
          },
        },
      }}
    >
      <Layout className="min-h-screen bg-gray-100 dark:bg-gray-800">
        <Layout.Content className="p-2">
          <Space className="flex items-center justify-end">
            <Dropdown menu={{ items }}>
              <Space className="cursor-pointer">
                <Text>🌏点击查看API文档和代码</Text>
                <DownOutlined />
              </Space>
            </Dropdown>
            <Segmented
              options={[
                { value: "light", icon: <LightIcon /> },
                { value: "dark", icon: <DarkIcon /> },
              ]}
              value={themeMode}
              style={{
                border: `1px solid ${
                  themeMode === "light" ? "#d9d9d9" : "#434343"
                }`,
              }}
              className={`p-1 rounded-lg ${
                themeMode === "light"
                  ? "bg-gray-100 text-black"
                  : "bg-gray-700 text-white"
              }`}
              onChange={(value) => handleThemeChange(value as string)}
            />
          </Space>
          <Space direction="vertical" className="w-full mt-4">
            <Resolver></Resolver>
          </Space>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
