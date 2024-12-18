import type { NangoAction, ProxyConfiguration, LastSyncDate } from '../../models';

interface EnvEntry {
  name: string;
  value: string;
}

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
            const { display_name, auth_mode } = record;

            const content = {
                "Auth Type": {
                    "select": {
                        "name": auth_mode
                    }
                },
                "Priority": {
                    "select": {
                        "name": " "
                    }
                },
                "Integration": {
                    "title": [
                        {
                            "text": {
                                "content": display_name
                            }
                        }
                    ]
                }
            };

            const env = await nango.getEnvironmentVariables();
            const TARGET_DB = getEnv(env, "PRIORITY_INTEGRATIONS_DB_ID");

            const config: ProxyConfiguration = {
                endpoint: '/v1/pages',
                data: {
                    parent: { database_id: TARGET_DB },
                    properties: content
                }
            };
            await nango.post(config);
        }

        cursor = next_cursor;

    } while (cursor);
}

const getEnv = (env: EnvEntry[] | null, name: string) => {
  return env?.find((v) => v.name === name)?.value;
};
