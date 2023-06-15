# Slacktification

## Requirements

You need to create a Slack app and add a webhook to it. You can find more information about how to do that [here](https://api.slack.com/messaging/webhooks).
After configuring your app to post messages to a channel, you will get a webhook URL. You will need to pass this URL to the action as an input.

## Usage

```yaml
uses: 01011111/slack-notification@v2.0.0
  if: success()
  with:
    slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":":shipit: *Success!*"}}]}'

uses: 01011111/slack-notification@v2.0.0
  if: failure()
  with:
    slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
    payload: '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":":scream: _Uh Oh_"}}]}'
```

This is the only configuration you need to start sending notification to Slack.

### Only send notifications after specific steps

```yaml
release-notification:
  runs-on: ubuntu-latest
  needs:
    - deploy

  steps:
    - uses: 01011111/slack-notification@v2.0.0
      if: success()
      with:
        slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
        success: '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":":shipit: *Success!*"}}]}'
    
    - uses: 01011111/slack-notification@v2.0.0
      if: failure()
      with:
        slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
        success: '{"blocks":[{"type":"section","text":{"type":"mrkdwn","text":":scream: _Uh Oh_"}}]}'
```

You can use the `needs` keyword to only send notifications after specific steps.

## Create the payload

You can use Slack Block Kit Builder: https://app.slack.com/block-kit-builder/T5PQHJY7R#%7B%22blocks%22:%5B%7B%22type%22:%22section%22,%22text%22:%7B%22type%22:%22mrkdwn%22,%22text%22:%22:shipit:%20*Success!*%22%7D%7D%5D%7D

Just don't include a context block because it will be overwritten by the action.
