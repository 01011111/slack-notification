import { debug } from '@actions/core'
import fetch from 'node-fetch'

interface SlackElement {
  type: string
  text: string
}

interface SlackBlock {
  type: string
  text?: {
    type: string
    text: string
  }
  accessory?: {
    type: string
    text: {
      type: string
      text: string
    }
    value: string
    url: string
  }
  elements?: SlackElement[]
}

export interface SlackPayload {
  blocks: SlackBlock[]
}

export const enrichPayload = (payload: SlackPayload, org: string, repo: string, ref: string, sha: string, runId: number): SlackPayload => {
  const context: SlackBlock = {
    type: 'context',
    elements: [
      {
        type: 'plain_text',
        text: `${org}/${repo}`
      },
      {
        type: 'plain_text',
        text: ref
      },
      {
        type: 'plain_text',
        text: `${sha} - ${runId}`
      }
    ]
  }

  const contextIndex: number = payload.blocks.findIndex(block => block.type === 'context')

  if (contextIndex === -1) {
    payload.blocks.push(context)
  } else {
    payload.blocks[contextIndex] = context
  }

  return payload
}

export const sendSlackMessage = async (payload: string, slackWebhookURL: string): Promise<void> => {
  debug(`payload: ${payload}`)

  await fetch(slackWebhookURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: payload
  })
}
