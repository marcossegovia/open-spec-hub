# Unified API Contract Documentation Platform

## Project Vision
A **protocol-agnostic documentation platform** that provides a centralized, unified approach for documenting all types of API contracts. Users interact with a **common UI** regardless of protocol type, abstracting away complexity and specifics of different API paradigms.

**Core Philosophy**: Users shouldn't need to understand protocol differences to navigate and comprehend API contracts. The platform normalizes different API paradigms into a common conceptual model.

---

## Unified Conceptual Model

### Philosophy: Protocol Abstraction
Instead of exposing protocol-specific terminology (endpoints vs channels, requests vs messages), we normalize all API contracts into a **common conceptual model**.

### Key Abstractions

| Universal Term | REST (OpenAPI) | AsyncAPI | UI Display |
|----------------|----------------|----------|------------|
| **Operation** | HTTP Endpoint | Channel Operation | "Operation" |
| **ActionType** | GET/POST/PUT/DELETE | PUBLISH/SUBSCRIBE | Badge (GET, POST, PUBLISH, etc.) |
| **location** | URL Path | Channel Name | "Location" |
| **input** | Request Body | Published Message | "Input Schema" |
| **output** | Response Body | Subscribed Message | "Output Schema" |
| **parameters** | Query/Path Params | Headers/Channel Params | "Parameters" |
| **Communication Pattern** | Request → Response | Publish/Subscribe | Icon (⇄ or ⇉) |

---

## File Organization

```
lib/
├── normalization/        # Core abstraction layer (protocol → unified model)
├── parsers/             # OpenAPI & AsyncAPI parsing
└── loaders/             # Spec loading pipeline

components/
├── unified/             # Protocol-agnostic UI components
└── protocol-specific/   # Internal adapters (hidden from users)

specs/
├── openapi/             # OpenAPI YAML/JSON files
└── asyncapi/            # AsyncAPI YAML/JSON files
```

---

## Tech Stack

### Core Technologies
- **Next.js 14** (App Router, SSG) - Static site generation
- **TypeScript** - Type safety
- **Tailwind CSS** + **shadcn/ui** - Styling and components
- **@asyncapi/parser** - AsyncAPI parsing
- **swagger-parser** - OpenAPI parsing
- **highlight.js** - Syntax highlighting (github-dark/github themes)
- **Playwright** - E2E testing

### Why Next.js?
- Built-in static site generation (SSG)
- Great DX (hot reload, TypeScript support)
- Component-based architecture ideal for protocol-agnostic UI
- Easy deployment (Vercel, Netlify, GitHub Pages)

---

## Development Phases

### Phase 1: Project Setup ✅ COMPLETE
- Next.js 14 with TypeScript and Tailwind CSS
- Dependencies installed (@asyncapi/parser, swagger-parser, etc.)
- shadcn/ui components
- Project structure

### Phase 2: Multi-Protocol Parser ✅ COMPLETE
- Unified model interfaces (UnifiedContract, UnifiedOperation)
- Spec detector (auto-detect OpenAPI vs AsyncAPI)
- OpenAPI and AsyncAPI parsers
- Protocol normalizers (OpenAPI → unified, AsyncAPI → unified)
- Spec loader pipeline

### Phase 3: Unified UI ✅ COMPLETE
- ContractExplorer (main viewer)
- OperationCard (universal cards for all protocols)
- OperationDetail (detailed view)
- DataSchema (schema renderer)
- SearchBar, Sidebar (navigation with 3 grouping modes)

### Phase 4: Static Site Generation ⚠️ IN PROGRESS
**Complete:**
- Operation detail pages with routing
- Code examples (JS, Python, cURL, KafkaJS)
- Sidebar integration
- Dark/light mode toggle
- AsyncAPI tags and array items support
- E2E test suite (82 tests)

**Pending:**
- SEO optimization (robots.txt, sitemap, meta tags)
- Collapsible sections
- Homepage contract overview

### Phase 5: Polish & Deployment ❌ NOT STARTED
- Update README.md
- User documentation
- CI/CD setup
- Deploy example site
- Final accessibility audit

---

## Design Principles

### 1. Protocol Abstraction First
Hide protocol complexity, don't showcase it. Every design decision prioritizes the unified model over protocol-specific features.

### 2. Consistent Terminology
Never expose protocol-specific terms (endpoint, channel, request, message) in primary UI. Use universal terms (operation, input, output, parameters).

### 3. Progressive Disclosure
Protocol details available for power users, but not required for basic navigation. "Works without explanation, details when needed."

### 4. Single Source of Truth
The unified model is the canonical representation. Protocol-specific data is implementation detail.

### 5. Future-Proof Architecture
Design the unified model to accommodate future protocols (GraphQL, gRPC, WebRTC, MQTT) without major refactoring.

---

## Future Enhancements

### Short-term
- Additional AsyncAPI protocols (MQTT, AMQP, WebSocket, SNS/SQS)
- Version comparison (diff between API versions)
- Export to Markdown/PDF
- SEO optimization and structured data

### Long-term
- GraphQL and gRPC support
- Mock server generation from specs
- Automated test generation
- SDK code generation
- Analytics dashboard

---

**Last Updated**: 2025-11-09
**Version**: 2.0.0 (Unified Protocol-Agnostic Edition)
