# Unified API Contract Documentation Platform

## Project Vision
A **protocol-agnostic documentation platform** that provides a centralized, unified approach for documenting all types of API contracts. Users interact with a **common UI** regardless of protocol type, abstracting away the complexity and specifics of different API paradigms.

## Project Overview
Build a static site generator for universal API contract documentation that:
- Accepts **OpenAPI 3.x** specs for REST APIs (YAML/JSON)
- Accepts **AsyncAPI 2.x/3.x** specs for event-driven APIs (Kafka, MQTT, etc.)
- **Presents all API types through a unified, protocol-agnostic interface**
- Provides a **consistent user experience** regardless of underlying protocol
- **Abstracts protocol-specific details** while preserving necessary technical information
- Deploys to static hosting (Vercel, Netlify, GitHub Pages)

**Core Philosophy**: Users shouldn't need to understand protocol differences to navigate and comprehend their API contracts. The platform normalizes different API paradigms into a common conceptual model.

**Note**: This platform focuses on documentation generation. Users can leverage Claude Code agents and slash commands to assist with spec completion and exploration during development.

## Recommended Tech Stack

### Core Technologies
- **Next.js 14+** (App Router) - Full-stack React framework with static export
- **TypeScript** - Type safety for spec parsing and validation
- **Tailwind CSS** - Modern, customizable styling
- **shadcn/ui** - Beautiful, accessible UI components
- **@asyncapi/parser** - Parse and validate AsyncAPI specs
- **swagger-parser** - Parse and validate OpenAPI specs
- **openapi-typescript** - Generate TypeScript types from OpenAPI specs
- **js-yaml** - YAML parsing for both spec types
- **zod** - Runtime validation

### Why Next.js?
- Built-in static site generation (SSG)
- Great developer experience with hot reload, TypeScript support
- Easy deployment to Vercel/Netlify with zero config
- Large ecosystem for both OpenAPI and AsyncAPI tooling
- Component-based architecture ideal for unified, abstracted UI patterns

## Project Structure

```
api-docs/
├── src/
│   ├── app/                         # Next.js app router
│   │   ├── page.tsx                 # Home/contract list
│   │   └── [slug]/                  # Dynamic contract pages
│   ├── components/                  # React components
│   │   ├── ui/                      # shadcn components
│   │   ├── unified/                 # Protocol-agnostic unified components
│   │   │   ├── ContractExplorer.tsx # Main viewer (protocol-agnostic)
│   │   │   ├── OperationCard.tsx    # Universal operation/endpoint card
│   │   │   ├── OperationDetail.tsx  # Detailed operation view
│   │   │   ├── DataSchema.tsx       # Universal data schema renderer
│   │   │   ├── Sidebar.tsx          # Navigation sidebar
│   │   │   └── SearchBar.tsx        # Unified search
│   │   └── protocol-specific/       # Protocol-specific adapters (internal)
│   │       ├── rest/                # REST-specific adapters
│   │       └── async/               # AsyncAPI-specific adapters
│   ├── lib/
│   │   ├── parsers/
│   │   │   ├── openapi-parser.ts    # Parse OpenAPI specs
│   │   │   ├── asyncapi-parser.ts   # Parse AsyncAPI specs
│   │   │   └── spec-detector.ts     # Auto-detect spec type
│   │   ├── normalization/           # Protocol normalization layer
│   │   │   ├── unified-model.ts     # Common API contract model
│   │   │   ├── openapi-normalizer.ts    # OpenAPI → unified model
│   │   │   └── asyncapi-normalizer.ts   # AsyncAPI → unified model
│   │   ├── generators/
│   │   │   ├── code-examples.ts     # Generate code examples
│   │   │   └── static-gen.ts        # SSG helpers
│   │   └── utils.ts                 # Utility functions
│   └── specs/                       # User's API specs
│       ├── openapi/                 # OpenAPI specs
│       │   └── example-rest-api.yaml
│       └── asyncapi/                # AsyncAPI specs
│           └── example-kafka.yaml
├── public/                          # Static assets
│   ├── favicon.ico
│   └── logo.svg
├── next.config.js                   # Next.js config (output: 'export')
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md                        # Setup instructions
```

## Unified Conceptual Model

### Philosophy: Protocol Abstraction
Instead of exposing users to protocol-specific terminology (endpoints vs channels, requests vs messages), we normalize all API contracts into a **common conceptual model**:

#### Core Concepts (Protocol-Agnostic)
1. **Contract** - A complete API specification (OpenAPI or AsyncAPI)
2. **Operation** - A unit of API interaction
   - REST: An endpoint (GET /users, POST /orders)
   - AsyncAPI: A publish or subscribe operation on a channel
