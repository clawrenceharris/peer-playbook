import { pgSchema, pgEnum, pgTable, uuid, text, varchar, timestamp, bigserial, smallint, jsonb, customType, json, boolean, inet, integer, bigint, index, uniqueIndex, foreignKey, primaryKey, unique, check, pgPolicy } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const auth = pgSchema("auth");
export const factorTypeInAuth = auth.enum("factor_type", ["totp", "webauthn", "phone"])
export const factorStatusInAuth = auth.enum("factor_status", ["unverified", "verified"])
export const aalLevelInAuth = auth.enum("aal_level", ["aal1", "aal2", "aal3"])
export const codeChallengeMethodInAuth = auth.enum("code_challenge_method", ["s256", "plain"])
export const oneTimeTokenTypeInAuth = auth.enum("one_time_token_type", ["confirmation_token", "reauthentication_token", "recovery_token", "email_change_token_new", "email_change_token_current", "phone_change_token"])
export const oauthRegistrationTypeInAuth = auth.enum("oauth_registration_type", ["dynamic", "manual"])
export const oauthAuthorizationStatusInAuth = auth.enum("oauth_authorization_status", ["pending", "approved", "denied", "expired"])
export const oauthResponseTypeInAuth = auth.enum("oauth_response_type", ["code"])
export const oauthClientTypeInAuth = auth.enum("oauth_client_type", ["public", "confidential"])
export const lessonPhase = pgEnum("lesson_phase", ["warmup", "workout", "closer"])
export const sessionSize = pgEnum("session_size", ["1+", "2+", "4+", "2-4", "4-8", "8+"])
export const sessionStatus = pgEnum("session_status", ["scheduled", "active", "completed", "canceled"])
export const userRole = pgEnum("user_role", ["si_leader", "student", "coordinator", "recitation_leader", "student_mentor", "club_leader", "study_group_organizer", "ta", "tutor"])
export const sessionMode = pgEnum("session_mode", ["in-person", "virtual", "hybrid"])


export const auditLogEntriesInAuth = auth.table.withRLS("audit_log_entries", {
	instanceId: uuid("instance_id"),
	id: uuid().primaryKey(),
	payload: json(),
	createdAt: timestamp("created_at", { withTimezone: true }),
	ipAddress: varchar("ip_address", { length: 64 }).default("").notNull(),
}, (table) => [
	index("audit_logs_instance_id_idx").using("btree", table.instanceId.asc().nullsLast()),
]);

