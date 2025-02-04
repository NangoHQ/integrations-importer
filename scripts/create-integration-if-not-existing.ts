import axios from 'axios';
import * as fs from 'fs';
import yaml from 'js-yaml';
import { Nango } from '@nangohq/node';

const createIntegrationIfNotExisting = async () => {
    const secretKey = process.env['NANGO_SECRET_KEY'];
    const nango = new Nango({ secretKey });

    const nangoYamlPath = './nango-integrations/nango.yaml'; 
    const nangoYamlContents = fs.readFileSync(nangoYamlPath, 'utf8');
    const { integrations } = yaml.load(nangoYamlContents);
    const integrationNames = Object.keys(integrations)

    for (const integration of integrationNames) {
        // pause for 3 seconds to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 3000));
        try {
            await nango.getIntegration(integration);
        } catch(e) {
            if (e.response.status === 400) {
                console.log(`Integration ${integration} not found. Creating it...`);
                await nango.createIntegration(integration, integration, { oauth_client_id: '_REQUIRES_VALUE_', oauth_client_secret: '_REQUIRES_VALUE_' });
            } else {
                console.error(e.response.data);
            }
        }
    }

}

createIntegrationIfNotExisting();