3. **Data Schema** - Structure of data being exchanged
   - REST: Request/response body schemas
   - AsyncAPI: Message payload schemas
4. **Parameters** - Additional data required for the operation
   - REST: Path params, query params, headers
   - AsyncAPI: Message headers, channel parameters
5. **Communication Pattern** - How data flows
   - REST: Request → Response (synchronous)
   - AsyncAPI: Publish or Subscribe (asynchronous)

### UI Abstraction Strategy
The UI uses **universal terminology** and adapts presentation based on the underlying protocol:

| Concept | REST (OpenAPI) | AsyncAPI | UI Display |
|---------|----------------|----------|------------|
| Operation | HTTP Endpoint | Channel Operation | "Operation" |
| Action Type | HTTP Method (GET, POST) | Publish/Subscribe | Badge with action |
| Location | URL Path | Channel Name | "Location" |
| Input Data | Request Body | Published Message | "Input Schema" |
| Output Data | Response Body | Subscribed Message | "Output Schema" |
| Additional Data | Query/Path Params | Headers/Channel Params | "Parameters" |

### Benefits of This Approach
- **Cognitive simplicity**: Users don't need protocol expertise to understand APIs
- **Consistent navigation**: Same UI patterns regardless of protocol
- **Easy comparison**: Users can view REST and event-driven APIs side-by-side
- **Future-proof**: Easy to add new protocols (GraphQL, gRPC) to the same model

## Implementation Plan

### Phase 1: Project Setup
**Goal**: Initialize the project with all necessary dependencies and configuration

1. Initialize Next.js 14 with TypeScript and Tailwind CSS
2. Install core dependencies:
   - `@asyncapi/parser` - AsyncAPI parsing and validation
   - `swagger-parser` - OpenAPI parsing and validation
   - `openapi-typescript` - OpenAPI type generation
   - `js-yaml` - YAML parsing for both spec types
   - `zod` - Runtime validation
   - `react-syntax-highlighter` - Code syntax highlighting
3. Set up shadcn/ui components
4. Configure Next.js for static export
5. Set up project structure with protocol-specific folders
6. Initialize git repository

**Deliverables**:
- Working Next.js app with dev server
- All dependencies installed
- Organized folder structure (rest/, async/, shared/ components)

---

### Phase 2: Multi-Protocol Parser & Normalization Layer
**Goal**: Build parsers and create a unified model that abstracts protocol differences

1. **Spec Detection & Validation**
   - Create spec type detector (`lib/parsers/spec-detector.ts`)
   - Auto-detect OpenAPI vs AsyncAPI from file content
   - Support both YAML and JSON formats

2. **Protocol-Specific Parsers**
   - **OpenAPI Parser** (`lib/parsers/openapi-parser.ts`)
     - Validate specs against OpenAPI 3.x schema
     - Extract endpoints, models, authentication, servers
     - Parse request/response schemas
     - Extract examples and descriptions

   - **AsyncAPI Parser** (`lib/parsers/asyncapi-parser.ts`)
     - Validate specs against AsyncAPI 2.x/3.x schema
     - Extract channels, messages, operations (publish/subscribe)
     - Parse message schemas and headers
     - Extract Kafka-specific bindings and configs
     - Handle servers, security schemes

3. **Unified Model Definition** (`lib/normalization/unified-model.ts`)
   - Define protocol-agnostic TypeScript interfaces:
     - `UnifiedContract` - Complete API contract
     - `UnifiedOperation` - Single operation (endpoint or channel operation)
     - `UnifiedDataSchema` - Data structure (request/response or message)
     - `UnifiedParameter` - Parameters (query params, headers, etc.)
     - `CommunicationPattern` - Request/Response or Publish/Subscribe
   - Include metadata about source protocol for transparency

4. **Protocol Normalizers**
   - **OpenAPI Normalizer** (`lib/normalization/openapi-normalizer.ts`)
     - Transform OpenAPI endpoint → `UnifiedOperation`
     - Map HTTP methods to action types
     - Convert request/response to input/output schemas

   - **AsyncAPI Normalizer** (`lib/normalization/asyncapi-normalizer.ts`)
     - Transform AsyncAPI channel operations → `UnifiedOperation`
     - Map publish/subscribe to action types
     - Convert messages to input/output schemas

5. **Utility Functions**
   - Grouping operations by tags/categories (protocol-agnostic)
   - Universal search/filtering across all operations
   - Code example generation (adapts to protocol)