export const customOauthProvidersInAuth = auth.table("custom_oauth_providers", {
	id: uuid().defaultRandom().primaryKey(),
	providerType: text("provider_type").notNull(),
	identifier: text().notNull(),
	name: text().notNull(),
	clientId: text("client_id").notNull(),
	clientSecret: text("client_secret").notNull(),
	acceptableClientIds: text("acceptable_client_ids").array().default([]).notNull(),
	scopes: text().array().default([]).notNull(),
	pkceEnabled: boolean("pkce_enabled").default(true).notNull(),
	attributeMapping: jsonb("attribute_mapping").default({}).notNull(),
	authorizationParams: jsonb("authorization_params").default({}).notNull(),
	enabled: boolean().default(true).notNull(),
	emailOptional: boolean("email_optional").default(false).notNull(),
	issuer: text(),
	discoveryUrl: text("discovery_url"),
	skipNonceCheck: boolean("skip_nonce_check").default(false).notNull(),
	cachedDiscovery: jsonb("cached_discovery"),
	discoveryCachedAt: timestamp("discovery_cached_at", { withTimezone: true }),
	authorizationUrl: text("authorization_url"),
	tokenUrl: text("token_url"),
	userinfoUrl: text("userinfo_url"),
	jwksUri: text("jwks_uri"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	customClaimsAllowlist: text("custom_claims_allowlist").array().default([]).notNull(),
}, (table) => [
	index("custom_oauth_providers_created_at_idx").using("btree", table.createdAt.asc().nullsLast()),
	index("custom_oauth_providers_enabled_idx").using("btree", table.enabled.asc().nullsLast()),
	index("custom_oauth_providers_identifier_idx").using("btree", table.identifier.asc().nullsLast()),
	index("custom_oauth_providers_provider_type_idx").using("btree", table.providerType.asc().nullsLast()),
	unique("custom_oauth_providers_identifier_key").on(table.identifier),check("custom_oauth_providers_authorization_url_https", sql`((authorization_url IS NULL) OR (authorization_url ~~ 'https://%'::text))`),check("custom_oauth_providers_authorization_url_length", sql`((authorization_url IS NULL) OR (char_length(authorization_url) <= 2048))`),check("custom_oauth_providers_client_id_length", sql`((char_length(client_id) >= 1) AND (char_length(client_id) <= 512))`),check("custom_oauth_providers_discovery_url_length", sql`((discovery_url IS NULL) OR (char_length(discovery_url) <= 2048))`),check("custom_oauth_providers_identifier_format", sql`(identifier ~ '^[a-z0-9][a-z0-9:-]{0,48}[a-z0-9]$'::text)`),check("custom_oauth_providers_issuer_length", sql`((issuer IS NULL) OR ((char_length(issuer) >= 1) AND (char_length(issuer) <= 2048)))`),check("custom_oauth_providers_jwks_uri_https", sql`((jwks_uri IS NULL) OR (jwks_uri ~~ 'https://%'::text))`),check("custom_oauth_providers_jwks_uri_length", sql`((jwks_uri IS NULL) OR (char_length(jwks_uri) <= 2048))`),check("custom_oauth_providers_name_length", sql`((char_length(name) >= 1) AND (char_length(name) <= 100))`),check("custom_oauth_providers_oauth2_requires_endpoints", sql`((provider_type <> 'oauth2'::text) OR ((authorization_url IS NOT NULL) AND (token_url IS NOT NULL) AND (userinfo_url IS NOT NULL)))`),check("custom_oauth_providers_oidc_discovery_url_https", sql`((provider_type <> 'oidc'::text) OR (discovery_url IS NULL) OR (discovery_url ~~ 'https://%'::text))`),check("custom_oauth_providers_oidc_issuer_https", sql`((provider_type <> 'oidc'::text) OR (issuer IS NULL) OR (issuer ~~ 'https://%'::text))`),check("custom_oauth_providers_oidc_requires_issuer", sql`((provider_type <> 'oidc'::text) OR (issuer IS NOT NULL))`),check("custom_oauth_providers_provider_type_check", sql`(provider_type = ANY (ARRAY['oauth2'::text, 'oidc'::text]))`),check("custom_oauth_providers_token_url_https", sql`((token_url IS NULL) OR (token_url ~~ 'https://%'::text))`),check("custom_oauth_providers_token_url_length", sql`((token_url IS NULL) OR (char_length(token_url) <= 2048))`),check("custom_oauth_providers_userinfo_url_https", sql`((userinfo_url IS NULL) OR (userinfo_url ~~ 'https://%'::text))`),check("custom_oauth_providers_userinfo_url_length", sql`((userinfo_url IS NULL) OR (char_length(userinfo_url) <= 2048))`),]);

export const flowStateInAuth = auth.table.withRLS("flow_state", {
	id: uuid().primaryKey(),
	userId: uuid("user_id"),
	authCode: text("auth_code"),
	codeChallengeMethod: codeChallengeMethodInAuth("code_challenge_method"),
	codeChallenge: text("code_challenge"),
	providerType: text("provider_type").notNull(),
	providerAccessToken: text("provider_access_token"),
	providerRefreshToken: text("provider_refresh_token"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	authenticationMethod: text("authentication_method").notNull(),
	authCodeIssuedAt: timestamp("auth_code_issued_at", { withTimezone: true }),
	inviteToken: text("invite_token"),
	referrer: text(),
	oauthClientStateId: uuid("oauth_client_state_id"),
	linkingTargetId: uuid("linking_target_id"),
	emailOptional: boolean("email_optional").default(false).notNull(),
}, (table) => [
	index("flow_state_created_at_idx").using("btree", table.createdAt.desc().nullsFirst()),
	index("idx_auth_code").using("btree", table.authCode.asc().nullsLast()),
	index("idx_user_id_auth_method").using("btree", table.userId.asc().nullsLast(), table.authenticationMethod.asc().nullsLast()),
]);

export const identitiesInAuth = auth.table.withRLS("identities", {
	providerId: text("provider_id").notNull(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	identityData: jsonb("identity_data").notNull(),
	provider: text().notNull(),
	lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	email: text().generatedAlwaysAs(sql`lower((identity_data ->> 'email'::text))`),
	id: uuid().defaultRandom().primaryKey(),
}, (table) => [
	index("identities_email_idx").using("btree", table.email.asc().nullsLast().op("text_pattern_ops")),
	index("identities_user_id_idx").using("btree", table.userId.asc().nullsLast()),
	unique("identities_provider_id_provider_unique").on(table.providerId, table.provider),]);

export const instancesInAuth = auth.table.withRLS("instances", {
	id: uuid().primaryKey(),
	uuid: uuid(),
	rawBaseConfig: text("raw_base_config"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
});

export const mfaAmrClaimsInAuth = auth.table.withRLS("mfa_amr_claims", {
	sessionId: uuid("session_id").notNull().references(() => sessionsInAuth.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	authenticationMethod: text("authentication_method").notNull(),
	id: uuid().primaryKey(),
}, (table) => [
	unique("mfa_amr_claims_session_id_authentication_method_pkey").on(table.sessionId, table.authenticationMethod),]);

export const mfaChallengesInAuth = auth.table.withRLS("mfa_challenges", {
	id: uuid().primaryKey(),
	factorId: uuid("factor_id").notNull().references(() => mfaFactorsInAuth.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
	verifiedAt: timestamp("verified_at", { withTimezone: true }),
	ipAddress: inet("ip_address").notNull(),
	otpCode: text("otp_code"),
	webAuthnSessionData: jsonb("web_authn_session_data"),
}, (table) => [
	index("mfa_challenge_created_at_idx").using("btree", table.createdAt.desc().nullsFirst()),
]);

export const mfaFactorsInAuth = auth.table.withRLS("mfa_factors", {
	id: uuid().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	friendlyName: text("friendly_name"),
	factorType: factorTypeInAuth("factor_type").notNull(),
	status: factorStatusInAuth().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
	secret: text(),
	phone: text(),
	lastChallengedAt: timestamp("last_challenged_at", { withTimezone: true }),
	webAuthnCredential: jsonb("web_authn_credential"),
	webAuthnAaguid: uuid("web_authn_aaguid"),
	lastWebauthnChallengeData: jsonb("last_webauthn_challenge_data"),
}, (table) => [
	index("factor_id_created_at_idx").using("btree", table.userId.asc().nullsLast(), table.createdAt.asc().nullsLast()),
	uniqueIndex("mfa_factors_user_friendly_name_unique").using("btree", table.friendlyName.asc().nullsLast(), table.userId.asc().nullsLast()).where(sql`(TRIM(BOTH FROM friendly_name) <> ''::text)`),
	index("mfa_factors_user_id_idx").using("btree", table.userId.asc().nullsLast()),
	uniqueIndex("unique_phone_factor_per_user").using("btree", table.userId.asc().nullsLast(), table.phone.asc().nullsLast()),
	unique("mfa_factors_last_challenged_at_key").on(table.lastChallengedAt),]);

export const oauthAuthorizationsInAuth = auth.table("oauth_authorizations", {
	id: uuid().primaryKey(),
	authorizationId: text("authorization_id").notNull(),
	clientId: uuid("client_id").notNull().references(() => oauthClientsInAuth.id, { onDelete: "cascade" } ),
	userId: uuid("user_id").references(() => usersInAuth.id, { onDelete: "cascade" } ),
	redirectUri: text("redirect_uri").notNull(),
	scope: text().notNull(),
	state: text(),
	resource: text(),
	codeChallenge: text("code_challenge"),
	codeChallengeMethod: codeChallengeMethodInAuth("code_challenge_method"),
	responseType: oauthResponseTypeInAuth("response_type").default("code").notNull(),
	status: oauthAuthorizationStatusInAuth().default("pending").notNull(),
	authorizationCode: text("authorization_code"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).default(sql`(now() + '00:03:00'::interval)`).notNull(),
	approvedAt: timestamp("approved_at", { withTimezone: true }),
	nonce: text(),
}, (table) => [
	index("oauth_auth_pending_exp_idx").using("btree", table.expiresAt.asc().nullsLast()).where(sql`(status = 'pending'::auth.oauth_authorization_status)`),
	unique("oauth_authorizations_authorization_code_key").on(table.authorizationCode),	unique("oauth_authorizations_authorization_id_key").on(table.authorizationId),check("oauth_authorizations_authorization_code_length", sql`(char_length(authorization_code) <= 255)`),check("oauth_authorizations_code_challenge_length", sql`(char_length(code_challenge) <= 128)`),check("oauth_authorizations_expires_at_future", sql`(expires_at > created_at)`),check("oauth_authorizations_nonce_length", sql`(char_length(nonce) <= 255)`),check("oauth_authorizations_redirect_uri_length", sql`(char_length(redirect_uri) <= 2048)`),check("oauth_authorizations_resource_length", sql`(char_length(resource) <= 2048)`),check("oauth_authorizations_scope_length", sql`(char_length(scope) <= 4096)`),check("oauth_authorizations_state_length", sql`(char_length(state) <= 4096)`),]);

export const oauthClientStatesInAuth = auth.table("oauth_client_states", {
	id: uuid().primaryKey(),
	providerType: text("provider_type").notNull(),
	codeVerifier: text("code_verifier"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
}, (table) => [
	index("idx_oauth_client_states_created_at").using("btree", table.createdAt.asc().nullsLast()),
]);

export const oauthClientsInAuth = auth.table("oauth_clients", {
	id: uuid().primaryKey(),
	clientSecretHash: text("client_secret_hash"),
	registrationType: oauthRegistrationTypeInAuth("registration_type").notNull(),
	redirectUris: text("redirect_uris").notNull(),
	grantTypes: text("grant_types").notNull(),
	clientName: text("client_name"),
	clientUri: text("client_uri"),
	logoUri: text("logo_uri"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
	clientType: oauthClientTypeInAuth("client_type").default("confidential").notNull(),
	tokenEndpointAuthMethod: text("token_endpoint_auth_method").notNull(),
}, (table) => [
	index("oauth_clients_deleted_at_idx").using("btree", table.deletedAt.asc().nullsLast()),
check("oauth_clients_client_name_length", sql`(char_length(client_name) <= 1024)`),check("oauth_clients_client_uri_length", sql`(char_length(client_uri) <= 2048)`),check("oauth_clients_logo_uri_length", sql`(char_length(logo_uri) <= 2048)`),check("oauth_clients_token_endpoint_auth_method_check", sql`(token_endpoint_auth_method = ANY (ARRAY['client_secret_basic'::text, 'client_secret_post'::text, 'none'::text]))`),]);

export const oauthConsentsInAuth = auth.table("oauth_consents", {
	id: uuid().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	clientId: uuid("client_id").notNull().references(() => oauthClientsInAuth.id, { onDelete: "cascade" } ),
	scopes: text().notNull(),
	grantedAt: timestamp("granted_at", { withTimezone: true }).default(sql`now()`).notNull(),
	revokedAt: timestamp("revoked_at", { withTimezone: true }),
}, (table) => [
	index("oauth_consents_active_client_idx").using("btree", table.clientId.asc().nullsLast()).where(sql`(revoked_at IS NULL)`),
	index("oauth_consents_active_user_client_idx").using("btree", table.userId.asc().nullsLast(), table.clientId.asc().nullsLast()).where(sql`(revoked_at IS NULL)`),
	index("oauth_consents_user_order_idx").using("btree", table.userId.asc().nullsLast(), table.grantedAt.desc().nullsFirst()),
	unique("oauth_consents_user_client_unique").on(table.userId, table.clientId),check("oauth_consents_revoked_after_granted", sql`((revoked_at IS NULL) OR (revoked_at >= granted_at))`),check("oauth_consents_scopes_length", sql`(char_length(scopes) <= 2048)`),check("oauth_consents_scopes_not_empty", sql`(char_length(TRIM(BOTH FROM scopes)) > 0)`),]);

export const oneTimeTokensInAuth = auth.table.withRLS("one_time_tokens", {
	id: uuid().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	tokenType: oneTimeTokenTypeInAuth("token_type").notNull(),
	tokenHash: text("token_hash").notNull(),
	relatesTo: text("relates_to").notNull(),
	createdAt: timestamp("created_at").default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at").default(sql`now()`).notNull(),
}, (table) => [
	index("one_time_tokens_relates_to_hash_idx").using("hash", table.relatesTo.asc().nullsLast()),
	index("one_time_tokens_token_hash_hash_idx").using("hash", table.tokenHash.asc().nullsLast()),
	uniqueIndex("one_time_tokens_user_id_token_type_key").using("btree", table.userId.asc().nullsLast(), table.tokenType.asc().nullsLast()),
check("one_time_tokens_token_hash_check", sql`(char_length(token_hash) > 0)`),]);

export const refreshTokensInAuth = auth.table.withRLS("refresh_tokens", {
	instanceId: uuid("instance_id"),
	id: bigserial({ mode: 'number' }).primaryKey(),
	token: varchar({ length: 255 }),
	userId: varchar("user_id", { length: 255 }),
	revoked: boolean(),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	parent: varchar({ length: 255 }),
	sessionId: uuid("session_id").references(() => sessionsInAuth.id, { onDelete: "cascade" } ),
}, (table) => [
	index("refresh_tokens_instance_id_idx").using("btree", table.instanceId.asc().nullsLast()),
	index("refresh_tokens_instance_id_user_id_idx").using("btree", table.instanceId.asc().nullsLast(), table.userId.asc().nullsLast()),
	index("refresh_tokens_parent_idx").using("btree", table.parent.asc().nullsLast()),
	index("refresh_tokens_session_id_revoked_idx").using("btree", table.sessionId.asc().nullsLast(), table.revoked.asc().nullsLast()),
	index("refresh_tokens_updated_at_idx").using("btree", table.updatedAt.desc().nullsFirst()),
	unique("refresh_tokens_token_unique").on(table.token),]);

export const samlProvidersInAuth = auth.table.withRLS("saml_providers", {
	id: uuid().primaryKey(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProvidersInAuth.id, { onDelete: "cascade" } ),
	entityId: text("entity_id").notNull(),
	metadataXml: text("metadata_xml").notNull(),
	metadataUrl: text("metadata_url"),
	attributeMapping: jsonb("attribute_mapping"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	nameIdFormat: text("name_id_format"),
}, (table) => [
	index("saml_providers_sso_provider_id_idx").using("btree", table.ssoProviderId.asc().nullsLast()),
	unique("saml_providers_entity_id_key").on(table.entityId),check("entity_id not empty", sql`(char_length(entity_id) > 0)`),check("metadata_url not empty", sql`((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))`),check("metadata_xml not empty", sql`(char_length(metadata_xml) > 0)`),]);

export const samlRelayStatesInAuth = auth.table.withRLS("saml_relay_states", {
	id: uuid().primaryKey(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProvidersInAuth.id, { onDelete: "cascade" } ),
	requestId: text("request_id").notNull(),
	forEmail: text("for_email"),
	redirectTo: text("redirect_to"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	flowStateId: uuid("flow_state_id").references(() => flowStateInAuth.id, { onDelete: "cascade" } ),
}, (table) => [
	index("saml_relay_states_created_at_idx").using("btree", table.createdAt.desc().nullsFirst()),
	index("saml_relay_states_for_email_idx").using("btree", table.forEmail.asc().nullsLast()),
	index("saml_relay_states_sso_provider_id_idx").using("btree", table.ssoProviderId.asc().nullsLast()),
check("request_id not empty", sql`(char_length(request_id) > 0)`),]);

export const schemaMigrationsInAuth = auth.table.withRLS("schema_migrations", {
	version: varchar({ length: 255 }).primaryKey(),
});

export const sessionsInAuth = auth.table.withRLS("sessions", {
	id: uuid().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	factorId: uuid("factor_id"),
	aal: aalLevelInAuth(),
	notAfter: timestamp("not_after", { withTimezone: true }),
	refreshedAt: timestamp("refreshed_at"),
	userAgent: text("user_agent"),
	ip: inet(),
	tag: text(),
	oauthClientId: uuid("oauth_client_id").references(() => oauthClientsInAuth.id, { onDelete: "cascade" } ),
	refreshTokenHmacKey: text("refresh_token_hmac_key"),
	refreshTokenCounter: bigint("refresh_token_counter", { mode: 'number' }),
	scopes: text(),
}, (table) => [
	index("sessions_not_after_idx").using("btree", table.notAfter.desc().nullsFirst()),
	index("sessions_oauth_client_id_idx").using("btree", table.oauthClientId.asc().nullsLast()),
	index("sessions_user_id_idx").using("btree", table.userId.asc().nullsLast()),
	index("user_id_created_at_idx").using("btree", table.userId.asc().nullsLast(), table.createdAt.asc().nullsLast()),
check("sessions_scopes_length", sql`(char_length(scopes) <= 4096)`),]);

export const ssoDomainsInAuth = auth.table.withRLS("sso_domains", {
	id: uuid().primaryKey(),
	ssoProviderId: uuid("sso_provider_id").notNull().references(() => ssoProvidersInAuth.id, { onDelete: "cascade" } ),
	domain: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
}, (table) => [
	uniqueIndex("sso_domains_domain_idx").using("btree", sql`lower(domain)`),
	index("sso_domains_sso_provider_id_idx").using("btree", table.ssoProviderId.asc().nullsLast()),
check("domain not empty", sql`(char_length(domain) > 0)`),]);

export const ssoProvidersInAuth = auth.table.withRLS("sso_providers", {
	id: uuid().primaryKey(),
	resourceId: text("resource_id"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	disabled: boolean(),
}, (table) => [
	uniqueIndex("sso_providers_resource_id_idx").using("btree", sql`lower(resource_id)`),
	index("sso_providers_resource_id_pattern_idx").using("btree", table.resourceId.asc().nullsLast().op("text_pattern_ops")),
check("resource_id not empty", sql`((resource_id = NULL::text) OR (char_length(resource_id) > 0))`),]);

export const usersInAuth = auth.table.withRLS("users", {
	instanceId: uuid("instance_id"),
	id: uuid().primaryKey(),
	aud: varchar({ length: 255 }),
	role: varchar({ length: 255 }),
	email: varchar({ length: 255 }),
	encryptedPassword: varchar("encrypted_password", { length: 255 }),
	emailConfirmedAt: timestamp("email_confirmed_at", { withTimezone: true }),
	invitedAt: timestamp("invited_at", { withTimezone: true }),
	confirmationToken: varchar("confirmation_token", { length: 255 }),
	confirmationSentAt: timestamp("confirmation_sent_at", { withTimezone: true }),
	recoveryToken: varchar("recovery_token", { length: 255 }),
	recoverySentAt: timestamp("recovery_sent_at", { withTimezone: true }),
	emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
	emailChange: varchar("email_change", { length: 255 }),
	emailChangeSentAt: timestamp("email_change_sent_at", { withTimezone: true }),
	lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
	rawAppMetaData: jsonb("raw_app_meta_data"),
	rawUserMetaData: jsonb("raw_user_meta_data"),
	isSuperAdmin: boolean("is_super_admin"),
	createdAt: timestamp("created_at", { withTimezone: true }),
	updatedAt: timestamp("updated_at", { withTimezone: true }),
	phone: text().default(sql`NULL`),
	phoneConfirmedAt: timestamp("phone_confirmed_at", { withTimezone: true }),
	phoneChange: text("phone_change").default(""),
	phoneChangeToken: varchar("phone_change_token", { length: 255 }).default(""),
	phoneChangeSentAt: timestamp("phone_change_sent_at", { withTimezone: true }),
	confirmedAt: timestamp("confirmed_at", { withTimezone: true }).generatedAlwaysAs(sql`LEAST(email_confirmed_at, phone_confirmed_at)`),
	emailChangeTokenCurrent: varchar("email_change_token_current", { length: 255 }).default(""),
	emailChangeConfirmStatus: smallint("email_change_confirm_status").default(0),
	bannedUntil: timestamp("banned_until", { withTimezone: true }),
	reauthenticationToken: varchar("reauthentication_token", { length: 255 }).default(""),
	reauthenticationSentAt: timestamp("reauthentication_sent_at", { withTimezone: true }),
	isSsoUser: boolean("is_sso_user").default(false).notNull(),
	deletedAt: timestamp("deleted_at", { withTimezone: true }),
	isAnonymous: boolean("is_anonymous").default(false).notNull(),
}, (table) => [
	uniqueIndex("confirmation_token_idx").using("btree", table.confirmationToken.asc().nullsLast()).where(sql`((confirmation_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("email_change_token_current_idx").using("btree", table.emailChangeTokenCurrent.asc().nullsLast()).where(sql`((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("email_change_token_new_idx").using("btree", table.emailChangeTokenNew.asc().nullsLast()).where(sql`((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`),
	index("idx_users_created_at_desc").using("btree", table.createdAt.desc().nullsFirst()),
	index("idx_users_email").using("btree", table.email.asc().nullsLast()),
	index("idx_users_last_sign_in_at_desc").using("btree", table.lastSignInAt.desc().nullsFirst()),
	index("idx_users_name").using("btree", sql`(raw_user_meta_data ->> 'name'::text)`).where(sql`((raw_user_meta_data ->> 'name'::text) IS NOT NULL)`),
	uniqueIndex("reauthentication_token_idx").using("btree", table.reauthenticationToken.asc().nullsLast()).where(sql`((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("recovery_token_idx").using("btree", table.recoveryToken.asc().nullsLast()).where(sql`((recovery_token)::text !~ '^[0-9 ]*$'::text)`),
	uniqueIndex("users_email_partial_key").using("btree", table.email.asc().nullsLast()).where(sql`(is_sso_user = false)`),
	index("users_instance_id_email_idx").using("btree", table.instanceId.asc().nullsLast(), sql`lower((email)::text)`),
	index("users_instance_id_idx").using("btree", table.instanceId.asc().nullsLast()),
	index("users_is_anonymous_idx").using("btree", table.isAnonymous.asc().nullsLast()),
	unique("users_phone_key").on(table.phone),check("users_email_change_confirm_status_check", sql`((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2))`),]);

export const webauthnChallengesInAuth = auth.table("webauthn_challenges", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").references(() => usersInAuth.id, { onDelete: "cascade" } ),
	challengeType: text("challenge_type").notNull(),
	sessionData: jsonb("session_data").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
}, (table) => [
	index("webauthn_challenges_expires_at_idx").using("btree", table.expiresAt.asc().nullsLast()),
	index("webauthn_challenges_user_id_idx").using("btree", table.userId.asc().nullsLast()),
check("webauthn_challenges_challenge_type_check", sql`(challenge_type = ANY (ARRAY['signup'::text, 'registration'::text, 'authentication'::text]))`),]);

export const webauthnCredentialsInAuth = auth.table("webauthn_credentials", {
	id: uuid().defaultRandom().primaryKey(),
	userId: uuid("user_id").notNull().references(() => usersInAuth.id, { onDelete: "cascade" } ),
	credentialId: customType({ dataType: () => 'bytea' })("credential_id").notNull(),
	publicKey: customType({ dataType: () => 'bytea' })("public_key").notNull(),
	attestationType: text("attestation_type").default("").notNull(),
	aaguid: uuid(),
	signCount: bigint("sign_count", { mode: 'number' }).default(0).notNull(),
	transports: jsonb().default([]).notNull(),
	backupEligible: boolean("backup_eligible").default(false).notNull(),
	backedUp: boolean("backed_up").default(false).notNull(),
	friendlyName: text("friendly_name").default("").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
}, (table) => [
	uniqueIndex("webauthn_credentials_credential_id_key").using("btree", table.credentialId.asc().nullsLast()),
	index("webauthn_credentials_user_id_idx").using("btree", table.userId.asc().nullsLast()),
]);

export const activityExecutions = pgTable.withRLS("activity_executions", {
	id: uuid().defaultRandom().primaryKey(),
	activityId: uuid("activity_id").notNull(),
	sessionId: uuid("session_id").notNull().references(() => sessions.id, { onDelete: "cascade" } ),
	startedAt: timestamp("started_at", { withTimezone: true }).default(sql`now()`).notNull(),
	completedAt: timestamp("completed_at", { withTimezone: true }),
	state: jsonb().default({"status":"idle","participants":[]}).notNull(),
	results: jsonb(),
}, (table) => [
	index("idx_activity_executions_activity_id").using("btree", table.activityId.asc().nullsLast()),
	index("idx_activity_executions_session_id").using("btree", table.sessionId.asc().nullsLast()),
	index("idx_activity_executions_started_at").using("btree", table.startedAt.desc().nullsFirst()),
]);

export const activityResponses = pgTable.withRLS("activity_responses", {
	id: uuid().defaultRandom().primaryKey(),
	executionId: uuid("execution_id").notNull().references(() => activityExecutions.id, { onDelete: "cascade" } ),
	participantId: uuid("participant_id").notNull().references(() => profiles.id, { onDelete: "cascade" } ),
	blockId: varchar("block_id", { length: 255 }).notNull(),
	response: jsonb().notNull(),
	submittedAt: timestamp("submitted_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	index("idx_activity_responses_block_id").using("btree", table.blockId.asc().nullsLast()),
	index("idx_activity_responses_execution_id").using("btree", table.executionId.asc().nullsLast()),
	index("idx_activity_responses_participant_id").using("btree", table.participantId.asc().nullsLast()),
	index("idx_activity_responses_submitted_at").using("btree", table.submittedAt.desc().nullsFirst()),
]);

export const phaseIntents = pgTable.withRLS("phase_intents", {
	id: uuid().defaultRandom().primaryKey(),
	key: text().notNull(),
	label: text().notNull(),
	description: text().notNull(),
	colorToken: text("color_token").notNull(),
	iconName: text("icon_name"),
	sortOrder: integer("sort_order").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("phase_intents_color_token_key").on(table.colorToken),	unique("phase_intents_key_key").on(table.key),check("phase_intents_color_token_check", sql`(color_token = ANY (ARRAY['intent-activate'::text, 'intent-explore'::text, 'intent-apply'::text, 'intent-reflect'::text]))`),check("phase_intents_key_check", sql`(key = ANY (ARRAY['activate'::text, 'explore'::text, 'apply'::text, 'reflect'::text]))`),]);

export const playbookPhases = pgTable.withRLS("playbook_phases", {
	id: uuid().defaultRandom().primaryKey(),
	playbookId: uuid("playbook_id").notNull().references(() => playbooks.id, { onDelete: "cascade" } ),
	phaseIntentId: uuid("phase_intent_id").notNull().references(() => phaseIntents.id, { onDelete: "restrict" } ),
	title: text().notNull(),
	description: text(),
	objective: text(),
	estimatedMinutes: integer("estimated_minutes"),
	position: integer().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
}, (table) => [
	unique("playbook_phases_playbook_id_position_key").on(table.playbookId, table.position),]);

export const playbookStrategies = pgTable.withRLS("playbook_strategies", {
	id: uuid().defaultRandom().primaryKey(),
	playbookId: uuid("playbook_id").notNull().references(() => playbooks.id, { onDelete: "cascade" } ),
	cardSlug: text("card_slug").default("custom-card").notNull(),
	title: text().notNull(),
	category: text().notNull(),
	steps: text().array().notNull(),
	phase: lessonPhase().notNull(),
	position: integer().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	virtualized: boolean().default(false),
	description: text().default("No description").notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	sourceId: uuid("source_id"),
	sourceType: text("source_type"),
	playbookPhaseId: uuid("playbook_phase_id").references(() => playbookPhases.id, { onDelete: "cascade" } ),
}, (table) => [

	pgPolicy("Enable read access for all users", { for: "select", using: sql`true` }),

	pgPolicy("User owns strategies via their own playbook", { to: ["authenticated"], using: sql`(EXISTS ( SELECT 1
   FROM playbooks l
  WHERE ((l.id = playbook_strategies.playbook_id) AND (l."createdBy" = auth.uid()))))`, withCheck: sql`(EXISTS ( SELECT 1
   FROM playbooks l
  WHERE ((l.id = playbook_strategies.playbook_id) AND (l."createdBy" = auth.uid()))))` }),
]);

export const playbooks = pgTable.withRLS("playbooks", {
	id: uuid().defaultRandom().primaryKey(),
	topic: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	courseName: text("course_name"),
	createdBy: uuid().default(sql`auth.uid()`).notNull().references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	published: boolean().default(true),
	subject: text().notNull(),
}, (table) => [

	pgPolicy("Enable read access for all users", { for: "select", using: sql`true` }),

	pgPolicy("User owns their playbooks", { to: ["authenticated"], using: sql`("createdBy" = auth.uid())`, withCheck: sql`("createdBy" = auth.uid())` }),
]);

export const profiles = pgTable.withRLS("profiles", {
	id: uuid().default(sql`auth.uid()`).primaryKey().references(() => usersInAuth.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	email: text(),
	firstName: text("first_name").notNull(),
	avatarUrl: text("avatar_url"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	courses: text().array().default([]),
	role: userRole().default("si_leader"),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
	lastName: text("last_name"),
	onboardingCompletedAt: timestamp("onboarding_completed_at", { withTimezone: true }),
	school: text(),
}, (table) => [

	pgPolicy("Enable read access for all users", { for: "select", to: ["authenticated"], using: sql`true` }),

	pgPolicy("user owns their profile", { to: ["authenticated"], using: sql`(id = auth.uid())`, withCheck: sql`(id = auth.uid())` }),
]);

export const savedPlaybooks = pgTable.withRLS("saved_playbooks", {
	id: uuid().defaultRandom().primaryKey(),
	playbookId: uuid("playbook_id").notNull().references(() => playbooks.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	userId: uuid("user_id").notNull().references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
});

export const sessionContexts = pgTable.withRLS("session_contexts", {
	id: uuid().defaultRandom().primaryKey(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	context: text().notNull(),
	key: text().notNull(),
}, (table) => [
	unique("session_contexts_key_key").on(table.key),	unique("student_contexts_context_key").on(table.context),
	pgPolicy("Enable read access for all users", { for: "select", to: ["authenticated"], using: sql`true` }),
]);

export const sessions = pgTable.withRLS("sessions", {
	id: uuid().defaultRandom().primaryKey(),
	description: text().default(""),
	courseName: text("course_name").default(""),
	topic: text().default(""),
	leaderId: uuid("leader_id").default(sql`auth.uid()`).references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" } ).references(() => usersInAuth.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	sessionCode: text("session_code"),
	status: sessionStatus().default("scheduled").notNull(),
	scheduledStart: timestamp("scheduled_start", { withTimezone: true }).default(sql`(now() AT TIME ZONE 'utc'::text)`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`).notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`).notNull(),
	playbookId: uuid("playbook_id").references(() => playbooks.id, { onDelete: "set null", onUpdate: "cascade" } ),
	virtual: boolean().default(false).notNull(),
	callId: uuid("call_id"),
	mode: sessionMode().notNull(),
}, (table) => [
	index("idx_sessions_course_name").using("btree", table.courseName.asc().nullsLast()),
	index("idx_sessions_course_topic").using("btree", table.courseName.asc().nullsLast(), table.topic.asc().nullsLast()),
	index("idx_sessions_scheduled_start").using("btree", table.scheduledStart.asc().nullsLast()),
	index("idx_sessions_session_code").using("btree", table.sessionCode.asc().nullsLast()),
	index("idx_sessions_si_leader_id").using("btree", table.leaderId.asc().nullsLast()),
	index("idx_sessions_status").using("btree", table.status.asc().nullsLast()),
	unique("sessions_session_code_key").on(table.sessionCode),
	pgPolicy("Enable read access for all users", { for: "select", using: sql`true` }),

	pgPolicy("own sessions", { using: sql`(leader_id = auth.uid())`, withCheck: sql`(leader_id = auth.uid())` }),
]);

export const strategies = pgTable.withRLS("strategies", {
	id: uuid().defaultRandom().primaryKey(),
	slug: text().default("custom-card").notNull(),
	title: text().notNull(),
	category: text().default(""),
	steps: text().array().notNull(),
	goodFor: text("good_for").array().default([]).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	courseTags: text("course_tags").array().default([]).notNull(),
	sessionSize: sessionSize("session_size").default("2+").notNull(),
	virtualFriendly: boolean("virtual_friendly").default(false).notNull(),
	virtualized: boolean().default(false),
	description: text().default("No description").notNull(),
	createdBy: uuid("created_by").references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" } ),
	published: boolean().default(true).notNull(),
}, (table) => [
	index("strategy_cards_course_tags_gin").using("gin", table.courseTags.asc().nullsLast()),
	index("strategy_cards_session_virtual_idx").using("btree", table.sessionSize.asc().nullsLast(), table.virtualFriendly.asc().nullsLast()),
	unique("strategy_cards_slug_key").on(table.slug),
	pgPolicy("Enable read access for all users", { for: "select", to: ["authenticated"], using: sql`true` }),
]);

export const strategyContexts = pgTable.withRLS("strategy_contexts", {
	id: uuid().defaultRandom().primaryKey(),
	context: text().notNull().references(() => sessionContexts.context, { onDelete: "cascade", onUpdate: "cascade" } ),
	strategySlug: text("strategy_slug").notNull().references(() => strategies.slug, { onDelete: "cascade", onUpdate: "cascade" } ),
}, (table) => [
	uniqueIndex("context_card_unique").using("btree", table.context.asc().nullsLast(), table.strategySlug.asc().nullsLast()),

	pgPolicy("Enable read access for all users", { for: "select", using: sql`true` }),
]);

export const strategyPhaseIntents = pgTable.withRLS("strategy_phase_intents", {
	strategyId: uuid("strategy_id").notNull().references(() => strategies.id, { onDelete: "cascade" } ),
	phaseIntentId: uuid("phase_intent_id").notNull().references(() => phaseIntents.id, { onDelete: "cascade" } ),
	suitability: smallint().default(1).notNull(),
}, (table) => [
	primaryKey({ columns: [table.strategyId, table.phaseIntentId], name: "strategy_phase_intents_pkey"}),
check("strategy_phase_intents_suitability_check", sql`((suitability >= 1) AND (suitability <= 3))`),]);
