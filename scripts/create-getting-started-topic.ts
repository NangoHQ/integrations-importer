import axios from 'axios';
import { Nango } from '@nangohq/node';
import { extractGettingStarted, removeHtmlLikeTags, formatMarkdownLinks } from '../nango-integrations/utils/parse-markdown.js';

const createGettingStartedTopic = async () => {
    const secretKey = process.env['NANGO_SECRET_KEY'];
    const nango = new Nango({ secretKey });

    const providerConfigKey = process.env['DISCOURSE_PROVIDER_CONFIG_KEY'] || 'discourse';
    const connectionId = process.env['DISCOURSE_CONNECTION_ID'] || 'global';

    const config = {
        endpoint: '/categories',
        providerConfigKey,
        connectionId
    };

    const response = await nango.proxy(config);

    const { categories } = response.data.category_list;

    for (const category of categories) {
        const { id, name, slug } = category;

        // Fetch the MDX content from the GitHub URL
        const readMePage = `https://raw.githubusercontent.com/NangoHQ/nango/master/docs-v2/integrations/all/${slug}.mdx`;

        try {
            const mdxResponse = await axios.get(readMePage);
            const mdxContent = mdxResponse.data;

            // Extract the "Getting Started" section using a regular expression
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

                console.log(`Creating "Getting Started" topic for ${name}...`);
                console.log(topicContent)

                const response = await nango.triggerAction<unknown, {id: string}>(providerConfigKey, connectionId, 'create-topic', topicContent);

                console.log(response);

                const { id: topicId } = response;
                const updateTopicStatus = {
                    id: Number(topicId),
                    status: 'pinned',
                    enabled: "true",
                    until: "2030-12-31"
                };

                console.log(`Updating status for "Getting Started" topic for ${name}...`);
                console.log(updateTopicStatus)

                await nango.triggerAction(providerConfigKey, connectionId, 'update-topic-status', updateTopicStatus);

                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                console.log(`No "Getting Started" section found for ${name}`);
            }
        } catch (e) {
            console.error(e.response.data.error);
        }
    }
};

createGettingStartedTopic();
