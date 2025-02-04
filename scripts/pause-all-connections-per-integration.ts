import axios from 'axios';
import * as fs from 'fs';
import { Nango } from '@nangohq/node';

const pauseAllConnectionsPerIntegration = async () => {
    const secretKey = process.env['NANGO_SECRET_KEY'];
    const integration = process.env['INTEGRATION_ID'];
    const syncName = process.env['SYNC_NAME'];

    const nango = new Nango({ secretKey });

    const response = await nango.listConnections();

    for (const connection of response.connections) {
        // pause for 2 seconds to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
        try {
            console.log(`Pausing connection ${connection.connection_id}`)
            await nango.pauseSync(integration, [syncName], connection.connection_id);
        } catch(e) {
            if (e.response.status === 400) {
                console.log(`Connection ${connection.connection_id} schedule was not able to be paused`);
            } else {
                console.error(e.response.data);
            }
        }
    }

}

pauseAllConnectionsPerIntegration();
