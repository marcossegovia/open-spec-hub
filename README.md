# Open Spec Hub

> A unified documentation platform for all your API specifications - REST, Events, and beyond.

## 🚀 Live Demo

**https://marcossegovia.me/open-spec-hub**

See it in action with our example page featuring both REST APIs and AsyncAPI event streams.

## ✨ What is this?

Open Spec Hub is a **protocol-agnostic documentation platform** that lets you browse and understand all your API contracts through a single, intuitive interface. Whether you're working with REST APIs, event-driven architectures, or both - we handle the complexity so you don't have to.

### 🎯 The Problem We Solve

Your team probably uses multiple API protocols:
- **REST APIs** for traditional request/response operations
- **AsyncAPI** for event-driven architectures  
- **GraphQL** for flexible data queries
- **gRPC** for high-performance services

Each has its own documentation format, tools, and terminology. **Open Spec Hub unifies them all.**

## 🏗️ How It Works

### Protocol Abstraction
We translate different API protocols into a common conceptual model:

| Universal Concept | REST (OpenAPI) | AsyncAPI | What You See |
|-------------------|----------------|----------|--------------|
| **Operation** | HTTP Endpoint | Channel Operation | Just "Operation" |
| **Action** | GET, POST, PUT | Publish, Subscribe | Clear action badges |
| **Location** | `/api/users` | `user.events` | Simple location path |
| **Data In** | Request Body | Published Message | "Input Schema" |
| **Data Out** | Response Body | Subscribed Message | "Output Schema" |

### Key Features
- 🔍 **Unified Search** - Find anything across all your APIs
- 📱 **Responsive Design** - Works on desktop and mobile
- 🌙 **Dark Mode** - Built-in theme switching
- 📋 **Code Examples** - Auto-generated samples in multiple languages
- ⚡ **Static Site Generation** - Fast loading and SEO-friendly
- 🧪 **Comprehensive Testing** - 82 E2E tests ensure reliability

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/marcossegovia/open-spec-hub.git
cd open-spec-hub

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your API documentation hub.

### Adding Your Own APIs

1. **Place your spec files** in the `specs/` directory:
   ```
   specs/
   ├── openapi/
   │   └── your-api.yaml
   └── asyncapi/
       └── your-events.yaml
   ```

2. **Restart the dev server** - your APIs will automatically appear!

3. **Build for production**:
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
open-spec-hub/
├── app/                    # Next.js app router
├── components/
│   ├── ui/                # Reusable UI components (shadcn/ui)
│   └── unified/           # Protocol-agnostic components
├── lib/
│   ├── parsers/           # OpenAPI & AsyncAPI parsers
│   ├── normalization/     # Protocol → Unified model
│   └── utils/             # Helper functions
├── specs/                 # Your API specifications
│   ├── openapi/          # REST API specs
│   └── asyncapi/         # Event-driven specs
└── public/               # Static assets
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests in headed mode
npm run test:headed
```

Our test suite includes 82 E2E tests covering:
- Homepage functionality
- REST API operations
- AsyncAPI operations  
- Code examples
- Search and filtering

## 🎨 Customization

### Theming
The platform uses Tailwind CSS with shadcn/ui components. Customize colors, fonts, and spacing in:
- `tailwind.config.ts` - Design system configuration
- `app/globals.css` - Global styles and CSS variables

### Adding New Protocols
Want to support GraphQL, gRPC, or other protocols? The architecture is designed for extensibility:

1. **Create a parser** in `lib/parsers/`
2. **Create a normalizer** in `lib/normalization/`
3. **Update the spec detector** in `lib/parsers/spec-detector.ts`

## 📚 Example APIs Included

The repository comes with a complete e-commerce platform example:

- **REST API** (`specs/openapi/ecommerce-api.yaml`)
  - Product catalog
  - Order management
  - User authentication

- **Event Streams** (`specs/asyncapi/simple-events.yaml`)
  - User lifecycle events
  - Order status updates
  - Inventory notifications

- **Avro Schema** (`specs/asyncapi/avro-user-signup.yaml`)
  - User signup with Avro schema format

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Live Demo**: https://marcossegovia.me/open-spec-hub
- **Repository**: https://github.com/marcossegovia/open-spec-hub
- **Issues**: https://github.com/marcossegovia/open-spec-hub/issues

---

<div align="center">

**⭐ Star this repo if it helped you!**

Made with ❤️ by [Marcos Segovia](https://github.com/marcossegovia)

</div>
