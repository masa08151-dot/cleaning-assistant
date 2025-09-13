create type source_type as enum ('ical','email');
create type res_status as enum ('confirmed','canceled');

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  address text,
  access text,
  checkin_code text,
  parking text,
  trash_rules text,
  wifi_ssid text,
  wifi_pass text,
  beds_json jsonb default '[]'::jsonb,
  notes text
);

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  property_id uuid references properties(id) on delete cascade,
  type source_type not null,
  label text,
  url_or_rule text not null,
  active boolean default true
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  uid text,
  start_at timestamptz,
  end_at timestamptz,
  pax int,
  guest_name text,
  raw_json jsonb,
  status res_status default 'confirmed'
);
create unique index if not exists reservations_uid_idx on reservations(uid);

create table if not exists cleaning_jobs (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references reservations(id) on delete cascade,
  summary_text text,
  priority int default 0,
  assigned_to text,
  status text default 'pending'
);

create or replace function list_today_cleanings()
returns table(reservation jsonb, property jsonb, cleaning_job jsonb)
language sql stable as $$
  select
    to_jsonb(r.*) as reservation,
    to_jsonb(p.*) as property,
    (
      select to_jsonb(cj.*) from cleaning_jobs cj
      where cj.reservation_id = r.id limit 1
    ) as cleaning_job
  from reservations r
  join properties p on p.id = r.property_id
  where r.status = 'confirmed'
    and (r.end_at at time zone 'Asia/Tokyo')::date = (now() at time zone 'Asia/Tokyo')::date
  order by r.end_at asc;
$$;
