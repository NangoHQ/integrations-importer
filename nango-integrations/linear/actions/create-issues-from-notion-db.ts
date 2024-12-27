import type { NangoAction, SuccessResponse, CreateLinearIssue } from '../../models';
import { getEnv } from '../../helpers/get-env.js';

export default async function runAction(nango: NangoAction, input: CreateLinearIssue): Promise<SuccessResponse> {
    const notionConnectionId = 'to-db';
    const env = await nango.getEnvironmentVariables();
    const TARGET_DB = getEnv(env, "PRIORITY_INTEGRATIONS_DB_ID");
    if (!TARGET_DB) {
        throw new nango.ActionError({
            message: 'No database ID found',
            code: 'NO_DB_ID'
        });
    }
    const { entries } = await nango.triggerAction<{ databaseId: string }, { entries: any[] }>('notion-db', notionConnectionId, 'fetch-database', { databaseId: TARGET_DB });

    const oauthEntries = entries.filter((entry) => entry.row['Auth Type']?.select?.name === 'OAUTH2');

    const p1Integrations = oauthEntries.filter((entry) => entry.row['Priority']?.select?.name === 'P1');
    const p2Integrations = oauthEntries.filter((entry) => entry.row['Priority']?.select?.name === 'P2');

    for (const p1Integration of p1Integrations) {
        const integrationName = p1Integration.row['Integration'].title[0].text.content;
        const linearIssue = {
            title: `${integrationName}: document access requirements and setup guide.`,
            description: 'See the project overview for details',
            teamId: input.teamId,
            projectId: input.projectId,
            milestoneId: input.p1MilestoneId,
        };

        await nango.triggerAction(nango.providerConfigKey, nango.connectionId, 'create-issue', linearIssue);
    }
    for (const p2Integration of p2Integrations) {
        const integrationName = p2Integration.row['Integration'].title[0].text.content;
        const linearIssue = {
            title: `${integrationName}: document access requirements and setup guide.`,
            description: 'See the project overview for details',
            teamId: input.teamId,
            projectId: input.projectId,
            milestoneId: input.p2MilestoneId,
        };
        await nango.triggerAction(nango.providerConfigKey, nango.connectionId, 'create-issue', linearIssue);
    }

    return { success: true };
}
