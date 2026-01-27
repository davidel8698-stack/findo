# RLS Database User Setup

Row-Level Security (RLS) policies only work when the application connects as a **non-superuser** database role. The table owner/superuser bypasses RLS even with `FORCE ROW LEVEL SECURITY`.

## Why This Matters

Findo uses RLS to isolate tenant data at the database level. If the application connects as the database owner (which has superuser privileges), RLS policies are bypassed and tenants can see each other's data.

## Setup Steps

### 1. Create the findo_app Role

Connect to your database as the superuser and run:

```sql
-- Create the application role (no login, no superuser)
CREATE ROLE findo_app NOLOGIN;

-- Create a login user that inherits from findo_app
CREATE USER findo_app_user WITH PASSWORD 'your-secure-password-here' IN ROLE findo_app;
```

### 2. Apply RLS Policies and Grants

Run the RLS script which includes GRANT statements:

```bash
pnpm db:rls
```

This applies:
- RLS policies for tenant isolation
- GRANT permissions for findo_app on all tables
- Default privileges for future tables

### 3. Update DATABASE_URL

Update your `.env` to use the new user:

```
# Before (superuser - BAD for RLS)
DATABASE_URL=postgresql://postgres:password@host:5432/findo

# After (application user - GOOD for RLS)
DATABASE_URL=postgresql://findo_app_user:your-secure-password@host:5432/findo
```

### 4. Keep Superuser Credentials for Migrations

Store superuser credentials separately for migrations:

```
# For running migrations (needs superuser)
DATABASE_URL_ADMIN=postgresql://postgres:password@host:5432/findo

# For application (uses RLS-enforced user)
DATABASE_URL=postgresql://findo_app_user:your-secure-password@host:5432/findo
```

Update `db:migrate` script to use `DATABASE_URL_ADMIN` if set.

## Verification

After setup, run the phase verification:

```bash
pnpm verify:phase1
```

Both Tenant A and Tenant B isolation tests should pass.

## Troubleshooting

### "permission denied for table X"

The findo_app role doesn't have permissions. Re-run:

```bash
pnpm db:rls
```

### "role findo_app does not exist"

Create the role first (Step 1 above).

### RLS still not working

Check that you're connecting as findo_app_user, not postgres:

```sql
SELECT current_user;  -- Should return: findo_app_user
```
