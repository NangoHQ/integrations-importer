import type { NangoAction, ProxyConfiguration, LastSyncDate } from '../../models';

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
                // Note: This assumes that accessing private properties is intentional.
                Authorization: `Bearer ${(nango as any)?.nango?.secretKey || ''}`,  // Ensure it's safely accessed
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

            await nango.log(`Created category: ${data.category.name}`);
        }

        cursor = next_cursor;

    } while (cursor);
}
