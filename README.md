# Unified API Documentation Platform

A protocol-agnostic documentation platform that provides a centralized approach for documenting all types of API contracts through a common, intuitive UI.

## Vision

Users shouldn't need to understand protocol differences to navigate and comprehend their API contracts. This platform normalizes different API paradigms (REST, event-driven, etc.) into a common conceptual model.

## Current Status: Phase 2 in Progress

### ✅ Phase 1: Project Setup (Complete)
- Next.js 14 with TypeScript and Tailwind CSS
- shadcn/ui base components
- Core dependencies installed
- Project folder structure created
- Example OpenAPI and AsyncAPI specs added

### 🚧 Phase 2: Multi-Protocol Parser & Normalization Layer (In Progress)
- ✅ Unified model TypeScript interfaces defined
- ✅ Spec detector (auto-detect OpenAPI vs AsyncAPI)
- ✅ OpenAPI parser (swagger-parser integration)
- ✅ AsyncAPI parser (@asyncapi/parser integration)
- ✅ OpenAPI normalizer (REST → Unified Model)
- ✅ AsyncAPI normalizer (Events → Unified Model)
- ⏳ Utility functions for search and grouping

### 📋 Upcoming Phases
- Phase 3: Unified Protocol-Agnostic UI
- Phase 4: Static Site Generation
- Phase 5: Polish & Deployment

## Core Philosophy

### Protocol Abstraction
The platform's primary value is **hiding protocol complexity**, not showcasing it. All API contracts are normalized into universal concepts:

- **Operation** - A unit of API interaction (REST endpoint or AsyncAPI channel operation)
- **Input Data** - Data being sent (request body or published message)
- **Output Data** - Data being received (response or subscribed message)
- **Parameters** - Additional data (query params, headers, message headers)
- **Communication Pattern** - Request/Response (sync) or Publish/Subscribe (async)

### Unified Conceptual Model

| Concept | REST (OpenAPI) | AsyncAPI | UI Display |
|---------|----------------|----------|------------|
| Operation | HTTP Endpoint | Channel Operation | "Operation" |
| Action Type | HTTP Method (GET, POST) | Publish/Subscribe | Badge with action |
| Location | URL Path | Channel Name | "Location" |
| Input Data | Request Body | Published Message | "Input Schema" |
| Output Data | Response Body | Subscribed Message | "Output Schema" |

## Project Structure

```
api-docs/
├── app/                          # Next.js app router
├── components/
│   ├── ui/                       # shadcn base components
│   ├── unified/                  # Protocol-agnostic components
│   └── protocol-specific/        # Internal adapters
├── lib/
│   ├── parsers/                  # OpenAPI & AsyncAPI parsers
│   ├── normalization/            # Protocol normalizers
│   ├── generators/               # Code examples, SSG helpers
│   └── utils.ts                  # Utilities
├── specs/
│   ├── openapi/                  # OpenAPI specs
│   └── asyncapi/                 # AsyncAPI specs
└── public/                       # Static assets
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Example Specs

The project includes complete example specs for an e-commerce platform:

- **REST API** (`specs/openapi/ecommerce-api.yaml`): Products, Orders, Users
- **Event Stream** (`specs/asyncapi/ecommerce-events.yaml`): Order events, Inventory updates, Notifications

These demonstrate how the platform handles mixed protocols for the same business domain.

## Design Principles

1. **Protocol Abstraction First** - Hide complexity, don't showcase it
2. **Consistent Terminology** - Never expose protocol-specific terms in primary UI
3. **Progressive Disclosure** - Details when needed, not required for navigation
4. **Single Source of Truth** - Unified model is canonical
5. **Future-Proof** - Easy to add new protocols (GraphQL, gRPC)

## License

MIT

---

**Version**: 2.0.0 (Unified Protocol-Agnostic Edition)
**Last Updated**: 2025-11-08
