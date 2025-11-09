# Claude Code Guidelines for API Docs Platform

## Critical Workflow Rules

### 0. Documentation Synchronization
**CRITICAL: Update STATUS.md BEFORE, DURING, and AFTER tasks. NEVER wait until the end!**

**BEFORE Starting a Task:**
1. **Immediately update STATUS.md "🎯 RIGHT NOW" section:**
   - Set "Working On" to the new task description
   - Set "Status" to ⚠️ IN PROGRESS
   - Document "Current Request" with exact user quote
   - List planned subtasks if complex (use TodoWrite tool)
2. This ensures if session dies, there's a record of what was being attempted

**DURING Task Execution:**
1. **Keep STATUS.md updated as you progress:**
   - Mark subtasks complete as you finish them
   - Update "Completed" list with finished items
   - Add any blockers or issues discovered
2. **Use TodoWrite tool to track progress for complex tasks**
3. This ensures if session dies mid-task, progress is not lost

**AFTER Task Completion:**
1. **Update STATUS.md:**
   - Set "Status" to ✅ COMPLETE
   - Update "Last Completed" with timestamp (YYYY-MM-DD HH:MM)
   - Move completed feature to "✅ WHAT WORKS" section
   - Update "🧪 TEST STATUS" if tests were added/modified
2. **Update HISTORY.md (append-only, never edit old entries):**
   - Add new session entry with timestamp (YYYY-MM-DD HH:MM format)
   - Include: Customer request (exact quote), status, files modified, duration
   - Record testing results and verification outcomes
   - Update "📊 Key Learnings" if you discovered new patterns or made technical decisions

**STATUS.md is the SOURCE OF TRUTH for current state.**
**Never work without first documenting what you're doing in STATUS.md!**

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
- [STATUS.md](.claude/STATUS.md) - Current project status (SOURCE OF TRUTH)
- [HISTORY.md](.claude/HISTORY.md) - Development session log and learnings
- [PLAN.md](.claude/PLAN.md) - Technical architecture and philosophy
- [USER_INTERACTIONS.md](.claude/USER_INTERACTIONS.md) - UX patterns and workflows
