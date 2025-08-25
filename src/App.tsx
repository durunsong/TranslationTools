import React, { useEffect, useMemo, Suspense } from "react";
import {
  Layout,
  Space,
  ConfigProvider,
  Segmented,
  theme,
  Dropdown,
  Typography,
  Spin,
} from "antd";
import {
  DownOutlined,
} from "@ant-design/icons";
import LightIcon from "@/assets/themeIcons/LightIcon.tsx";
import DarkIcon from "@/assets/themeIcons/DarkIcon.tsx";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useThemeStore } from "@/stores/useThemeStore";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import getMenuItems from "@/components/MenuItems"; 
import "@/assets/css/App.css";
import { useTranslation } from "react-i18next";

const Resolver = React.lazy(() => import("@/view/resolver.tsx"));

const { Text } = Typography;

const App: React.FC = () => {
  const { themeMode, setThemeMode } = useThemeStore();
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  const handleThemeChange = (value: string) => {
    setThemeMode(value);
    document.documentElement.classList.toggle("dark", value === "dark");
  };

  const currentTheme = useMemo(() => ({
    algorithm: themeMode === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
    components: {
      Segmented: {
        itemColor: themeMode === "light" ? "#000" : "#fff",
        itemHoverColor: themeMode === "light" ? "#1890ff" : "#40a9ff",
        itemSelectedBg: themeMode === "light" ? "#eab308" : "#662626",
        trackPadding: 3,
      },
    },
  }), [themeMode]);

  return (
    <ErrorBoundary>
      <ConfigProvider theme={currentTheme}>
        <Layout className="min-h-screen bg-gray-100 dark:bg-gray-800">
          <Layout.Content className="p-1 sm:p-4 max-w-full overflow-hidden">
            <Space className="flex items-center justify-end flex-wrap w-full">
              <Dropdown menu={{ items: getMenuItems() }}>
                <Space className="cursor-pointer">
                  <Text>{t('header.apiDocsAndCode')}</Text>
                  <DownOutlined />
                </Space>
              </Dropdown>
              <LanguageSwitcher />
              <Segmented
                size="small"
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
                className={`theme-switcher px-0.5 rounded-lg ${
                  themeMode === "light"
                    ? "bg-gray-100 text-black"
                    : "bg-gray-700 text-white"
                }`}
                onChange={(value) => handleThemeChange(value as string)}
              />
            </Space>
            <Space direction="vertical" className="w-full mt-4">
              <Suspense 
                fallback={
                  <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
                    <Spin size="large" spinning={true} />
                    <div className="text-lg text-gray-600 dark:text-gray-300">
                      {t('common.loading')}
                    </div>
                  </div>
                }
              >
                <Resolver />
              </Suspense>
            </Space>
          </Layout.Content>
        </Layout>
      </ConfigProvider>
    </ErrorBoundary>
  );
};

export default App;
