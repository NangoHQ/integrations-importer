import yaml from 'js-yaml';
import axios from 'axios';

const fetchYamlData = async () => {
    const url = 'https://raw.githubusercontent.com/NangoHQ/nango/master/packages/shared/providers.yaml';

    const response = await axios.get(url);

    const integrations = yaml.load(response.data);

    const flatNames = Object.keys(integrations);

    for (const name in integrations) {
        const integration = integrations[name];
        if (integration.alias) {
            console.log(`Skipping alias: ${name}`);
            continue;
        }
        if (name.includes('sandbox')) {
            console.log(`Skipping sandbox: ${name}`);
            continue;
        }
        const data = {
            name: integration.display_name,
            color: `${Math.floor(Math.random() * 16777215).toString(16)}`,
        };

        const secretKey = process.env['NANGO_SECRET_KEY'];
        const providerConfigKey = process.env['DISCOURSE_PROVIDER_CONFIG_KEY'] || 'discourse';
        const connectionId = process.env['GLOBAL_CONNECTION_ID'] || 'global';
        const headers = {
            Authorization: `Bearer ${secretKey}`,
            'Provider-Config-Key': providerConfigKey,
            'Connection-Id': connectionId
        };

        // wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
            const response = await axios.post('https://api.nango.dev/v1/categories', data, { headers });
            console.log(response.data);
        } catch(e: any) {
            console.error(e.response.data.error);
        }

    }
};

fetchYamlData();
