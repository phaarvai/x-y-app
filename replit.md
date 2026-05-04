# AssistAI — Workspace

## Overview

AssistAI is a full-stack AI assistant web app built as a pnpm monorepo. It features voice search, multilingual support (12+ languages including RTL), AI-mocked responses, user authentication, and an accessible deep-ocean-blue design.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/main-app) — port from `PORT` env
- **API server**: Express 5 (artifacts/api-server) — port 8080
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec at lib/api-spec)
- **UI Components**: shadcn/ui + Tailwind CSS v4
- **Routing**: Wouter
- **State/data**: TanStack React Query

## Application Structure

```
artifacts/main-app/     # React+Vite frontend (previewPath: /)
artifacts/api-server/   # Express API server (previewPath: /api)
lib/api-spec/           # OpenAPI spec + codegen config
lib/api-client-react/   # Generated React Query hooks
lib/api-zod/            # Generated Zod schemas
lib/db/                 # Drizzle ORM schema + DB client
```

## Frontend Pages

| Path | Component | Auth required |
|------|-----------|---------------|
| `/` | HomePage | No |
| `/search` | SearchPage | No |
| `/login` | LoginPage | No |
| `/register` | RegisterPage | No |
| `/history` | HistoryPage | Yes |
| `/chat/:id` | ChatPage | Yes |
| `/profile` | ProfilePage | Yes |

## Features

- **Auth**: JWT-style token stored in `localStorage.assistai_token`; `AuthProvider` + `useAuth` hook; auto-attached to all API requests via custom fetch
- **Search**: Text + voice (Web Speech API); language selector (12+ languages); AI-mocked response + web results; trending suggestions
- **Multilingual**: RTL support via `useLanguage` hook; `document.dir` toggled automatically
- **Dark mode**: Toggle in navbar; preference persisted to localStorage
- **History**: Full conversation list with stats (total conversations, messages, languages, voice queries)
- **Profile**: User info, usage stats, top queries

## Demo Accounts

- `demo@assistai.com` / `demo123`
- `guest@assistai.com` / `demo123`

## Database Schema

- `users` — id, name, email, password_hash, preferred_language, created_at
- `sessions` — id, user_id, token, expires_at, created_at
- `conversations` — id, user_id, title, language, is_voice, message_count, created_at, updated_at
- `messages` — id, conversation_id, role, content, is_voice, created_at

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Auth Token Notes

- Token key in localStorage: `assistai_token`
- `lib/api-client-react/src/custom-fetch.ts` auto-reads it and attaches as `Authorization: Bearer <token>`
- No `setAuthTokenGetter` call needed in web context

## Codegen Notes

- `lib/api-zod/src/index.ts` must only export `export * from "./generated/api";` — orval barrel auto-patched by codegen script
- Hook import pattern: `useGetConversation(id, { query: { enabled: !!id, queryKey: getGetConversationQueryKey(id) } })`
- Mutation pattern: `mutation.mutate({ data: { ... } }, { onSuccess: (res) => ... })`
