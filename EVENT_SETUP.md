# Paradox / Infinity — 10 Team Event Setup

## Architecture
- `/` opens the existing player splash/lobby.
- `ADMIN` opens the separate Admin Control login.
- Players use Username + Friend Code through `login_player`.
- Admin uses the Supabase Auth email/password account already present in `admin_users`.
- Both dashboards read the same `game_state` and `teams` tables in realtime.
- Admin controls game state/timer/messages; players see those changes.
- Players can submit their team score; the admin leaderboard reflects `teams.score` when the database permits that update.

## Critical admin login requirement
The Admin account must have a valid **Supabase Auth password**. The row in `public.admin_users` only authorizes an already-authenticated Supabase user; it does not create a password.

If Supabase says `Invalid login credentials`, set/reset the password for the existing Auth user in Supabase Dashboard → Authentication → Users. The email must be the same Auth user whose UUID is in `public.admin_users`.

## Existing database assumptions
This frontend expects the existing project objects already used by the previous site:
- `login_player` RPC
- `admin_users`
- `teams`
- `game_state`
- `admin_update_game_state` RPC
- `admin_start_timer` RPC
- `admin_stop_timer` RPC
- `admin_reset_timer` RPC

Do not delete or recreate these objects during the event.
