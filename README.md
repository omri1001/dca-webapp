# DCA-Webapp

## Overview

**DCA-Webapp** is a full-stack web application that presents various reports and leverages GPT-4 (Large Language Model) functionality on the server side. The project is split into two main parts:

1. **Client (React + MUI + Vite + TypeScript)** – Located in the `react-mui-vite-ts` folder.
2. **Server (Node.js + Express)** – Located in the `server` folder.

This README provides setup instructions for both parts of the application.

---

## Repository Structure
```
dca-webapp/
├── react-mui-vite-ts/   # Client-side (React, MUI, Vite, TS)
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
└── server/              # Server-side (Node.js, Express)
├── package.json
└── server.js
```

---

## Prerequisites

- **Node.js** (v14+ recommended)
- **npm** (v6+ recommended)

---

## Client Setup

1. ** Install dependencies:**:

    ```bash
    npm install
    ```
   Run the client:
     ```bash
    npm start
     ```
## Server Setup
Navigate to the server folder:
```bash
cd server
```
Install dependencies:
```bash
npm install
```
Run the server:
```bash
npm start
```

Environment Variables
For the server-side to interact with GPT-4 and other services, you need to configure the following environment variables in a .env file:
```
OPENAI_API_KEY=<your-openai-api-key>
MONGODB_URI=<your-mongodb-connection-string>
```

## Built With
Client (react-mui-vite-ts):

React 19
Material-UI (MUI)
Vite
TypeScript
React Router
Recharts
Axios
Server (server):

Node.js
Express
Mongoose (MongoDB)
OpenAI
Chart.js
Docx, Docxtemplater
PDF-lib
Officegen
And other utility packages

