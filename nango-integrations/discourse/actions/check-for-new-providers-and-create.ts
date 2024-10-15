import type { NangoAction, ProxyConfiguration, LastSyncDate } from '../../models';
import { extractGettingStarted, removeHtmlLikeTags, formatMarkdownLinks } from '../../utils/parse-markdown.js';

const githubRawContentBase = `https://raw.githubusercontent.com`;

export default async function runAction(nango: NangoAction, input: LastSyncDate): Promise<void> {
    let cursor: string | null = null;

    do {
        const response: any = await nango.get({
            endpoint: "/records",
            baseUrlOverride: "https://api.nango.dev",
            params: {
                model: "Integration",
                modified_after: input?.lastSyncDate?.toString() || '',
                filter: 'added',
                cursor: cursor || ''
            },
            headers: {
                Authorization: `Bearer ${(nango as any)?.nango?.secretKey || ''}`,
                "Provider-Config-Key": 'unauthenticated',
                "Connection-Id": 'u'
            }
        });

        const { records = [], next_cursor = null } = response.data || {};

        for (const record of records) {
            const topic = {
                name: record.display_name,
                color: `${Math.floor(Math.random() * 16777215).toString(16)}`,
            };

            const config: ProxyConfiguration = {
                endpoint: '/categories',
                retries: 10,
                data: topic
            };

            const { data } = await nango.post(config);

            const { name, slug, id } = data.category;

            await nango.log(`Created category: ${name}`);


            const mdxResponse = await nango.get({
                baseUrlOverride: githubRawContentBase,
                endpoint: `/NangoHQ/nango/master/docs-v2/integrations/all/${slug}.mdx`,
                headers: {
                    'Authorization': '', // No authorization needed for raw GitHub content
                }
            });

            const mdxContent = mdxResponse.data;
            let gettingStartedSection = extractGettingStarted(mdxContent);
            if (gettingStartedSection) {
                // Remove Tip or other HTML-like tags
                gettingStartedSection = removeHtmlLikeTags(gettingStartedSection);

                // Format markdown links
                const formattedSection = formatMarkdownLinks(gettingStartedSection);
                const topicContent = {
                    title: `Getting Started with ${name}`,
                    category: id,
                    raw: formattedSection
                };

                await nango.log(`Creating "Getting Started" topic for ${name}...`);
                await nango.log(JSON.stringify(topicContent, null, 2));

                const response = await nango.triggerAction<unknown, {id: string}>(nango.providerConfigKey, nango.connectionId, 'create-topic', topicContent);

                const { id: topicId } = response;
                const updateTopicStatus = {
                    id: Number(topicId),
                    status: 'pinned',
                    enabled: "true",
                    until: "2030-12-31"
                };

                await nango.log(`Updating status for "Getting Started" topic for ${name}...`);
                await nango.log(JSON.stringify(updateTopicStatus, null, 2));

                await nango.triggerAction(nango.providerConfigKey, nango.connectionId, 'update-topic-status', updateTopicStatus);
            }

        }

        cursor = next_cursor;

    } while (cursor);
}
