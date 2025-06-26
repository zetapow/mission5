import { useEffect } from "react";
import * as maptilersdk from "@maptiler/sdk";

export const useMapConfig = (apiKey) => {
  useEffect(() => {
    if (apiKey) {
      maptilersdk.config.apiKey = apiKey;
    }
  }, [apiKey]);
};
