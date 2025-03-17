
## What is this

Registration form for participants of [ADC](https://aldeia-djembe-camp.com) a Drum & Dance workshop week in Portugal

## What problem does it solve: Registrations and Payment Instructions

The organisation team has been handling all payment instructions, collection and confirmation via email, causing unnecessary extra of work. They have never tought of a payment solution due to low key demand and high cost of payment gateways.

This form will handle the whole registration process and handle payment instructions at the same time: user fills out the details, gets the sum of the costs and payment instructions and (hopefully) makes the bank transfer immediately via their own banking app.

There is a high level of trust between participants and the organisation so good will and honesty is expected. At the same time, theycan continue avoiding fees attached to a payment gateway solutions. The festival is still releatively small

## Tech-stack

- __v0__ for prototyping
- __NextJs__ app server for development
- __MongoDB__ for CRUD management
- __React-Hook-Form__ for form handling
- __Cloudflare / Vercel__ deployment

## Approach

The prototype will be enhanced with React Hook form for stable and effective form handling and zod for verification. This removes the need for too many state variables while keeping the form itself highly scalable.

The client side application will be handling solely POST requests to the DB while an admin dashboard (next phase) will later work with that data as seen fit (mostly for revenue estimates, average profit/loss per workshop, etc).

## Unresolved

Organisation still need to request payment confitmation screenshot to fully confirm registration. The form itself only includes a check box of "good will" for this.

