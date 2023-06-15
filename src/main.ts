import { getInput, debug, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { type SlackPayload, enrichPayload, sendSlackMessage } from './slack'

async function run (): Promise<void> {
  try {
    const org = context.repo.owner
    const repo = context.repo.repo
    const ref = context.ref
    const sha = context.sha
    const runId = context.runId
    debug(`org: ${org}`)
    debug(`repo: ${repo}`)
    debug(`ref: ${ref}`)
    debug(`sha: ${sha}`)
    debug(`runId: ${runId}`)

    const slackWebhookURL = getInput('slack_webhook_url')
    const inputPayload: SlackPayload = JSON.parse(getInput('payload'))

    const payload = enrichPayload(inputPayload, org, repo, ref, sha, runId)
    await sendSlackMessage(JSON.stringify(payload), slackWebhookURL)
  } catch (error) {
    if (error instanceof Error) setFailed(error.message)
  }
}

run().catch(err => { throw err })
