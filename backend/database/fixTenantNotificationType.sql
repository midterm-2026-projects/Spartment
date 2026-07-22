-- Fixes tenant creation failing with notifications_type_check.
-- Run once in the Supabase SQL Editor.
begin;

create or replace function public.fix_tenant_account_notification_type()
returns trigger
language plpgsql
as $$
begin
  if new.type = 'tenant_account' then
    new.type := 'Account';
  end if;
  return new;
end;
$$;

drop trigger if exists normalize_tenant_account_notification_type
on public.notifications;

create trigger normalize_tenant_account_notification_type
before insert or update of type on public.notifications
for each row
execute function public.fix_tenant_account_notification_type();

commit;

-- Verification: should return Account without inserting a row.
select 'Account'::text as tenant_notification_type;
