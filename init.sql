INSERT INTO public.user
 (username, "passwordHash", roles)
VALUES (
  'kanaliiga-apex-dev',
  '$2a$12$1U/vApA73hW.FFfz9xXKCOlmczf05VslMFmgcTQxxeXxxhtk8Z83a',
  ARRAY['ADMIN']::user_roles_enum[]
);