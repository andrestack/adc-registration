# n8n Email Workflow

This document explains how to connect the ADC Registration app to n8n so emails sent from the admin panel are delivered through an SMTP node.

## What the app sends

When the admin form is submitted, the app posts to `N8N_WEBHOOK_URL` with the following JSON body:

```json
{
  "subject": "Informações importantes ADC 2026",
  "body": "<p>Olá,</p><p>Veja as informações...</p>",
  "recipients": [
    "participant1@example.com",
    "participant2@example.com"
  ]
}
```

- `subject` — email subject
- `body` — HTML message body
- `recipients` — flat array of recipient email addresses

## Recommended n8n workflow

1. **Webhook** node — receives the payload.
2. **Code** node — turns the `recipients` array into one n8n item per email address.
3. **Email (SMTP)** node — sends one email for each item.
4. **Respond to Webhook** node — replies to the app immediately so the UI shows success.

> **Why a Code node?** n8n's "Split In Batches" splits **items**, not the values inside an item. Without the Code node, the Send Email node received the whole payload object (`$json`) as the recipient and produced no visible output.

## Import the workflow (ready-to-paste JSON)

1. In n8n, open **Workflows**.
2. Click **...** → **Import from JSON**.
3. Paste the JSON below.
4. Open the **Send Email** node and attach your SMTP credentials.
5. Update the **From** address if needed.
6. Copy the webhook URL n8n generates and set it in your `.env` as `N8N_WEBHOOK_URL`.
7. Activate the workflow.

```json
{
  "name": "ADC Email Sender",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "adc-email-sender",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "adc-webhook",
      "name": "ADC Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 2,
      "position": [260, 300],
      "webhookId": "adc-email-sender"
    },
    {
      "parameters": {
        "mode": "runOnceForAllItems",
        "language": "javaScript",
        "jsCode": "const recipients = $input.first().json.recipients || [];\nreturn recipients.map((email) => ({ json: { email } }));"
      },
      "id": "adc-expand-recipients",
      "name": "Expand Recipients",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [460, 300]
    },
    {
      "parameters": {
        "fromEmail": "=contact@aldeia-djembe-camp.com",
        "toEmail": "{{ $('ADC Webhook').item.json.body.recipients[0] }}",
        "subject": "={{ $('ADC Webhook').first().json.subject }}",
        "html": "={{ $('ADC Webhook').first().json.body }}",
        "emailFormat": "html",
        "options": {
          "appendAttribution": false
        }
      },
      "id": "adc-smtp-email",
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [680, 300],
      "credentials": {
        "smtp": {
          "id": "YOUR_SMTP_CREDENTIAL_ID_HERE",
          "name": "SMTP Credentials"
        }
      }
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{JSON.stringify({ \"success\": true, \"recipientCount\": $('ADC Webhook').first().json.recipients.length })}}",
        "options": {}
      },
      "id": "adc-respond-to-webhook",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1.1,
      "position": [260, 500]
    }
  ],
  "connections": {
    "ADC Webhook": {
      "main": [
        [
          {
            "node": "Expand Recipients",
            "type": "main",
            "index": 0
          },
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Expand Recipients": {
      "main": [
        [
          {
            "node": "Send Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "settings": {
    "executionOrder": "v1"
  }
}
```

## Node details

### Webhook

- Method: `POST`
- Path: `adc-email-sender` (n8n will generate the full URL for you)
- Response Mode: `Using Respond to Webhook Node`

### Expand Recipients (Code)

- Mode: `Run Once for All Items`
- Language: `JavaScript`
- Code:

```js
const recipients = $input.first().json.recipients || [];
return recipients.map((email) => ({ json: { email } }));
```

This produces one item per recipient, so the Send Email node runs once for every email address.

### Send Email (SMTP)

- **From** — e.g. `info@aldeia-djembe-camp.com`
- **To** — `={{ $json.email }}`
- **Subject** — `={{ $('ADC Webhook').first().json.subject }}`
- **Email Format** — `HTML`
- **HTML** — `={{ $('ADC Webhook').first().json.body }}`
- **Options** — `Append n8n attribution` should be off so your emails stay clean.

> Make sure the SMTP credential uses the correct sender address and your provider lets you send bulk/batch emails.

### Respond to Webhook

- **Respond With**: `JSON`
- **Response Body**:

```text
={{JSON.stringify({ "success": true, "recipientCount": $('ADC Webhook').first().json.recipients.length })}}
```

## Testing the webhook manually

Replace the URL below with your n8n webhook URL and run it from your terminal:

```bash
curl -X POST https://your-n8n-instance/webhook/adc-email-sender \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Test from ADC app",
    "body": "<p>This is a test email.</p>",
    "recipients": ["your-email@example.com"]
  }'
```

Then check **Executions** in n8n:

- The **Expand Recipients** node should output 1 item per recipient.
- The **Send Email** node should show one green execution per item. If it is greyed out or empty, the node never received a valid recipient string.
- If Send Email is green but no email arrives, the issue is the SMTP credentials or the recipient spam folder.

## Optional: protect the webhook

If you add an API key to the n8n Webhook node, set `N8N_WEBHOOK_API_KEY` in `.env` and the app will forward it as a `Bearer` token.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| App shows “Email service is not configured” | `N8N_WEBHOOK_URL` is missing | Add the n8n webhook URL to `.env` |
| App shows “Failed to queue email via automation service” | n8n returned an error | Check n8n Executions for the failing node |
| Send Email node has no output / does not run | Recipients were not expanded into items | Verify the Code node output and Send Email `To` expression |
| Emails not delivered | SMTP credentials incorrect | Verify host/port/user/password in n8n |
| Emails land in spam | SPF/DKIM not configured | Add the correct DNS records for your SMTP sender |
| HTML formatting is ignored | Email Format is set to `Text` | Set Email Format to `HTML` in the Send Email node |
