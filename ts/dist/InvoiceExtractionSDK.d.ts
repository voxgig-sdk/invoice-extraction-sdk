import { HealthEntity } from './entity/HealthEntity';
import { InvoiceExtractionEntity } from './entity/InvoiceExtractionEntity';
export type * from './InvoiceExtractionTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { InvoiceExtractionEntityBase } from './InvoiceExtractionEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class InvoiceExtractionSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Health(entopts?: Record<string, any>): HealthEntity;
    InvoiceExtraction(entopts?: Record<string, any>): InvoiceExtractionEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): InvoiceExtractionSDK;
    tester(testopts?: any, sdkopts?: any): InvoiceExtractionSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof InvoiceExtractionSDK;
export { stdutil, config, BaseFeature, InvoiceExtractionEntityBase, InvoiceExtractionSDK, SDK, };
