import { InvoiceExtractionEntityBase } from '../InvoiceExtractionEntityBase';
import type { InvoiceExtractionSDK } from '../InvoiceExtractionSDK';
import type { Control } from '../types';
import type { Health, HealthLoadMatch } from '../InvoiceExtractionTypes';
declare class HealthEntity extends InvoiceExtractionEntityBase<Health> {
    constructor(client: InvoiceExtractionSDK, entopts: any);
    make(this: HealthEntity): HealthEntity;
    load(this: any, reqmatch?: HealthLoadMatch, ctrl?: Control): Promise<HealthEntity>;
}
export { HealthEntity };
