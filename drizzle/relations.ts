import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	identitiesInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.identitiesInAuth.userId,
			to: r.usersInAuth.id
		}),
	},
	usersInAuth: {
		identitiesInAuths: r.many.identitiesInAuth(),
		mfaFactorsInAuths: r.many.mfaFactorsInAuth(),
		oauthClientsInAuthsViaOauthAuthorizationsInAuth: r.many.oauthClientsInAuth({
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_oauthAuthorizationsInAuth"
		}),
		oauthClientsInAuthsViaOauthConsentsInAuth: r.many.oauthClientsInAuth({
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_oauthConsentsInAuth"
		}),
		oneTimeTokensInAuths: r.many.oneTimeTokensInAuth(),
		oauthClientsInAuthsViaSessionsInAuth: r.many.oauthClientsInAuth({
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_sessionsInAuth"
		}),
		webauthnChallengesInAuths: r.many.webauthnChallengesInAuth(),
		webauthnCredentialsInAuths: r.many.webauthnCredentialsInAuth(),
		profiles: r.many.profiles(),
		sessions: r.many.sessions(),
	},
	mfaAmrClaimsInAuth: {
		sessionsInAuth: r.one.sessionsInAuth({
			from: r.mfaAmrClaimsInAuth.sessionId,
			to: r.sessionsInAuth.id
		}),
	},
	sessionsInAuth: {
		mfaAmrClaimsInAuths: r.many.mfaAmrClaimsInAuth(),
		refreshTokensInAuths: r.many.refreshTokensInAuth(),
	},
	mfaChallengesInAuth: {
		mfaFactorsInAuth: r.one.mfaFactorsInAuth({
			from: r.mfaChallengesInAuth.factorId,
			to: r.mfaFactorsInAuth.id
		}),
	},
	mfaFactorsInAuth: {
		mfaChallengesInAuths: r.many.mfaChallengesInAuth(),
		usersInAuth: r.one.usersInAuth({
			from: r.mfaFactorsInAuth.userId,
			to: r.usersInAuth.id
		}),
	},
	oauthClientsInAuth: {
		usersInAuthsViaOauthAuthorizationsInAuth: r.many.usersInAuth({
			from: r.oauthClientsInAuth.id.through(r.oauthAuthorizationsInAuth.clientId),
			to: r.usersInAuth.id.through(r.oauthAuthorizationsInAuth.userId),
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_oauthAuthorizationsInAuth"
		}),
		usersInAuthsViaOauthConsentsInAuth: r.many.usersInAuth({
			from: r.oauthClientsInAuth.id.through(r.oauthConsentsInAuth.clientId),
			to: r.usersInAuth.id.through(r.oauthConsentsInAuth.userId),
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_oauthConsentsInAuth"
		}),
		usersInAuthsViaSessionsInAuth: r.many.usersInAuth({
			from: r.oauthClientsInAuth.id.through(r.sessionsInAuth.oauthClientId),
			to: r.usersInAuth.id.through(r.sessionsInAuth.userId),
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_sessionsInAuth"
		}),
	},
	oneTimeTokensInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.oneTimeTokensInAuth.userId,
			to: r.usersInAuth.id
		}),
	},
	refreshTokensInAuth: {
		sessionsInAuth: r.one.sessionsInAuth({
			from: r.refreshTokensInAuth.sessionId,
			to: r.sessionsInAuth.id
		}),
	},
	samlProvidersInAuth: {
		ssoProvidersInAuth: r.one.ssoProvidersInAuth({
			from: r.samlProvidersInAuth.ssoProviderId,
			to: r.ssoProvidersInAuth.id
		}),
	},
	ssoProvidersInAuth: {
		samlProvidersInAuths: r.many.samlProvidersInAuth(),
		flowStateInAuths: r.many.flowStateInAuth(),
		ssoDomainsInAuths: r.many.ssoDomainsInAuth(),
	},
	flowStateInAuth: {
		ssoProvidersInAuths: r.many.ssoProvidersInAuth({
			from: r.flowStateInAuth.id.through(r.samlRelayStatesInAuth.flowStateId),
			to: r.ssoProvidersInAuth.id.through(r.samlRelayStatesInAuth.ssoProviderId)
		}),
	},
	ssoDomainsInAuth: {
		ssoProvidersInAuth: r.one.ssoProvidersInAuth({
			from: r.ssoDomainsInAuth.ssoProviderId,
			to: r.ssoProvidersInAuth.id
		}),
	},
	webauthnChallengesInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.webauthnChallengesInAuth.userId,
			to: r.usersInAuth.id
		}),
	},
	webauthnCredentialsInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.webauthnCredentialsInAuth.userId,
			to: r.usersInAuth.id
		}),
	},
	activityExecutions: {
		session: r.one.sessions({
			from: r.activityExecutions.sessionId,
			to: r.sessions.id
		}),
		profiles: r.many.profiles({
			from: r.activityExecutions.id.through(r.activityResponses.executionId),
			to: r.profiles.id.through(r.activityResponses.participantId)
		}),
	},
	sessions: {
		activityExecutions: r.many.activityExecutions(),
		profile: r.one.profiles({
			from: r.sessions.leaderId,
			to: r.profiles.id
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.sessions.leaderId,
			to: r.usersInAuth.id
		}),
		playbook: r.one.playbooks({
			from: r.sessions.playbookId,
			to: r.playbooks.id
		}),
	},
	profiles: {
		activityExecutions: r.many.activityExecutions(),
		playbooksCreatedBy: r.many.playbooks({
			alias: "playbooks_createdBy_profiles_id"
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.profiles.id,
			to: r.usersInAuth.id
		}),
		playbooksViaSavedPlaybooks: r.many.playbooks({
			alias: "playbooks_id_profiles_id_via_savedPlaybooks"
		}),
		sessions: r.many.sessions(),
		strategies: r.many.strategies(),
	},
	playbookStrategies: {
		playbook: r.one.playbooks({
			from: r.playbookStrategies.playbookId,
			to: r.playbooks.id
		}),
	},
	playbooks: {
		playbookStrategies: r.many.playbookStrategies(),
		profile: r.one.profiles({
			from: r.playbooks.createdBy,
			to: r.profiles.id,
			alias: "playbooks_createdBy_profiles_id"
		}),
		profiles: r.many.profiles({
			from: r.playbooks.id.through(r.savedPlaybooks.playbookId),
			to: r.profiles.id.through(r.savedPlaybooks.userId),
			alias: "playbooks_id_profiles_id_via_savedPlaybooks"
		}),
		sessions: r.many.sessions(),
	},
	strategies: {
		profile: r.one.profiles({
			from: r.strategies.createdBy,
			to: r.profiles.id
		}),
		sessionContexts: r.many.sessionContexts(),
	},
	sessionContexts: {
		strategies: r.many.strategies({
			from: r.sessionContexts.context.through(r.strategyContexts.context),
			to: r.strategies.slug.through(r.strategyContexts.strategySlug)
		}),
	},
}))