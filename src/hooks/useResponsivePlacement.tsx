import { useState, useEffect } from "react";

type Placement = "rightTop" | "bottom";

/**
 * @description 动态检测设备类型并返回适合的 Popover placement
 * @returns {Placement} Popover 的 placement 值
 */
const useResponsivePlacement = (): Placement => {
  const [placement, setPlacement] = useState<Placement>("rightTop");

  const updatePlacement = () => {
    const isMobile = window.innerWidth < 768;
    setPlacement(isMobile ? "bottom" : "rightTop");
  };

  useEffect(() => {
    updatePlacement(); // 初始化
    window.addEventListener("resize", updatePlacement);
    return () => {
      window.removeEventListener("resize", updatePlacement);
    };
  }, []);

  return placement;
};

export default useResponsivePlacement;
