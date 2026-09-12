export interface Health {
    status?: string;
    timestamp?: string;
}
export interface HealthLoadMatch {
    status?: string;
    timestamp?: string;
}
export interface InvoiceExtraction {
    amounts?: Record<string, any>;
    confidence?: number;
    document?: Record<string, any>;
    file_base64: string;
    issuer?: Record<string, any>;
    items?: any[];
    media_type: string;
    receiver?: Record<string, any>;
}
export interface InvoiceExtractionCreateData {
    amounts?: Record<string, any>;
    confidence?: number;
    document?: Record<string, any>;
    file_base64: string;
    issuer?: Record<string, any>;
    items?: any[];
    media_type: string;
    receiver?: Record<string, any>;
}
