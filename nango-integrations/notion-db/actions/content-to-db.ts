import type { NangoAction, ProxyConfiguration, SuccessResponse, ContentToDb } from '../../models';

export default async function runAction(nango: NangoAction, input: ContentToDb): Promise<SuccessResponse> {
    const { sourcePage, targetDb } = input;
    const { content } = await nango.triggerAction<{ pageId: string }, { content: any }>(nango.providerConfigKey, nango.connectionId, 'fetch-rich-page', { pageId: sourcePage });
    // get the content after ## List and up until child_database
    const strippedContent = content.split('## List')[1].split('child_database')[0];

    // turn each line into an array element
    const integrations = strippedContent.split('\n');

    for (const integeration of integrations) {
        if (!integeration) continue;
        // split based on the colon and the space
        // example: abc: API_KEY ⭐️
        const [key, value] = integeration.split(': ');
        const [authType, priority] = value.split(' ');

        const content = {
            "Auth Type": {
                "select": {
                    "name": authType
                }
            },
            "Priority": {
                "select": {
                    "name": priority || " "
                }
            },
            "Integration": {
                "title": [
                    {
                        "text": {
                            "content": key
                        }
                    }
                ]
            }
        };

        const config: ProxyConfiguration = {
            endpoint: '/v1/pages',
            data: {
                parent: { database_id: targetDb },
                properties: content
            }
        };
        await nango.post(config);

    }
    return { success: true };
}