6. **Example Specs**
   - Add example OpenAPI 3.x spec (REST API)
   - Add example AsyncAPI 3.x spec (Kafka topics)

**Deliverables**:
- Robust multi-protocol parsers with type safety
- **Unified model** that abstracts all protocols
- Normalizers that convert protocol-specific data to unified model
- Example specs for both OpenAPI and AsyncAPI

---

### Phase 3: Unified Protocol-Agnostic UI
**Goal**: Build a common UI that works seamlessly with the unified model, abstracting protocol differences

1. **Universal Layout & Navigation** (`components/unified/`)
   - Create responsive layout with sidebar
   - Build navigation tree from unified operations (tags/categories)
   - Breadcrumb navigation using protocol-agnostic terminology
   - Mobile-responsive menu
   - Subtle protocol badges (REST/Kafka) for transparency, not primary navigation

2. **Core Unified Components**
   - **ContractExplorer**: Main viewer consuming unified model
     - Displays all operations regardless of protocol
     - Consistent layout and presentation
     - Single codebase for all protocol types

   - **OperationCard**: Universal operation summary card
     - Shows: Action type (GET, POST, Publish, Subscribe)
     - Shows: Location (URL path or channel name)
     - Shows: Description and tags
     - Identical appearance for REST and AsyncAPI operations

   - **OperationDetail**: Complete operation documentation
     - Action type and location prominently displayed
     - Communication pattern (Request/Response or Publish/Subscribe)
     - Input data schema (request body or published message)
     - Output data schema (response or subscribed message)
     - Parameters section (path/query params or message headers)
     - Authentication/security requirements
     - Code examples (adapts to protocol)

   - **DataSchema**: Universal schema renderer
     - Renders JSON schemas from unified model
     - Properties, types, nested objects, arrays
     - Validation rules (required, min/max, patterns, enums)
     - Examples and descriptions
     - Works identically for REST and AsyncAPI schemas

   - **SearchBar**: Protocol-agnostic search
     - Search across all operations by name, description, tags
     - No protocol-specific filters exposed to user
     - Results presented uniformly

   - **Sidebar**: Unified navigation
     - Group operations by tags/categories
     - No separation by protocol type in primary view
     - Optional protocol filter for advanced users

3. **Protocol-Specific Adapters** (`components/protocol-specific/`)
   - Internal adapter components (not exposed to users)
   - Handle protocol-specific rendering nuances when needed
   - Transform protocol-specific metadata for display
   - Keep protocol complexity hidden from main UI

4. **Features & Polish**
   - Syntax highlighting for code examples
   - Dark/light theme toggle
   - Consistent color palette across all protocols
   - Action-type color coding (GET=blue, POST=green, Publish=purple, etc.)
   - Collapsible sections for complex schemas
   - Copy-to-clipboard for code examples
   - Communication pattern indicators (sync vs async)

**Deliverables**:
- **Fully unified UI** with no protocol-specific sections
- Beautiful, responsive design with consistent UX
- Users can navigate entire API without knowing protocols
- Protocol information available but not emphasized

---

### Phase 4: Static Site Generation
**Goal**: Configure the app to generate optimized static sites

1. **Next.js Static Export Configuration**
   - Configure `next.config.js` for static export
   - Set up dynamic route generation from both OpenAPI and AsyncAPI specs
   - Handle client-side routing for SPA behavior

2. **Build-Time Generation**
   - Generate pages from all specs at build time (both protocols)
   - Create static JSON data files for client-side hydration
   - Optimize images and assets
   - Generate separate routes for REST endpoints and AsyncAPI channels

3. **SEO Optimization**
   - Add meta tags for each page (title, description, OG tags)
   - Protocol-specific metadata (REST API vs Event-Driven API)
   - Generate structured data (JSON-LD) for search engines
   - Create robots.txt and sitemap.xml
   - Implement proper heading hierarchy

4. **Performance Optimization**
   - Code splitting for faster initial load
   - Lazy load heavy components (syntax highlighter, protocol-specific components)
   - Optimize bundle size
   - Tree-shake unused protocol components

**Deliverables**:
- Fully static, deployable site supporting multiple protocols
- Optimized for SEO and performance
- Fast page loads and navigation
- Efficient code splitting per protocol

---

### Phase 5: Polish & Deployment
**Goal**: Prepare the project for production use and easy deployment

1. **User Documentation**
   - Write comprehensive README.md
   - Create user guide for adding specs (both OpenAPI and AsyncAPI)
   - Document configuration options
   - Add troubleshooting section
   - Include examples for both protocol types

