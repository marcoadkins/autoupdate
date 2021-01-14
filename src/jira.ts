import JiraClient from "jira-connector";

export class Jira {
  env: NodeJS.ProcessEnv;
  client: any;

  constructor() {
    this.env = process.env;
    this.client = new JiraClient({
      host: `${this.jiraSite()}.atlassian.net`,
      basic_auth: {
        username: this.jiraUser(),
        password: this.jiraPassword()
      }
    });
  }

  jiraSite(): string {
    return this.getValue('JIRA_SITE', true);
  }

  jiraUser(): string {
    return this.getValue('JIRA_USER', true);
  }

  jiraPassword(): string {
    return this.getValue('JIRA_PASSWORD', true);
  }
  
  async transitionTicket(ticketNumber: string, state: string, message: string): Promise<any> {
    const result = await this.client.issue.transitionIssue({
        issueKey: ticketNumber,
        transition: { id: state }
    });

    return result;
  }
}
  
  export default new Jira();
  