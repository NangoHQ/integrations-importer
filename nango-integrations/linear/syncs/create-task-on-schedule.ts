import type { NangoSync } from '../../models';

interface EnvEntry {
  name: string;
  value: string;
}

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default async function fetchData(nango: NangoSync): Promise<void> {
    const env = await nango.getEnvironmentVariables();
    const teamId = getEnv(env, 'LINEAR_TEAM_ID');
    const assigneeId = getEnv(env, 'LINEAR_ASSIGNEE_ID');
    const currentMonth = new Date().getMonth();
    const monthWord = months[currentMonth];

    const issue = {
        teamId,
        title: `Enter hours for IE ${monthWord}`,
        assigneeId,
        dueDate: `${new Date().getFullYear()}-${currentMonth + 1}-26`,
        state: {
            name: 'To Do'
        }
    };

    const created = await nango.triggerAction<any, any>(nango.providerConfigKey, nango.connectionId, 'create-issue', issue);
    await nango.batchSave([created], 'CreatedTask');
}
const getEnv = (env: EnvEntry[] | null, name: string) => {
  return env?.find((v) => v.name === name)?.value;
};
