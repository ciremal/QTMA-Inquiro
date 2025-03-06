import { ChartOptions } from "chart.js";

declare module "chart.js" {
  interface PluginOptionsByType<TType> {
    crosshair?: {
      line?: {
        color?: string;
        width?: number;
        dashPattern?: number[];
      };
      zoom?: {
        enabled?: boolean;
        zoomboxBackgroundColor?: string;
        zoomboxBorderColor?: string;
        zoomButtonText?: string;
        zoomButtonClass?: string;
      };
      sync?: {
        enabled?: boolean;
        group?: number;
        suppressTooltips?: boolean;
      };
      snap?: {
        enabled?: boolean;
      };
    };
  }
}