2. **Customization**
   - Create config file for branding (logo, colors, title)
   - Add support for custom CSS
   - Allow custom footer/header content
   - Support for multiple specs in one site (mixed protocols)

3. **CI/CD Setup**
   - Create GitHub Actions workflow for automated builds
   - Add linting and type checking to CI
   - Configure automatic deployment to Vercel/Netlify
   - Set up preview deployments for PRs

4. **Example Site**
   - Deploy demo site with example REST and Kafka APIs
   - Create landing page explaining multi-protocol support
   - Add "Fork this" or "Use this template" instructions

5. **Final Polish**
   - Add loading states and error boundaries
   - Improve accessibility (ARIA labels, keyboard navigation)
   - Add analytics integration (optional)
   - Create changelog

**Deliverables**:
- Production-ready codebase
- Comprehensive documentation
- Live demo site
- Easy deployment setup

---

## Key Features

### Core Features
- **Protocol-agnostic interface** - Single UI for all API types
- **Unified conceptual model** - Abstract away protocol complexity
- **Multi-protocol support** - OpenAPI 3.x (REST) and AsyncAPI 2.x/3.x (Kafka)
- **Auto-generate docs** from specification files
- **Cognitive simplicity** - Users don't need to understand protocols to navigate
- **Beautiful, responsive design** with consistent UX across protocols
- **Zero runtime dependencies** - pure static HTML/CSS/JS
- **Universal search** - Find any operation regardless of protocol
- **Adaptive code examples** - Generate examples based on operation type
- **Customizable themes** and branding
- **Mixed API documentation** - REST and event-driven APIs coexist seamlessly

### Advanced Features (Future)
- **Additional protocols** - MQTT, AMQP, WebSockets, SNS/SQS, GraphQL, gRPC
- **Multi-spec support** - Compare multiple API versions
- **Changelog generation** from spec differences
- **Export to PDF** or offline HTML
- **Interactive examples** - Live request builder (protocol-aware)
- **Visual operation flows** - Show how operations connect

---

## Environment Variables

### Optional
```
NEXT_PUBLIC_SITE_TITLE=       # Custom site title
NEXT_PUBLIC_SITE_DESCRIPTION= # Custom site description
NEXT_PUBLIC_GA_ID=            # Google Analytics tracking ID (optional)
```

**Note**: No API keys required. This is a pure static site generator with no runtime backend dependencies.

---

## Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Adding API Documentation
1. Place your OpenAPI specs in `src/specs/openapi/`
2. Place your AsyncAPI specs in `src/specs/asyncapi/`
3. The app will auto-detect protocol type and parse accordingly
4. View your docs at `http://localhost:3000`

### Building for Production
```bash
# Generate static site
npm run build

# Preview production build
npm run start

# Deploy to Vercel/Netlify
git push # (with CI/CD configured)
```

---

## Estimated Timeline

| Phase | Description | Time Estimate |
|-------|-------------|---------------|
| Phase 1 | Project Setup | 2-3 hours |
| Phase 2 | Multi-Protocol Parsers | 5-6 hours |
| Phase 3 | Protocol-Aware UI | 8-10 hours |
| Phase 4 | Static Site Generation | 2-3 hours |
| Phase 5 | Polish & Deployment | 3-4 hours |
| **Total** | **MVP** | **20-26 hours** |

### Milestones
- **Week 1**: Phases 1-2 complete (parsers working for both protocols)
- **Week 2**: Phase 3 complete (UI functional for REST and AsyncAPI)
- **Week 3**: Phases 4-5 complete (static export and deployment ready)

---

## Technical Decisions & Rationale

### Why Static Site Generation?
- **Performance**: Instant page loads, no server-side processing
- **Cost**: Free hosting on Vercel, Netlify, GitHub Pages
- **Reliability**: No server downtime, CDN distribution
- **Security**: No server-side vulnerabilities, API keys stay in build
- **SEO**: Pre-rendered HTML for search engine crawling

### Why Next.js over other frameworks?
- **Mature ecosystem**: Large community, extensive plugins
- **Static export built-in**: No additional tooling needed
- **Great DX**: Fast refresh, TypeScript support, clear documentation
- **Component architecture**: Perfect for protocol-specific UI patterns
- **Deployment**: One-click deploy to Vercel

### Unified Model Approach
- **Normalization layer**: Convert all protocols to common conceptual model
- **Protocol agnostic UI**: Single set of components works for all protocols
- **Abstraction over adaptation**: Hide protocol differences rather than expose them
- **Cognitive load reduction**: Users learn one interface, works for everything
- **Transparent when needed**: Protocol details available but not emphasized
- **Future-proof architecture**: Easy to add new protocols to unified model

