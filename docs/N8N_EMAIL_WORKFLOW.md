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

1. **Webhook** node — receives the payload from the app.
2. **Split In Batches** node — loops through the `recipients` array.
3. **Email (SMTP)** node — sends one email per recipient.

## Import the workflow (ready-to-paste JSON)

1. In n8n, open **Workflows**.
2. Click **...** → **Import from JSON** (or create a new workflow and use **Import from File**).
3. Paste the JSON below.
4. Update the **Email (SMTP)** credentials to match your SMTP provider.
5. Copy the webhook URL n8n generates and set it in your `.env` as `N8N_WEBHOOK_URL`.
6. Activate the workflow.

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
        "batchSize": 1,
        "options": {}
      },
      "id": "adc-split-batches",
      "name": "Split In Batches",
      "type": "n8n-nodes-base.splitInBatches",
      "typeVersion": 3,
      "position": [460, 300]
    },
    {
      "parameters": {
        "fromEmail": "=info@aldeia-djembe-camp.com",
        "toEmail": "={{ $json }}",
        "subject": "={{ $('ADC Webhook').first().json.body.subject }}",
        "html": "={{ $('ADC Webhook').first().json.body.body }}",
        "options": {}
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
        "responseBody": "= {{JSON.stringify({ success: true, recipientCount: $('ADC Webhook').first().json.body.recipients.length })}}",
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
            "node": "Split In Batches",
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
    "Split In Batches": {
      "main": [
        [
          {
            "node": "Send Email",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Send Email": {
      "main": [
        [
          {
            "node": "Split In Batches",
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

### Split In Batches

- Input: `["a@x.com", "b@x.com", ...]`
- Batch size: `1`
- Each loop outputs one email address.

### Respond to Webhook

- **Respond With**: `JSON`
- **Response Body**:

```text
={{JSON.stringify({ "success": true, "recipientCount": $('ADC Webhook').first().json.body.recipients.length })}}
```

> Use `.first()` because the Split In Batches loop outputs one item at a time, while the original webhook payload lives on the first item.

### Send Email (SMTP)

- **From** — set in the SMTP node (not sent by the app)
- **To** — `={{ $json }}` (current email from Split In Batches)
- **Subject** — `={{ $('ADC Webhook').first().json.body.subject }}`
- **HTML** — `={{ $('ADC Webhook').first().json.body.body }}`

> Make sure the SMTP credential uses the correct sender address and your provider lets you send bulk/batch emails.

## Optional: protect the webhook

If you add an API key to the n8n Webhook node, set `N8N_WEBHOOK_API_KEY` in `.env` and the app will forward it as a `Bearer` token.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| App shows “Email service is not configured” | `N8N_WEBHOOK_URL` is missing | Add the n8n webhook URL to `.env` |
| Emails not delivered | SMTP credentials incorrect | Verify host/port/user/password in n8n |
| n8n receives payload but sends nothing | `recipients` not wired to Split In Batches | Confirm node expressions match the JSON above |
| Emails land in spam | SPF/DKIM not configured | Add the correct DNS records for your SMTP sender |
