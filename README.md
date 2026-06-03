# MangarrJS

A modern manga discovery and download platform that aggregates manga information from multiple sources through APIs and web scraping.

MangarrJS allows users to search for manga across multiple providers, compare results from different sources, and download content through a unified interface.

## Features

### Currently Implemented

* Search manga across multiple active sources:

    * AniList API
    * MangaDex API
    * MangaPill (web scraping)
* Unified search experience across all configured providers
* Backend response caching using Redis
* Local data persistence using SQLite
* Shared TypeScript library for code reuse across applications

### Planned Features

* Manga metadata aggregation and normalization
* Chapter browsing
* Manga downloads
* Download queue management
* Favorites and bookmarks
* Source health monitoring
* Advanced filtering and sorting
* Background synchronization jobs

---

## Architecture

MangarrJS is built as a monorepo using **pnpm workspaces**.

```text
.
├── apps/
│   ├── backend/      # Node.js + Express API
│   └── frontend/     # Next.js application
│
├── packages/
│   └── shared/       # Shared types, utilities and business logic
│
├── pnpm-workspace.yaml
└── README.md
```

### Backend

Built with:

* Node.js
* Express
* Redis
* SQLite
* TypeScript

Responsibilities:

* Source integrations
* Search aggregation
* Data normalization
* Caching
* Download orchestration

### Frontend

Built with:

* Next.js
* React
* TypeScript

Responsibilities:

* Search interface
* Manga discovery
* Download management
* User experience

### Shared Package

Contains reusable code shared between frontend and backend:

* Shared types
* API contracts
* Utility functions
* Common business logic

---

## Technology Stack

| Component       | Technology          |
| --------------- | ------------------- |
| Package Manager | pnpm                |
| Monorepo        | pnpm Workspaces     |
| Backend         | Node.js + Express   |
| Frontend        | Next.js             |
| Language        | TypeScript          |
| Cache           | Redis               |
| Database        | SQLite              |
| APIs            | AniList, MangaDex   |
| Scraping        | Custom Web Scrapers |

---

## Supported Sources

| Source    | Type         | Status |
| --------- | ------------ | ------ |
| AniList   | API          | Active |
| MangaDex  | API          | Active |
| MangaPill | Web Scraping | Active |

---

## Getting Started

### Prerequisites

* Node.js 20+
* pnpm 9+
* Redis
* SQLite

### Installation

Clone the repository:

```bash
git clone https://github.com/NigellRudge/mangarr.git

cd mangarr
```

Install dependencies:

```bash
pnpm install
```

---

## Environment Variables

### Backend

Create a `.env` file inside the backend application:

```env
PORT=3001

REDIS_URL=redis://localhost:6379

DATABASE_PATH=./data/database.sqlite
```

### Frontend

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Development

Start all workspace applications:

```bash
pnpm dev
```

Run the backend only:

```bash
pnpm --filter backend dev
```

Run the frontend only:

```bash
pnpm --filter frontend dev
```

Build all projects:

```bash
pnpm build
```

Run tests:

```bash
pnpm test
```

---

## Caching

MangarrJS uses Redis to cache responses from external providers, reducing unnecessary requests and improving search performance.

Benefits include:

* Faster search results
* Reduced API usage
* Lower load on external services
* Improved user experience

---

## Database

SQLite is used for local persistence.

Potential stored data includes:

* Search history
* Download metadata
* Application settings
* Source-specific information

---

## Roadmap

* [x] AniList integration
* [x] MangaDex integration
* [x] MangaPill integration
* [x] Unified search
* [x] Redis caching
* [x] SQLite persistence
* [ ] Manga downloads
* [ ] Chapter management
* [ ] Download queue system
* [ ] User favorites
* [ ] Source monitoring
* [ ] Metadata synchronization

---

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "feat: add new source"
```

4. Push your branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

## Repository

GitHub Repository:

[MangarrJS Repository](https://github.com/NigellRudge/mangarr?utm_source=chatgpt.com)

---

## Legal Notice

MangarrJS aggregates publicly available manga information from third-party sources. Users are responsible for ensuring that their use of downloaded content complies with applicable copyright laws, licensing requirements, and the terms of service of the source providers.

---

## License

MIT License

See the `LICENSE` file for details.