---

## Future Enhancements

### Short-term
- Additional AsyncAPI protocols (MQTT, AMQP, WebSocket, SNS/SQS)
- Import from URL (fetch remote specs)
- Version comparison (diff between API versions)
- Export to Markdown/PDF
- Support for Postman collections

### Long-term
- Mock server generation from specs
- Automated test generation (REST tests, Kafka consumer/producer tests)
- SDK code generation
- GraphQL support alongside REST and AsyncAPI
- Analytics dashboard (endpoint/channel popularity tracking)
- Spec validation and linting tools

---

## Success Metrics

### MVP Success Criteria
- [ ] Can parse and display any valid OpenAPI 3.x spec
- [ ] Can parse and display any valid AsyncAPI 2.x/3.x spec (Kafka focus)
- [ ] **All operations displayed with identical UI regardless of protocol**
- [ ] Users can navigate without understanding protocol differences
- [ ] Generates deployable static site for mixed protocols
- [ ] Mobile-responsive and accessible
- [ ] Sub-3s initial page load
- [ ] Unified search works seamlessly across all protocols

### User Success Criteria
- [ ] Users can add their specs in < 5 minutes
- [ ] Site deploys to production in < 2 minutes
- [ ] Zero configuration needed for basic use
- [ ] **Users don't need to learn protocol-specific concepts to use the platform**
- [ ] Easy to document mixed REST + event-driven architectures
- [ ] REST and AsyncAPI operations appear side-by-side without friction

---

## Risk Mitigation

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAPI spec variations | High | Use battle-tested parser (swagger-parser), add validation |
| AsyncAPI spec variations | High | Use official @asyncapi/parser, focus on Kafka initially |
| Build time for large specs | Medium | Implement pagination, lazy loading, optimize build |
| Unified model loses protocol nuances | High | Include protocol metadata, allow drill-down for advanced users |
| Normalization complexity | Medium | Start simple, iterate on unified model design |
| Browser compatibility | Low | Use Next.js which handles transpilation |

### Project Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | High | Focus on MVP (REST + Kafka only), document future protocols |
| Over-engineering | Medium | Use proven patterns, avoid premature optimization |
| Over-abstraction hurts UX | High | User testing early, validate unified model with real users |
| Terminology confusion | Medium | Clear glossary, tooltips, consistent naming |

---

## Resources & References

### Documentation
- [OpenAPI Specification](https://swagger.io/specification/)
- [AsyncAPI Specification](https://www.asyncapi.com/docs/reference/specification/latest)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [AsyncAPI Parser](https://github.com/asyncapi/parser-js)

### Inspiration
- [Stripe API Docs](https://stripe.com/docs/api) - REST API docs
- [Redoc](https://redocly.com/redoc) - OpenAPI documentation
- [AsyncAPI Studio](https://studio.asyncapi.com/) - AsyncAPI visualization
- [Confluent Docs](https://docs.confluent.io/) - Kafka documentation

### Tools
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Swagger Editor](https://editor.swagger.io/)
- [AsyncAPI Studio](https://studio.asyncapi.com/)
- [AsyncAPI Generator](https://github.com/asyncapi/generator)

---

## Getting Help

If you need assistance during development:
1. Check Next.js documentation for framework questions
2. Reference OpenAPI spec documentation for REST API parsing issues
3. Reference AsyncAPI spec documentation for event-driven API parsing
4. Consult AsyncAPI Parser docs for Kafka-specific bindings
5. Use Claude Code agents and commands to help with spec completion
6. Open GitHub issues for project-specific questions

---

**Last Updated**: 2025-11-08
**Version**: 2.0.0 (Unified Protocol-Agnostic Edition)

---

## Appendix: Design Principles

### 1. Protocol Abstraction First
The platform's primary value is **hiding protocol complexity**, not showcasing it. Every design decision should prioritize the unified model over protocol-specific features.

### 2. Consistent Terminology
Never expose protocol-specific terms (endpoint, channel, request, message) in primary UI. Use universal terms (operation, input, output, parameters).

### 3. Progressive Disclosure
Protocol details available for power users, but not required for basic navigation. Think: "Works without explanation, details when needed."

### 4. Single Source of Truth
The unified model is the canonical representation. Protocol-specific data is implementation detail.

### 5. Future-Proof Architecture
Design the unified model to accommodate future protocols (GraphQL, gRPC, WebRTC) without major refactoring.
