/*instrumentation.ts*/
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import {
  PeriodicExportingMetricReader,
} from '@opentelemetry/sdk-metrics';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// only use otel in dev mode
if (!process.env.APP_VERSION!.includes("dev")) {
  const sdk = new NodeSDK({
    serviceName: process.env.OTEL_SERVICE_NAME ?? "emails.sapphirenw.com",
    traceExporter: new OTLPTraceExporter({
      // optional - default url is http://localhost:4318/v1/traces
      url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/traces`,
      // optional - collection of custom headers to be sent with each request, empty by default
      headers: {},
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}/v1/metrics`, // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
        headers: {}, // an optional object containing custom headers to be sent with each request
      }),
    }),
    instrumentations: [
      getNodeAutoInstrumentations()
    ],
  });
  
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
  
  sdk.start();
}