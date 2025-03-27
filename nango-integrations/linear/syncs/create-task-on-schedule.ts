import type { NangoSync } from '../../models';
import type { LinearTeamResponse, LinearIssueInput } from '../types';

interface EnvEntry {
  name: string;
  value: string;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default async function fetchData(nango: NangoSync): Promise<void> {
    const env = await nango.getEnvironmentVariables();
    const teamId = getEnv(env, 'LINEAR_TEAM_ID');
    const assigneeId = getEnv(env, 'LINEAR_ASSIGNEE_ID');

    if (!teamId) {
        throw new Error('LINEAR_TEAM_ID environment variable is required');
    }

    if (!assigneeId) {
        throw new Error('LINEAR_ASSIGNEE_ID environment variable is required');
    }

    const currentMonth = new Date().getMonth();
    const monthWord = months[currentMonth];

    // Fetch states and labels for the team
    const response = await nango.post<LinearTeamResponse>({
        endpoint: '/graphql',
        data: {
            query: `query GetTeamStatesAndLabels($teamId: String!) {
                team(id: $teamId) {
                    states {
                        nodes {
                            id
                            name
                        }
                    }
                    labels {
                        nodes {
                            id
                            name
                        }
                    }
                }
            }`,
            variables: {
                teamId
            }
        }
    });

    const states = response.data?.data?.team?.states?.nodes || [];
    const labels = response.data?.data?.team?.labels?.nodes || [];
    
    const todoState = states.find((state) => state.name === 'Todo');
    const ieHoursLabel = labels.find((label) => label.name === 'IE Hours');
    
    if (!todoState) {
        throw new Error('Could not find "Todo" state for the team');
    }

    if (!ieHoursLabel) {
        throw new Error('Could not find "IE Hours" label for the team');
    }

    const issue: LinearIssueInput = {
        teamId,
        title: `Enter hours for IE ${monthWord}`,
        assigneeId,
        dueDate: `${new Date().getFullYear()}-${currentMonth + 1}-26`,
        stateId: todoState.id,
        labelIds: [ieHoursLabel.id]
    };

    const created = await nango.triggerAction<LinearIssueInput, any>(nango.providerConfigKey, nango.connectionId, 'create-issue', issue);
    await nango.batchSave([created], 'CreatedTask');
}

const getEnv = (env: EnvEntry[] | null, name: string) => {
  return env?.find((v) => v.name === name)?.value;
};
