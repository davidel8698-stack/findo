-- Row-Level Security Policies for Findo Multi-Tenant Isolation
-- Run this after migrations to enable tenant isolation at database level
--
-- IMPORTANT: These policies use app.current_tenant session variable
-- which must be set via: SET app.current_tenant = 'tenant-uuid-here'
-- before any queries are executed.

-- Enable RLS on tenants table (read own tenant only)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenants_isolation ON tenants
  USING (id = current_setting('app.current_tenant', true)::uuid);

-- Enable RLS on activity_events table
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY activity_events_isolation ON activity_events
  USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- Enable RLS on token_vault table
ALTER TABLE token_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY token_vault_isolation ON token_vault
  USING (tenant_id = current_setting('app.current_tenant', true)::uuid);

-- Grant permissions for application user
-- Note: Replace 'findo_app' with your actual database user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO findo_app;

-- Force RLS for table owner (important for security)
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE activity_events FORCE ROW LEVEL SECURITY;
ALTER TABLE token_vault FORCE ROW LEVEL SECURITY;

-- Helper function to set tenant context (used by application)
CREATE OR REPLACE FUNCTION set_tenant_context(tenant_uuid uuid)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_tenant', tenant_uuid::text, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current tenant (for debugging)
CREATE OR REPLACE FUNCTION get_current_tenant()
RETURNS uuid AS $$
BEGIN
  RETURN current_setting('app.current_tenant', true)::uuid;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- APPLICATION USER SETUP
-- =============================================================================
-- The application must connect as 'findo_app' user (NOT the table owner/superuser)
-- to enforce RLS policies. The table owner bypasses RLS even with FORCE ROW LEVEL SECURITY.
--
-- Run these commands as the database superuser/owner:

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO findo_app;

-- Grant table permissions (SELECT, INSERT, UPDATE, DELETE on all current tables)
GRANT SELECT, INSERT, UPDATE, DELETE ON tenants TO findo_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON activity_events TO findo_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON token_vault TO findo_app;

-- Grant sequence permissions (for auto-generated IDs if any)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO findo_app;

-- Grant execute on helper functions
GRANT EXECUTE ON FUNCTION set_tenant_context(uuid) TO findo_app;
GRANT EXECUTE ON FUNCTION get_current_tenant() TO findo_app;

-- DEFAULT PRIVILEGES: Grant permissions on future tables created by owner
ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO findo_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO findo_app;
