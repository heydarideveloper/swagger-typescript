import { readFileSync } from "fs";
import path from "path";
const HTTP_REQUEST = readFileSync(
  path.resolve(__dirname, "../files/httpRequest.tsf"),
).toString();

const CONFIG = readFileSync(
  path.resolve(__dirname, "../files/config.tsf"),
).toString();

const SERVICE_BEGINNING = `
/**
 * AUTO_GENERATED Do not change this file directly, use config.ts file instead
 *
 * @version 4
 */
import { AxiosRequestConfig } from "axios";
import { SwaggerResponse } from "./config";
import { Http } from "./httpRequest";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const __DEV__ = process.env.NODE_ENV !== "production";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function overrideConfig(
  config?: AxiosRequestConfig,
  configOverride?: AxiosRequestConfig,
): AxiosRequestConfig {
  return {
    ...config,
    ...configOverride,
    headers: {
      ...config?.headers,
      ...configOverride?.headers,
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function template(path: string, obj: { [x: string]: any } = {}) {
    Object.keys(obj).forEach((key) => {
      const re = new RegExp(\`{\${key}}\`, "i");
      path = path.replace(re, obj[key]);
    });

    return path;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function objToForm(requestBody: { [name: string]: string | Blob | undefined }) {
  const formData = new FormData();

  Object.entries(requestBody).forEach(([key, value]) => {
    value && formData.append(key, value);
  });

  return formData;
}
`;

const DEPRECATED_WARM_MESSAGE =
  "This endpoint deprecated and will be remove. Please use an alternative";

export { HTTP_REQUEST, SERVICE_BEGINNING, CONFIG, DEPRECATED_WARM_MESSAGE };
