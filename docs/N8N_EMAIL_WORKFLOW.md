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
2. **Validate Data** node — validates the payload and normalises it.
3. **Expand Recipients** node — turns the `recipients` array into one n8n item per email address.
4. **Email (SMTP)** node — sends one email for each item.
5. **Respond to Webhook** node — replies to the app immediately so the UI shows success.

> **Why a Code node?** n8n's "Split In Batches" splits **items**, not the values inside an item. Without the Code node, the Send Email node receives the whole payload object (`$json`) as the recipient and produces no visible output.

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
        "jsCode": "const input = $('ADC Webhook').first().json.body || $('ADC Webhook').first().json;\n\nconst subject = input.subject;\nconst body = input.body;\nconst recipients = input.recipients;\n\nif (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {\n  throw new Error('Missing required fields: subject, body, or recipients');\n}\n\nreturn [{\n  json: {\n    subject,\n    body,\n    recipients,\n    recipientCount: recipients.length,\n    timestamp: new Date().toISOString(),\n    source: input.source || 'adc-registration-app'\n  }\n}];"
      },
      "id": "adc-validate-data",
      "name": "Validate Data",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [440, 300]
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
      "position": [620, 300]
    },
    {
      "parameters": {
        "fromEmail": "=Team ADC <contact@aldeia-djembe-camp.com>",
        "toEmail": "={{ $json.email }}",
        "subject": "={{ $('Validate Data').first().json.subject }}",
        "html": "={{ $('Validate Data').first().json.body }}",
        "emailFormat": "html",
        "options": {
          "appendAttribution": false
        }
      },
      "id": "adc-smtp-email",
      "name": "Send Email",
      "type": "n8n-nodes-base.emailSend",
      "typeVersion": 2,
      "position": [840, 300],
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
        "responseBody": "={{JSON.stringify({ \"success\": true, \"recipientCount\": $('Validate Data').first().json.recipientCount })}}",
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
            "node": "Validate Data",
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
    "Validate Data": {
      "main": [
        [
          {
            "node": "Expand Recipients",
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

### Validate Data (Code)

- Mode: `Run Once for All Items`
- Language: `JavaScript`
- Code:

```js
const input = $('ADC Webhook').first().json.body || $('ADC Webhook').first().json;

const subject = input.subject;
const body = input.body;
const recipients = input.recipients;

if (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
  throw new Error('Missing required fields: subject, body, or recipients');
}

return [{
  json: {
    subject,
    body,
    recipients,
    recipientCount: recipients.length,
    timestamp: new Date().toISOString(),
    source: input.source || 'adc-registration-app'
  }
}];
```

This validates that the webhook contains `subject`, `body`, and a non-empty `recipients` array. It also normalises the structure so downstream nodes can reference `Validate Data` instead of the webhook node directly.

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

- **From** — `Team ADC <contact@aldeia-djembe-camp.com>`

  > Use the `Display Name <address@domain.com>` format so recipients see "Team ADC" instead of just the email address. If your SMTP provider rejects display names, keep only the address, then add `Reply-To: contact@aldeia-djembe-camp.com` in the options.

- **To** — `={{ $json.email }}`
- **Subject** — `={{ $('Validate Data').first().json.subject }}`
- **Email Format** — `HTML`
- **HTML** — `={{ $('Validate Data').first().json.body }}`
- **Options** — `Append n8n attribution` should be off so your emails stay clean.

> Make sure the SMTP credential uses the correct sender address and your provider lets you send bulk/batch emails.

### Respond to Webhook

- **Respond With**: `JSON`
- **Response Body**:

```text
={{JSON.stringify({ "success": true, "recipientCount": $('Validate Data').first().json.recipientCount })}}
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

- The **Validate Data** node should output one item with `subject`, `body`, and `recipients`.
- The **Expand Recipients** node should output 1 item per recipient.
- The **Send Email** node should show one green execution per item. If it is greyed out or empty, the node never received a valid recipient string.
- If Send Email is green but no email arrives, the issue is the SMTP credentials or the recipient spam folder.

## Optional: protect the webhook

If you add an API key to the n8n Webhook node, set `N8N_WEBHOOK_API_KEY` in `.env` and the app will forward it as a `Bearer` token.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| App shows “Email service is not configured” | `N8N_WEBHOOK_URL` is missing | Add the n8n webhook URL to `.env` |
| App shows “Failed to queue email via automation service” | `Validate Data` threw a validation error | Confirm the app sends `subject`, `body`, and a non-empty `recipients` array |
| Send Email node has no output / does not run | Recipients were not expanded into items | Verify the Expand Recipients node output and Send Email `To` expression |
| Emails not delivered | SMTP credentials incorrect | Verify host/port/user/password in n8n |
| Emails land in spam | SPF/DKIM not configured or From domain differs from SMTP domain | Add DNS records for your SMTP sender; consider matching the From domain to your SMTP login |
| Sender shows raw address instead of "Team ADC" | From field has no display name | Use `=Team ADC <contact@aldeia-djembe-camp.com>` |
| HTML formatting is ignored | Email Format is set to `Text` | Set Email Format to `HTML` in the Send Email node |
