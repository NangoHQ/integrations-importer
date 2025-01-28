import yaml from 'js-yaml';
import axios from 'axios';

const fetchYamlData = async () => {
    const url = 'https://raw.githubusercontent.com/NangoHQ/nango/master/packages/providers/providers.yaml';

    const response = await axios.get(url);

    const integrations = yaml.load(response.data);

    const flatNames = [];

    for (const name in integrations) {
        const integration = integrations[name];
        if (integration.alias) {
            //console.log(`Skipping alias: ${name}`);
            continue;
        }
        if (name.includes('sandbox')) {
            //console.log(`Skipping sandbox: ${name}`);
            continue;
        }

        if (integration.auth_mode === "BASIC") {
                console.log(`${name}`);
                continue;
        }
    }

    console.log(flatNames.join('\n'));
};

fetchYamlData();

