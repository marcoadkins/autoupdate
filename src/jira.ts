import JiraClient from "jira-connector";
import { ConfigLoader } from './config-loader';

export class Jira {
  env: NodeJS.ProcessEnv;
  client: any;
  config: ConfigLoader;

  constructor() {
    this.env = process.env;
    this.config = new ConfigLoader();
    this.client = new JiraClient({
      host: `${this.config.jiraSite()}.atlassian.net`,
      basic_auth: {
        username: this.config.jiraUser(),
        password: this.config.jiraPassword()
      }
    });
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
}
  
  export default new Jira();
  