SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', 'c508a4c8-66c8-487b-a9ec-3264ecdc9d42', 'authenticated', 'authenticated', 'admin@email.com', '$2a$10$MG4QUnc6jgkR4AZwNWFvLudBWfzTBRBMjPdtt1wouB1q6hnHUET7i', '2024-11-15 14:33:00.565529+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-09 08:19:42.087589+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-11-15 14:33:00.557037+00', '2024-12-09 08:19:42.089821+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '1864dd85-d7ba-4ff5-b1bf-b6deba3c70c9', 'authenticated', 'authenticated', 'user1@email.com', '$2a$10$pdJhC3J1S6341QMLFPUe3.7UBazP5ouCj2cHPma5zwJmdvU/V5G32', '2024-12-09 08:25:02.515502+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-09 08:25:16.618922+00', '{"provider": "email", "providers": ["email"]}', '{"name": "user 1"}', NULL, '2024-12-09 08:25:02.504255+00', '2024-12-09 08:25:16.620784+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('c508a4c8-66c8-487b-a9ec-3264ecdc9d42', 'c508a4c8-66c8-487b-a9ec-3264ecdc9d42', '{"sub": "c508a4c8-66c8-487b-a9ec-3264ecdc9d42", "email": "admin@email.com", "email_verified": false, "phone_verified": false}', 'email', '2024-11-15 14:33:00.562907+00', '2024-11-15 14:33:00.562966+00', '2024-11-15 14:33:00.562966+00', '4c775529-5efe-41b9-8b70-25b08f975dfa'),
	('1864dd85-d7ba-4ff5-b1bf-b6deba3c70c9', '1864dd85-d7ba-4ff5-b1bf-b6deba3c70c9', '{"sub": "1864dd85-d7ba-4ff5-b1bf-b6deba3c70c9", "email": "user1@email.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-09 08:25:02.513414+00', '2024-12-09 08:25:02.513468+00', '2024-12-09 08:25:02.513468+00', '183b5967-1945-4801-ad9b-50d756c50c2e');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: user_profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_profiles" ("id", "created_at", "updated_at", "deleted_at", "name") VALUES
	('c508a4c8-66c8-487b-a9ec-3264ecdc9d42', '2024-11-15 14:33:00.556729+00', '2024-11-15 14:33:00.556729+00', NULL, 'Admin'),
	('1864dd85-d7ba-4ff5-b1bf-b6deba3c70c9', '2024-12-09 08:25:02.503918+00', '2024-12-09 08:25:02.503918+00', NULL, 'user 1');


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_roles" ("id", "created_at", "updated_at", "name") VALUES
	(1, '2024-11-15 08:26:01.551551+00', '2024-11-15 08:26:01.551551+00', 'USER'),
	(2, '2024-11-15 08:26:07.428442+00', '2024-11-15 08:26:07.428442+00', 'ADMIN');


--
-- Data for Name: user_role_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user_role_members" ("id", "created_at", "updated_at", "user_id", "user_role_id") VALUES
	(1, '2024-11-21 05:49:09.913739+00', '2024-11-21 05:49:09.913739+00', 'c508a4c8-66c8-487b-a9ec-3264ecdc9d42', 2),
	(2, '2024-12-09 08:25:02.503918+00', '2024-12-09 08:25:02.503918+00', '1864dd85-d7ba-4ff5-b1bf-b6deba3c70c9', 1);


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--



--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: user_role_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_role_members_id_seq"', 2, true);


--
-- Name: user_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."user_roles_id_seq"', 2, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
