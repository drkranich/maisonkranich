These SQL files document schema changes already applied directly to the live Maison Kranich Supabase project.

They are intentionally kept outside `supabase/migrations` because they are delta scripts that depend on the existing production schema. A Supabase Preview database starts from a clean schema, so applying only these deltas would fail on missing base objects such as `products`, `profiles`, `subscriptions`, `disputes`, `dispute_status`, and helper functions like `is_staff()`.

When the project is ready for branch previews backed by Supabase migrations, generate a full baseline migration from the live database first, then add future deltas under `supabase/migrations`.
