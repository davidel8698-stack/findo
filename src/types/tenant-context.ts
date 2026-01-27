import type { Tenant } from '../db/schema/index';
// Import Hono to enable module augmentation
import 'hono';

export interface TenantContext {
  tenantId: string;
  tenant?: Tenant;
}

// Extend Hono context with tenant info
declare module 'hono' {
  interface ContextVariableMap {
    tenant: TenantContext;
  }
}
