import { InvoiceExtractionEntityBase } from '../InvoiceExtractionEntityBase';
import type { InvoiceExtractionSDK } from '../InvoiceExtractionSDK';
import type { Control } from '../types';
import type { InvoiceExtraction, InvoiceExtractionCreateData } from '../InvoiceExtractionTypes';
declare class InvoiceExtractionEntity extends InvoiceExtractionEntityBase<InvoiceExtraction> {
    constructor(client: InvoiceExtractionSDK, entopts: any);
    make(this: InvoiceExtractionEntity): InvoiceExtractionEntity;
    create(this: any, reqdata?: InvoiceExtractionCreateData, ctrl?: Control): Promise<InvoiceExtractionEntity>;
}
export { InvoiceExtractionEntity };
