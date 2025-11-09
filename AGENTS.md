# API Docs Platform - Agent Guidelines

## 🚨 CRITICAL: Read CLAUDE.md First!

**ALL workflow rules, documentation requirements, and detailed guidelines are in [CLAUDE.md](./CLAUDE.md)**

**CLAUDE.md is the SOURCE OF TRUTH for:**
- ✅ **Mandatory documentation workflow** (STATUS.md updates BEFORE/DURING/AFTER tasks)
- ✅ **Dev server management** (port cleanup, testing requirements)
- ✅ **UI testing procedures** (Playwright MCP usage)
- ✅ **Complete project architecture** and file organization
- ✅ **Testing strategy** and verification procedures
- ✅ **All commands** and reference documentation

## Quick Reference (CLAUDE.md has full details)

### Essential Commands
```bash
# Dev Workflow (ALWAYS cleanup first!)
lsof -ti:3000 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
npm run dev

# Build & Test
npm run build
npm run lint
npm run test

# Cleanup Test Artifacts (after test runs)
rm -rf test-results/ playwright-report/
```

### Code Style Summary
- **Imports**: `@/*` path aliases, external libs first
- **Components**: Default exports, TypeScript interfaces above component
- **Types**: Strict TypeScript, prefer interfaces over types
- **Naming**: PascalCase components, camelCase functions/variables
- **Error Handling**: try-catch with proper typing, avoid any
- **UI**: Tailwind CSS only, shadcn/ui components, semantic HTML
- **Protocol Abstraction**: Never expose REST/AsyncAPI terms in primary UI

### Architecture Summary
- **Unified Model**: `lib/normalization/unified-model.ts` (source of truth)
- **Protocol-specific**: `lib/parsers/` (parsing), `components/unified/` (UI)
- **Documentation**: `.claude/` directory (STATUS.md, HISTORY.md, PLAN.md)

---

**📖 ALWAYS read [CLAUDE.md](./CLAUDE.md) for complete guidelines before starting any work!**