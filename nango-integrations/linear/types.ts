export interface LinearState {
    id: string;
    name: string;
}

export interface LinearLabel {
    id: string;
    name: string;
}

export interface LinearTeamResponse {
    data: {
        team: {
            states: {
                nodes: LinearState[];
            };
            labels: {
                nodes: LinearLabel[];
            };
        };
    };
}

export interface LinearIssueInput {
    teamId: string;
    title: string;
    assigneeId?: string;
    dueDate?: string;
    stateId: string;
    labelIds?: string[];
} 