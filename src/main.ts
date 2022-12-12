import * as core from '@actions/core'
import fetch from 'node-fetch';
import * as fs from 'fs';
async function run(): Promise<void> {
  try {
    const endpointUrl: string = core.getInput('endpointUrl')
    const apiKey: string = core.getInput('apiKey')
    core.debug(`Waiting ${endpointUrl} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    console.log(endpointUrl, apiKey);;
    const content = await fs.readFileSync('trivy_results.json', { encoding: 'utf-8' });
    const GIT_BRANCH = process.env.GITHUB_REF_NAME
    const GIT_COMMIT_ID = process.env.GITHUB_SHA
    // const PROJECT_NAME = tl.getVariable("System.TeamProject");
    const GIT_REPOSITORY_URI = process.env.GITHUB_REPOSITORY
    // const PROJECT_ID = tl.getVariable("System.TeamProjectId");
    const GIT_REPO_NAME = process.env.GITHUB_REPOSITORY?.split('/')[1];

    const input: any = {
      gitBranch: GIT_BRANCH,
      gitCommitID: GIT_COMMIT_ID,
      repositoryName: GIT_REPO_NAME,
      gitRepositoryUrl: GIT_REPOSITORY_URI,

      vulnerabilitiesFile: JSON.parse(content)

    }
    console.log(JSON.stringify(input));
    const response = await fetch(endpointUrl, {
      method: 'post',
      body: input,
      headers: { 'Content-Type': 'application/json', 'x-functions-key': apiKey }
    });
    core.setOutput('output', response)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
