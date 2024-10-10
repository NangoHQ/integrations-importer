import axios from 'axios';
import { Nango } from '@nangohq/node';

const importKnowledgeBase = async () => {
    const secretKey = process.env['NANGO_SECRET_KEY'];
    const nango = new Nango({ secretKey });

    const discourseProviderConfigKey = process.env['DISCOURSE_PROVIDER_CONFIG_KEY'] || 'discourse';
    const discourseConnectionId = process.env['DISCOURSE_CONNECTION_ID'] || 'global';

    const notionProviderConfigKey = process.env['NOTION_PROVIDER_CONFIG_KEY'] || 'notion';
    const notionConnectionId = process.env['NOTION_CONNECTION_ID'] || 'knowledge-base';

    // get the notion database id
    const databaseUrl = process.env['NOTION_DATABASE_URL'] || 'https://www.notion.so/nangohq/ac0fbc4c1b74486f94c3901af3f5c297';
    const response = await nango.triggerAction<{url: string;}, { id: string }>(notionProviderConfigKey, notionConnectionId, 'fetch-content-metadata', { url: databaseUrl });

    const databaseId = response.id;

    // get the notion database content
    const { entries } = await nango.triggerAction<{databaseId: string;}, { entries: any }>(notionProviderConfigKey, notionConnectionId, 'fetch-database', { databaseId });

    for (const entryData of entries) {
        const { id, row: entry } = entryData;
        if (entry.API) {
            const { API, Topic } = entry;
            const { Title } = entry;
            const { name } = API.select;

            let title = '';
            if (Title.title && Title.title.length > 0 && Title.title[0].plain_text) {
                title = Title.title[0].plain_text;
            }

            // fetch the page content as well
            const { content } = await nango.triggerAction<{pageId: string;}, { content: string }>(notionProviderConfigKey, notionConnectionId, 'fetch-rich-page', { pageId: id });

            // find the category id if it exists
            const response = await nango.get({
                providerConfigKey: discourseProviderConfigKey,
                connectionId: discourseConnectionId,
                endpoint: '/search',
                params: {
                    q: `#${name}`
                }
            });

            if (response.data.topics && response.data.topics.length > 0) {
                const [firstTopic] = response.data.topics;
                const { category_id } = firstTopic;

                const tags = [];
                if (Topic?.select) {
                    tags.push(Topic.select.name)
                }

                const topic = {
                    title,
                    category: category_id,
                    raw: content,
                    tags
                };

                if (topic.title) {
                    try {
                        console.log('Creating topic');
                        console.log(topic);
                        const topicResponse = await nango.triggerAction(discourseProviderConfigKey, discourseConnectionId, 'create-topic', topic);
                    } catch(e) {
                        console.log(e.response.data.error)
                    }
                }
            }

        }

    }
}

importKnowledgeBase();
