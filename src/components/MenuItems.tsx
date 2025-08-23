import type { MenuProps } from "antd";
import { BaiduOutlined, GithubOutlined, HeartOutlined } from "@ant-design/icons";
import i18n from "@/i18n";

const getMenuItems = (): MenuProps["items"] => [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://fanyi-api.baidu.com/doc/21"
      >
{i18n.t('menu.baiduApiDocs')}
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
{i18n.t('menu.githubRepo')}
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
{i18n.t('menu.starRepo')}
      </a>
    ),
    extra: "⌘S",
    icon: <HeartOutlined />,
  },
];

export default getMenuItems;
