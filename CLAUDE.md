# Claude Code Guidelines for API Docs Platform

## Critical Workflow Rules

### 0. Documentation Synchronization
**ALWAYS update both `.claude/WIP.md` and `.claude/ITERATIONS.md` after completing ANY task:**

**WIP.md Updates:**
- Update task status (✅ COMPLETE / ❌ NOT STARTED / ⚠️ IN PROGRESS)
- Update "Last Updated" date to current session date
- Update "Current Phase" and "Next Phase" sections
- Document testing results and verification steps
- Add any new discoveries, blockers, or technical decisions
- Keep "Session Status" section accurate

**ITERATIONS.md Updates:**
- Add new iteration entry with current date (YYYY-MM-DD format)
- Document session focus and achievements
- List all files modified during session
- Record testing results and verification outcomes
- Note next steps for following session
- Document any issues or blockers encountered

**WIP.md is the SOURCE OF TRUTH** - keep both files synchronized with actual progress.

### 1. Dev Server Management
**ALWAYS clean up existing dev servers before starting a new one:**
```bash
# Check for running processes
lsof -ti:3000 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
# Then start dev server
npm run dev
```
This ensures port 3000 is always available (default port).

### 2. Frontend Changes Verification
**ALWAYS test UI changes with Playwright MCP after making frontend modifications:**
- After creating/editing components: Use `mcp__playwright__navigate` + `mcp__playwright__screenshot`
- Verify visual appearance with screenshots
- Test interactions if applicable

Example workflow:
```
1. Edit component
2. Start dev server (after cleanup)
3. Navigate to page: mcp__playwright__navigate(url: "http://localhost:3000")
4. Screenshot: mcp__playwright__screenshot(name: "test-page")
5. Verify output
```

## Project Architecture

### Unified Model Philosophy
- **Never** expose protocol-specific terms in primary UI
- **Always** use universal terminology: Operation, Input, Output, Parameters
- **Preserve** protocol metadata for power users (in metadata field)

### File Organization
- `lib/normalization/` - Core abstraction layer (protocol → unified model)
- `lib/parsers/` - OpenAPI & AsyncAPI parsing
- `lib/loaders/` - Spec loading pipeline
- `components/unified/` - Protocol-agnostic UI components
- `components/protocol-specific/` - Internal adapters (hidden from users)

### Key Abstractions
| Universal Term | REST | AsyncAPI |
|----------------|------|----------|
| Operation | Endpoint | Channel Operation |
| ActionType | GET/POST/PUT | PUBLISH/SUBSCRIBE |
| location | URL path | Channel name |
| input | Request body | Published message |
| output | Response | Subscribed message |

## Testing Strategy
- Manual: Use main page at `/` to verify parsing
- UI: Use Playwright MCP for all frontend changes
- Phase 2: All parsers/normalizers tested with example specs

## Common Commands
```bash
# Dev
npm run dev              # After cleanup!
npm run build
npm run lint

# Cleanup ports
lsof -ti:3000 -sTCP:LISTEN | xargs kill -9 2>/dev/null || true
```

## Reference Docs
- [PLAN.md](.claude/PLAN.md) - Full technical plan
- [USER_INTERACTIONS.md](.claude/USER_INTERACTIONS.md) - UX patterns
- [WIP.md](.claude/WIP.md) - Current progress (SOURCE OF TRUTH)
