declare module 'opentelemetry-node-metrics' {
  import type { MeterProvider } from "@opentelemetry/api";

  type Config = {
    prefix?: string;
    labels?: Record<string, string>;
  }

  function setupNodeMetrics(meterProvider: MeterProvider, config?: Config): void;
  export = setupNodeMetrics;
}
