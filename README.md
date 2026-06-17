# Lumière Beauty — E-commerce with n8n

> Luxury D2C beauty storefront with a live n8n automation workflow for customer queries.

**Suggested repository name:** `lumiere-beauty-ecommerce-n8n`

**Live App:** https://lumiere-ankita.lovable.app
**Built With:** Lovable · React · n8n · Telegram · Google Sheets · OpenAI GPT-4
**Supporting Material:** [Walkthrough](https://drive.google.com/file/d/1TeaItOd8ICoHOH1zZ-StoEeJrtQ2-hVx/view?usp=sharing)

## Overview

Lumière Beauty is a luxury D2C beauty storefront built to handle two things real e-commerce sites struggle with at small scale: product reviews and customer query resolution. What makes it interesting is the backend — it's wired to a live n8n automation workflow that actually processes incoming queries end-to-end.

## Key Features

- Storefront UI for browsing products and reading/leaving reviews
- Customer queries automatically routed through a live n8n workflow
- Telegram used as a channel for query intake/notifications
- Google Sheets used as a lightweight data store for query/response logs
- OpenAI GPT-4 used to generate responses to customer queries automatically

## Context

Built to demonstrate a full AI-assisted customer service loop on top of an e-commerce front end — not just a chatbot widget, but an actual automation pipeline connecting the storefront to messaging, data storage, and an LLM for response generation.

## Tech Stack

- **Lovable** — AI app builder used to scaffold and ship the storefront
- **React** — front-end framework
- **n8n** — workflow automation engine powering query handling
- **Telegram** — messaging channel integrated into the workflow
- **Google Sheets** — lightweight data store for logging queries/responses
- **OpenAI GPT-4** — generates automated responses to customer queries

## Running This Project

This is a hosted, live app with a connected n8n workflow — no installation needed to view the storefront. To reproduce the automation, you'll need your own n8n instance with Telegram, Google Sheets, and OpenAI credentials configured; the workflow itself can be exported from n8n as a `.json` file and included in this repo.

## About the Creator

Built by **Ankita Chatterjee**, Product Owner (Tech & AI) at Axis Bank's Digital Business & Transformations division.

- Email: chatterjeeankita0903@gmail.com
- LinkedIn: https://www.linkedin.com/in/ankita-chatterjee-81811a147
- GitHub: https://github.com/chatterjeeankita0903-boop
- Portfolio: https://ankita-chatterjee-portfolio.lovable.app
