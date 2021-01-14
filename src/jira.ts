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
    await this.client.issue.transitionIssue({
        issueKey: ticketNumber,
        transition: { id: state }
    });

    await this.client.issue.addComment({
      issueKey: ticketNumber,
      body: message
    });

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getValue(key: string, required = false, defaultVal?: any): any {
    if (
      key in this.env &&
      this.env[key] !== null &&
      this.env[key] !== undefined
    ) {
      return this.env[key];
    }

    if (required) {
      throw new Error(
        `Environment variable '${key}' was not provided, please define it and try again.`,
      );
    }

    return defaultVal;
  }
}
  
  export default new Jira();
  