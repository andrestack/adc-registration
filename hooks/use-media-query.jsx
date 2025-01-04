
import { useMediaQuery as useMediaQueryHook } from "@uidotdev/usehooks";

export function useMediaQuery(query) {
  return useMediaQueryHook(query);
}

export function useResponsive() {
  const isSmallDevice = useMediaQueryHook("only screen and (max-width : 768px)");
  const isMediumDevice = useMediaQueryHook(
    "only screen and (min-width : 769px) and (max-width : 992px)"
  );
  const isLargeDevice = useMediaQueryHook(
    "only screen and (min-width : 993px) and (max-width : 1200px)"
  );
  const isExtraLargeDevice = useMediaQueryHook(
    "only screen and (min-width : 1201px)"
  );

  return { isSmallDevice, isMediumDevice, isLargeDevice, isExtraLargeDevice };
}