import * as core from '@actions/core'
import * as exec from '@actions/exec';
import * as io from '@actions/io';
import { wait } from './wait'
import * as fs from 'fs';
async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
    let files = await exec.exec('ls');
    const content = await fs.readFileSync('trivy_results.json', { encoding: 'utf-8' });
    console.log(JSON.stringify(content));
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
