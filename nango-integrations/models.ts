// ---------------------------
// This file was generated by Nango (v0.42.12)
// It's recommended to version this file
// https://nango.dev
// ---------------------------

// ------ Models
export interface Integration {
  [key: string]: any;
  id: string;
};
// ------ /Models

// ------ SDK

import { Nango } from '@nangohq/node';
import type { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig } from 'axios';
import type { SyncConfig } from '../models/Sync.js';
import type { RunnerFlags } from '../services/sync/run.utils.js';
import type { DBTeam } from '@nangohq/types';
export declare const oldLevelToNewLevel: {
    readonly debug: "debug";
    readonly info: "info";
    readonly warn: "warn";
    readonly error: "error";
    readonly verbose: "debug";
    readonly silly: "debug";
    readonly http: "info";
};
type LogLevel = 'info' | 'debug' | 'error' | 'warn' | 'http' | 'verbose' | 'silly';
type ParamEncoder = (value: any, defaultEncoder: (value: any) => any) => any;
interface GenericFormData {
    append(name: string, value: any, options?: any): any;
}
type SerializerVisitor = (this: GenericFormData, value: any, key: string | number, path: null | (string | number)[], helpers: FormDataVisitorHelpers) => boolean;
type CustomParamsSerializer = (params: Record<string, any>, options?: ParamsSerializerOptions) => string;
interface FormDataVisitorHelpers {
    defaultVisitor: SerializerVisitor;
    convertValue: (value: any) => any;
    isVisitable: (value: any) => boolean;
}
interface SerializerOptions {
    visitor?: SerializerVisitor;
    dots?: boolean;
    metaTokens?: boolean;
    indexes?: boolean | null;
}
interface ParamsSerializerOptions extends SerializerOptions {
    encode?: ParamEncoder;
    serialize?: CustomParamsSerializer;
}
export interface AxiosResponse<T = any, D = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: D;
    request?: any;
}
interface Pagination {
    type: string;
    limit?: number;
    response_path?: string;
    limit_name_in_request: string;
}
interface CursorPagination extends Pagination {
    cursor_path_in_response: string;
    cursor_name_in_request: string;
}
interface LinkPagination extends Pagination {
    link_rel_in_response_header?: string;
    link_path_in_response_body?: string;
}
interface OffsetPagination extends Pagination {
    offset_name_in_request: string;
    offset_start_value?: number;
}
interface RetryHeaderConfig {
    at?: string;
    after?: string;
}
export interface ProxyConfiguration {
    endpoint: string;
    providerConfigKey?: string;
    connectionId?: string;
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' | 'get' | 'post' | 'patch' | 'put' | 'delete';
    headers?: Record<string, string>;
    params?: string | Record<string, string | number>;
    paramsSerializer?: ParamsSerializerOptions;
    data?: unknown;
    retries?: number;
    baseUrlOverride?: string;
    paginate?: Partial<CursorPagination> | Partial<LinkPagination> | Partial<OffsetPagination>;
    retryHeader?: RetryHeaderConfig;
    responseType?: 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
    retryOn?: number[] | null;
}
export interface AuthModes {
    OAuth1: 'OAUTH1';
    OAuth2: 'OAUTH2';
    OAuth2CC: 'OAUTH2_CC';
    Basic: 'BASIC';
    ApiKey: 'API_KEY';
    AppStore: 'APP_STORE';
    Custom: 'CUSTOM';
    App: 'APP';
    None: 'NONE';
    TBA: 'TBA';
    Tableau: 'TABLEAU';
}
export type AuthModeType = AuthModes[keyof AuthModes];
interface OAuth1Token {
    oAuthToken: string;
    oAuthTokenSecret: string;
}
interface AppCredentials {
    type: AuthModes['App'];
    access_token: string;
    expires_at?: Date | undefined;
    raw: Record<string, any>;
}
interface AppStoreCredentials {
    type?: AuthModes['AppStore'];
    access_token: string;
    expires_at?: Date | undefined;
    raw: Record<string, any>;
    private_key: string;
}
interface BasicApiCredentials {
    type: AuthModes['Basic'];
    username: string;
    password: string;
}
interface ApiKeyCredentials {
    type: AuthModes['ApiKey'];
    apiKey: string;
}
interface CredentialsCommon<T = Record<string, any>> {
    type: AuthModeType;
    raw: T;
}
interface OAuth2Credentials extends CredentialsCommon {
    type: AuthModes['OAuth2'];
    access_token: string;
    refresh_token?: string;
    expires_at?: Date | undefined;
}
interface OAuth2ClientCredentials extends CredentialsCommon {
    type: AuthModes['OAuth2CC'];
    token: string;
    expires_at?: Date | undefined;
    client_id: string;
    client_secret: string;
}
interface OAuth1Credentials extends CredentialsCommon {
    type: AuthModes['OAuth1'];
    oauth_token: string;
    oauth_token_secret: string;
}
interface TbaCredentials {
    type: AuthModes['TBA'];
    token_id: string;
    token_secret: string;
    config_override: {
        client_id?: string;
        client_secret?: string;
    };
}
interface TableauCredentials extends CredentialsCommon {
    type: AuthModes['Tableau'];
    pat_name: string;
    pat_secret: string;
    content_url?: string;
    token?: string;
    expires_at?: Date | undefined;
}
interface CustomCredentials extends CredentialsCommon {
    type: AuthModes['Custom'];
}
type UnauthCredentials = Record<string, never>;
type AuthCredentials = OAuth2Credentials | OAuth2ClientCredentials | OAuth1Credentials | BasicApiCredentials | ApiKeyCredentials | AppCredentials | AppStoreCredentials | UnauthCredentials | TbaCredentials | TableauCredentials | CustomCredentials;
type Metadata = Record<string, unknown>;
interface MetadataChangeResponse {
    metadata: Metadata;
    provider_config_key: string;
    connection_id: string | string[];
}
interface Connection {
    id?: number;
    created_at: Date;
    updated_at: Date;
    provider_config_key: string;
    connection_id: string;
    connection_config: Record<string, string>;
    environment_id: number;
    metadata?: Metadata | null;
    credentials_iv?: string | null;
    credentials_tag?: string | null;
    credentials: AuthCredentials;
}
export declare class ActionError<T = Record<string, unknown>> extends Error {
    type: string;
    payload?: Record<string, unknown>;
    constructor(payload?: T);
}
interface RunArgs {
    sync: string;
    connectionId: string;
    lastSyncDate?: string;
    useServerLastSyncDate?: boolean;
    input?: object;
    metadata?: Metadata;
    autoConfirm: boolean;
    debug: boolean;
    optionalEnvironment?: string;
    optionalProviderConfigKey?: string;
}
export interface DryRunServiceInterface {
    run: (options: RunArgs, debug?: boolean) => Promise<string | void>;
}
export interface NangoProps {
    scriptType: 'sync' | 'action' | 'webhook' | 'post-connection-script';
    host?: string;
    secretKey: string;
    team?: Pick<DBTeam, 'id' | 'name'>;
    connectionId: string;
    environmentId: number;
    environmentName?: string;
    activityLogId?: string | undefined;
    providerConfigKey: string;
    provider: string;
    lastSyncDate?: Date;
    syncId?: string | undefined;
    nangoConnectionId?: number;
    syncJobId?: number | undefined;
    dryRun?: boolean;
    track_deletes?: boolean;
    attributes?: object | undefined;
    logMessages?: {
        counts: {
            updated: number;
            added: number;
            deleted: number;
        };
        messages: unknown[];
    } | undefined;
    rawSaveOutput?: Map<string, unknown[]> | undefined;
    rawDeleteOutput?: Map<string, unknown[]> | undefined;
    stubbedMetadata?: Metadata | undefined;
    abortSignal?: AbortSignal;
    dryRunService?: DryRunServiceInterface;
    syncConfig: SyncConfig;
    runnerFlags: RunnerFlags;
    debug: boolean;
    startedAt: Date;
    axios?: {
        request?: AxiosInterceptorManager<AxiosRequestConfig>;
        response?: {
            onFulfilled: (value: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
        };
    };
}
export interface EnvironmentVariable {
    name: string;
    value: string;
}
export declare const defaultPersistApi: AxiosInstance;
export declare class NangoAction {
    protected nango: Nango;
    private attributes;
    protected persistApi: AxiosInstance;
    activityLogId?: string | undefined;
    syncId?: string;
    nangoConnectionId?: number;
    environmentId: number;
    environmentName?: string;
    syncJobId?: number;
    dryRun?: boolean;
    abortSignal?: AbortSignal;
    dryRunService?: DryRunServiceInterface;
    syncConfig?: SyncConfig;
    runnerFlags: RunnerFlags;
    connectionId: string;
    providerConfigKey: string;
    provider?: string;
    ActionError: typeof ActionError;
    private memoizedConnections;
    private memoizedIntegration;
    constructor(config: NangoProps, { persistApi }?: {
        persistApi: AxiosInstance;
    });
    protected stringify(): string;
    private proxyConfig;
    protected exitSyncIfAborted(): void;
    proxy<T = any>(config: ProxyConfiguration): Promise<AxiosResponse<T>>;
    get<T = any>(config: Omit<ProxyConfiguration, 'method'>): Promise<AxiosResponse<T>>;
    post<T = any>(config: Omit<ProxyConfiguration, 'method'>): Promise<AxiosResponse<T>>;
    put<T = any>(config: Omit<ProxyConfiguration, 'method'>): Promise<AxiosResponse<T>>;
    patch<T = any>(config: Omit<ProxyConfiguration, 'method'>): Promise<AxiosResponse<T>>;
    delete<T = any>(config: Omit<ProxyConfiguration, 'method'>): Promise<AxiosResponse<T>>;
    getToken(): Promise<string | OAuth1Token | OAuth2ClientCredentials | BasicApiCredentials | ApiKeyCredentials | AppCredentials | AppStoreCredentials | UnauthCredentials | CustomCredentials | TbaCredentials | TableauCredentials>;
    getConnection(providerConfigKeyOverride?: string, connectionIdOverride?: string): Promise<Connection>;
    setMetadata(metadata: Metadata): Promise<AxiosResponse<MetadataChangeResponse>>;
    updateMetadata(metadata: Metadata): Promise<AxiosResponse<MetadataChangeResponse>>;
    /**
     * @deprecated please use setMetadata instead.
     */
    setFieldMapping(fieldMapping: Record<string, string>): Promise<AxiosResponse<object>>;
    getMetadata<T = Metadata>(): Promise<T>;
    getWebhookURL(): Promise<string | null | undefined>;
    /**
     * @deprecated please use getMetadata instead.
     */
    getFieldMapping(): Promise<Metadata>;
    /**
     * Log
     * @desc Log a message to the activity log which shows up in the Nango Dashboard
     * note that the last argument can be an object with a level property to specify the log level
     * @example
     * ```ts
     * await nango.log('This is a log message', { level: 'error' })
     * ```
     */
    log(message: any, options?: {
        level?: LogLevel;
    } | {
        [key: string]: any;
        level?: never;
    }): Promise<void>;
    log(message: string, ...args: [any, {
        level?: LogLevel;
    }]): Promise<void>;
    getEnvironmentVariables(): Promise<EnvironmentVariable[] | null>;
    getFlowAttributes<A = object>(): A | null;
    paginate<T = any>(config: ProxyConfiguration): AsyncGenerator<T[], undefined, void>;
    triggerAction<In = unknown, Out = object>(providerConfigKey: string, connectionId: string, actionName: string, input?: In): Promise<Out>;
    triggerSync(providerConfigKey: string, connectionId: string, syncName: string, fullResync?: boolean): Promise<void | string>;
    private sendLogToPersist;
}
export declare class NangoSync extends NangoAction {
    lastSyncDate?: Date;
    track_deletes: boolean;
    logMessages?: {
        counts: {
            updated: number;
            added: number;
            deleted: number;
        };
        messages: unknown[];
    } | undefined;
    rawSaveOutput?: Map<string, unknown[]>;
    rawDeleteOutput?: Map<string, unknown[]>;
    stubbedMetadata?: Metadata | undefined;
    private batchSize;
    constructor(config: NangoProps);
    /**
     * @deprecated please use batchSave
     */
    batchSend<T = any>(results: T[], model: string): Promise<boolean | null>;
    batchSave<T = any>(results: T[], model: string): Promise<boolean | null>;
    batchDelete<T = any>(results: T[], model: string): Promise<boolean | null>;
    batchUpdate<T = any>(results: T[], model: string): Promise<boolean | null>;
    getMetadata<T = Metadata>(): Promise<T>;
}
/**
 * @internal
 *
 * This function will enable tracing on the SDK
 * It has been split from the actual code to avoid making the code too dirty and to easily enable/disable tracing if there is an issue with it
 */
export declare function instrumentSDK(rawNango: NangoAction | NangoSync): NangoAction | NangoSync;
export {};



// ------ /SDK

// ------ Flows
export const NangoFlows = [
  {
    "providerConfigKey": "unauthenticated",
    "syncs": [
      {
        "name": "providers",
        "type": "sync",
        "description": "Keep all integrations in the providers.yaml in sync",
        "sync_type": "full",
        "usedModels": [
          "Integration"
        ],
        "runs": "every day",
        "version": "",
        "track_deletes": true,
        "auto_start": true,
        "input": null,
        "output": [
          "Integration"
        ],
        "scopes": [],
        "endpoints": [
          {
            "GET": "/providers"
          }
        ],
        "webhookSubscriptions": []
      }
    ],
    "actions": [],
    "postConnectionScripts": []
  }
] as const;
// ------ /Flows
