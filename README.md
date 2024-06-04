# kset-discord-verifikator-bot

This is the repository for the [Festival amaterskog filma](https://faf.kset.org) website.

## Setup

Install dependencies:

```bash
npm install
```

Create `.env` file. The template is in `.env.example`.


## Development

Run dev server: 

```bash
npm run dev
```

Server will start on http://localhost:5173 by default.

To build, first run 

```bash
npm run build
```

and then 

```bash
npm run preview
```

## Production

There's a Dockerfile in the repo, which you can use to run application in a production environment. 
