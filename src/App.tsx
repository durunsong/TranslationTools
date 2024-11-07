import React, { useEffect } from "react";
import { Layout, Space, ConfigProvider, Segmented, theme } from "antd";
import LightIcon from "@/assets/themeIcons/LightIcon.tsx";
import DarkIcon from "@/assets/themeIcons/DarkIcon.tsx";
import Resolver from "@/view/resolver.tsx";
import { useThemeStore } from "@/stores/useThemeStore";
import "@/assets/css/App.css";

const App: React.FC = () => {
  const { themeMode, setThemeMode } = useThemeStore();

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
          <div className="flex items-center justify-end">
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
          </div>
          <Space direction="vertical" className="w-full mt-4">
            <Resolver></Resolver>
          </Space>
        </Layout.Content>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
