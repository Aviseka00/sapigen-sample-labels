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
- **Standard Sapigen sample label** (official format kept as-is)
- **Custom templates** — set your own rows, columns, size (mm), writeups, and save for reuse
- Set A4 layout (1 / 2 / 4 / 6 / 8 labels per page) and total quantity
- Save labels to MongoDB
- Print preview → browser print
- Archive by **date folder** and **user**

## Custom templates

1. Open **Templates** in the app (or go to `/templates`)
2. Click **New custom template**
3. Set name, rows, columns, width/height (mm), optional header/logo
4. Add writeup text for each cell and mark which cells are fillable inputs
5. Save the template
6. On **Create**, choose your template from **Label format** (or keep Standard Sapigen)

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
| GET | `/api/templates` | List your templates |
| POST | `/api/templates` | Create custom template |
| PUT | `/api/templates/:id` | Update template |
| DELETE | `/api/templates/:id` | Delete template |
