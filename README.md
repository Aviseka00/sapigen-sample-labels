# Sapigen Sample Label Studio

Web app for creating, saving, and printing batch sample labels for **Sapigen Biologix Pvt. Ltd**.

## Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB (`mongodb://localhost:27017/sapigen_labels`)

## Setup

1. Start MongoDB locally on port `27017`.

2. Install dependencies:

```bash
npm run install:all
```

3. Create the default user:

```bash
npm run seed
```

Default login: **admin** / **admin123**

4. Start the API (terminal 1):

```bash
npm run server
```

5. Start the UI (terminal 2):

```bash
npm run client
```

Open [http://localhost:5173](http://localhost:5173).

## Features

- Login / register
- Create sample labels matching the official blank layout
- Set A4 layout (1 / 2 / 4 / 6 / 8 labels per page) and total quantity
- Save labels to MongoDB
- Print preview → browser print
- Archive by **date folder** and **user**

## API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/register` | Create account |
| GET | `/api/labels` | List labels (optional `?folderDate=YYYY-MM-DD`) |
| GET | `/api/labels/folders` | Date folders for current user |
| POST | `/api/labels` | Create label |
| PUT | `/api/labels/:id` | Update label |
| POST | `/api/labels/:id/print` | Mark printed & file by date |
