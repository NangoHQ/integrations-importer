import type { NangoSync, Integration } from '../../models';
import { parseYaml } from '../../utils/parse-yaml.js';

export default async function fetchData(nango: NangoSync): Promise<void> {
    const response = await nango.get({
        baseUrlOverride: 'https://raw.githubusercontent.com',
        endpoint: '/NangoHQ/nango/master/packages/shared/providers.yaml',
        headers: {
            'Authorization': '', // No authorization needed for raw GitHub content
        }
    });

    const { data } = response;

    try {
        const allIntegrations: Integration[] = [];
        const integrations = parseYaml(data);

        for (const name in integrations) {
            const integration = integrations[name];
            if (integration.display_name) {
                if (!integration.alias && !name.includes('sandbox')) {
                    allIntegrations.push({
                        id: name,
                        name,
                        ...integration
                    });
                }
            }
        }

        await nango.batchSave(allIntegrations, 'Integration');

    } catch (error) {
        console.error('Error parsing YAML:', error);
    }
}
