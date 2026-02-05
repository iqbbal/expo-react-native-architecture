import axios, { AxiosRequestConfig } from "axios";
import { inject, injectable } from "inversiland";
import IHttpClient from "../../domain/specifications/IHttpClient";
import Env, { EnvToken } from "src/core/domain/entities/Env";
import * as AxiosLogger from 'axios-logger';

@injectable()
class HttpClient implements IHttpClient {
  private axios: typeof axios;

  constructor(@inject(EnvToken) private readonly env: Env) {
    this.axios = axios;

    // Konfigurasi logger dengan warna
    const loggerConfig = {
      // Request logger dengan warna biru
      prefixText: '\x1b[36m[Axios Request]\x1b[0m', // Cyan
      dateFormat: 'HH:MM:ss',
      status: true,
      headers: false,
    };

    const responseLoggerConfig = {
      // Response logger dengan warna hijau
      prefixText: '\x1b[32m[Axios Response]\x1b[0m', // Green
      dateFormat: 'HH:MM:ss',
      status: true,
      headers: false,
    };

    const errorLoggerConfig = {
      // Error logger dengan warna merah
      prefixText: '\x1b[31m[Axios Error]\x1b[0m', // Red
      dateFormat: 'HH:MM:ss',
      status: true,
      headers: false,
    };

    // Request Interceptor dengan axios-logger + warna
    axios.interceptors.request.use(
      (request) => AxiosLogger.requestLogger(request, loggerConfig),
      (error) => AxiosLogger.errorLogger(error, errorLoggerConfig)
    );

    // Custom request interceptor untuk set baseURL dan auth
    axios.interceptors.request.use((requestConfig) => {
      requestConfig.baseURL = env.apiUrl;

      // TODO: add authentication

      return requestConfig;
    });

    // Response Interceptor dengan axios-logger + warna
    this.axios.interceptors.response.use(
      (response) => AxiosLogger.responseLogger(response, responseLoggerConfig),
      (error) => AxiosLogger.errorLogger(error, errorLoggerConfig)
    );

    // Custom response interceptor untuk handle auth errors
    this.axios.interceptors.response.use(undefined, (err) => {
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          // TODO: logout
          console.log('🔐 Authentication Error - TODO: implement logout');
        }
      }

      return Promise.reject(err);
    });
  }

  public get<ResponseType>(url: string, config?: AxiosRequestConfig) {
    return this.axios
      .get<ResponseType>(url, config)
      .then((response) => response.data);
  }

  public post<DataType, ResponseType>(
    url: string,
    data?: DataType,
    config?: AxiosRequestConfig
  ) {
    return this.axios
      .post<ResponseType>(url, data, config)
      .then((response) => response.data);
  }

  public patch<DataType, ResponseType>(
    url: string,
    data?: DataType,
    config?: AxiosRequestConfig
  ) {
    return this.axios
      .patch<ResponseType>(url, data, config)
      .then((response) => response.data);
  }

  public delete<ResponseType>(url: string, config?: AxiosRequestConfig) {
    return this.axios
      .delete<ResponseType>(url, config)
      .then((response) => response.data);
  }
}

export default HttpClient;
