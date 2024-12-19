import type { MenuProps } from "antd";
import { BaiduOutlined, GithubOutlined, HeartOutlined } from "@ant-design/icons";

const getMenuItems = (): MenuProps["items"] => [
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

export default getMenuItems;
