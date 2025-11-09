# Development History

**Purpose**: Track development sessions, learnings, and technical decisions.

**Session Format**: YYYY-MM-DD HH:MM - Session Title (approximate time, 24-hour format)

---

## 📊 Key Learnings

### Common Issues
- **AsyncAPI Parser Complexity**: AsyncAPI parser uses complex OOP API - need to access internal `_json` property instead of calling methods
- **AsyncAPI Parser Pollution**: Parser adds `x-parser-*` metadata fields to all schemas - must strip these before showing to users
- **Playwright Strict Mode**: Generic selectors like `getByText('orderId')` match multiple elements - must use specific CSS class-based selectors
- **Port Conflicts**: Dev server fails if port 3000 is already in use - always run cleanup before starting
- **Example Data Extraction**: AsyncAPI parser returns payload data directly from `payload()` method, not wrapped in `_json`
- **Function Serialization**: Next.js cannot serialize functions passed to client components - must call functions to get values, not pass function references

### Best Practices Discovered
- **Port Cleanup**: Always run `lsof -ti:3000 -sTCP:LISTEN | xargs kill -9` before `npm run dev`
- **Selector Specificity**: Use `locator().filter({ hasText: 'text' })` instead of `getByText()` for more control
- **Test Immediately**: Add E2E tests right after implementing features to catch regressions early
- **Specific Targeting**: Use CSS class selectors like `locator('div.inline-flex.items-center')` for precise element targeting
- **Documentation First**: Update STATUS.md BEFORE starting work, DURING progress, and AFTER completion - never wait until the end

### Technical Decisions

#### 2025-11-09: Documentation Workflow Improvement
**Context**: Previously updated documentation only AFTER completing tasks
**Decision**: Update STATUS.md BEFORE, DURING, and AFTER tasks
**Rationale**: If session dies mid-task, need record of what was being worked on and progress made
**Outcome**: ✅ Updated CLAUDE.md Rule #0 with 3-phase documentation workflow

#### 2025-11-09: Migrated to highlight.js
**Context**: Prism.js was previously used for syntax highlighting
**Decision**: Switch to highlight.js with github-dark (dark mode) and github (light mode) themes
**Rationale**: Smaller bundle size, better performance, similar features
**Outcome**: ✅ Successful migration, reduced bundle size

#### 2025-11-08: Unified Model Abstraction
**Context**: Need to support both OpenAPI and AsyncAPI
**Decision**: Create normalization layer that converts both protocols to unified model
**Rationale**: Better UX (users don't need protocol knowledge), easier to add new protocols
**Outcome**: ✅ Successful, enables protocol-agnostic UI

#### 2025-11-09: AsyncAPI _json Property Access
**Context**: AsyncAPI parser methods don't serialize for client components
**Decision**: Access internal `_json` property directly instead of calling methods
**Rationale**: Allows serialization while preserving data structure
**Outcome**: ✅ Resolved server component serialization issues

---

## 📅 Session Log (Most Recent First)

### 2025-11-09 18:45 - AsyncAPI Schema Parser Pollution Fix
**Session Focus**: Remove AsyncAPI parser metadata from original schema display
**Customer Request**: "analyze the original schema of the async example and see if you something weird"
**Status**: ✅ COMPLETE

**Issue Found**:
- AsyncAPI parser adds `x-parser-schema-id` fields to every property in the schema
- These fields are internal parser metadata, not part of the actual schema
- Users copying the "Original Schema" would get polluted, unusable schemas

**Example of Pollution**:
```json
{
  "orderId": {
    "type": "string",
    "x-parser-schema-id": "<anonymous-schema-2>"  // ❌ Parser pollution
  }
}
```

**Fix**:
- Created `cleanParserMetadata()` function to recursively remove all `x-parser-*` fields
- Applied cleaning to original schema before storing in unified model
- Preserves clean, copy-paste ready schemas

**Files Modified**:
- `lib/normalization/asyncapi-normalizer.ts` (added cleanParserMetadata function and applied to originalSchema)

**Results**:
- ✅ Original schemas now match the actual YAML spec files
- ✅ Users can copy/paste clean, usable schemas
- ✅ No more parser metadata pollution

**Duration**: 15 minutes

---

### 2025-11-09 18:00 - Tabbed Schema Display Feature
**Session Focus**: Add tabbed interface for viewing schemas (visual vs original format)
**Customer Request**: "Add tabbed interface to Input/Output schema sections - users can switch between visual schema display and original schema format (JSON/Avro) for easy copy/paste"
**Status**: ✅ COMPLETE

**Achievements**:
- ✅ Created SchemaDisplay.tsx component with tab switching functionality
- ✅ Added "Schema" tab showing visual DataSchema component (existing)
- ✅ Added "Original Schema" tab showing raw JSON with syntax highlighting
- ✅ Implemented copy-to-clipboard with visual feedback ("Copied!")
- ✅ Updated unified-model.ts with originalSchema, schemaFormat, metadata fields
- ✅ Updated openapi-normalizer.ts to preserve original OpenAPI schema
- ✅ Updated asyncapi-normalizer.ts to preserve original AsyncAPI schema and detect Avro format
- ✅ Browser verification complete - all features working correctly

**Files Created**:
- `components/unified/SchemaDisplay.tsx` (new - tabbed schema display component)

**Files Modified**:
- `lib/normalization/unified-model.ts` (added originalSchema, schemaFormat, metadata fields to UnifiedDataSchema)
- `lib/normalization/openapi-normalizer.ts` (preserve original schema in normalizeSchema function)
- `lib/normalization/asyncapi-normalizer.ts` (preserve original schema and detect Avro format)
- `components/unified/OperationDetail.tsx` (replaced direct DataSchema usage with SchemaDisplay component)
- `.claude/STATUS.md` (updated with new feature)

**Technical Details**:
- Tab state management using React useState
- Syntax highlighting with highlight.js (JSON language)
- Theme-aware highlighting (switches with light/dark mode)
- Schema format detection (JSON Schema vs Avro)
- Copy button with 2-second feedback timeout

**Testing**:
- ✅ Manual browser testing completed
- ✅ Tab switching works bidirectionally (Schema ↔ Original Schema)
- ✅ Copy button shows "Copied!" feedback
- ✅ Syntax highlighting applies correctly
- ✅ Works for both Input and Output schemas

**Results**:
- Users can now view and copy original schema format (JSON/Avro)
- Maintains existing visual schema display
- Foundation ready for Avro schema support (once AsyncAPI parser configured)
- Improved developer experience for API consumers

**Duration**: 60 minutes

**Next Steps**:
- Consider adding E2E tests for schema tabs (optional)
- Add Avro schema parser support if needed (requires AsyncAPI parser configuration)

---

### 2025-11-09 18:15 - Documentation Restructuring
**Session Focus**: Simplify .claude/ documentation structure
**Customer Request**: "Simplify the .claude/ documentation structure - too many markdown files with redundancy"
**Status**: ✅ COMPLETE

**Achievements**:
- ✅ Created STATUS.md (114 lines - replaces WIP.md which was 951 lines)
- ✅ Created HISTORY.md (208 lines - replaces ITERATIONS.md with added learnings section)
- ✅ Condensed PLAN.md from 591 to 149 lines (kept only essential architecture)
- ✅ Updated CLAUDE.md with new documentation workflow rules
- ✅ Deleted old WIP.md and ITERATIONS.md files
- ✅ Verified all documentation references point to new files

**Files Created**:
- `.claude/STATUS.md` (new - current state tracking)
- `.claude/HISTORY.md` (new - session log with learnings)

**Files Modified**:
- `.claude/PLAN.md` (condensed from 591 → 149 lines)
- `CLAUDE.md` (updated Rule #0 and reference docs)

**Files Deleted**:
- `.claude/WIP.md` (replaced by STATUS.md)
- `.claude/ITERATIONS.md` (replaced by HISTORY.md)

**Final Structure**:
```
.claude/
├── STATUS.md (114 lines) - Current state snapshot
├── HISTORY.md (208 lines) - Session log + learnings
├── PLAN.md (149 lines) - Technical architecture
├── CLAUDE.md (updated) - AI workflow rules
├── USER_INTERACTIONS.md (unchanged) - UX reference
└── settings.local.json (unchanged) - Configuration
```

**Results**:
- Reduced from 6 docs to 4 active docs
- Clear separation: STATUS (current) → HISTORY (past) → PLAN (blueprint)
- Eliminated redundancy between files
- Faster AI resume time (smaller, focused files)
- Documentation now under 500 total lines (excluding USER_INTERACTIONS)

**Duration**: 30 minutes

**Next Steps**:
- Ready for next customer request (likely SEO Optimization or other Phase 4 tasks)

---

### 2025-11-09 - AsyncAPI Test Pipeline Fix (Session 2)
**Session Focus**: Fix failing AsyncAPI tests due to strict mode violations

**Achievements**:
- ✅ Fixed all 7 failing AsyncAPI tests (16/16 now passing)
- ✅ Resolved strict mode violations by replacing generic selectors with specific CSS class-based selectors
- ✅ Updated copy button tests to use `lucide-copy` icon selector instead of `aria-label="Copy"`
- ✅ Fixed text matching conflicts between schema properties and syntax highlighted code examples
- ✅ Enhanced test selectors to target specific UI components (schema vs code examples)
- ✅ Used `.first()` and CSS class targeting to resolve multiple element matches

**Files Modified**:
- `tests/e2e/operation-async.spec.ts` - Updated 7 tests with specific selectors:
  - Fixed `getByText('send')` → `locator('div.inline-flex.items-center.rounded-full.border').filter({ hasText: 'send' })`
  - Fixed `getByText('receive')` → same pattern with 'receive'
  - Fixed `getByText('orders.updated')` → `locator('p.text-muted-foreground.font-mono').filter({ hasText: 'orders.updated' })`
  - Fixed `getByText('status')` → `locator('code.text-sm.font-semibold').filter({ hasText: 'status' })`
  - Fixed `getByText(/Example/i)` → `getByRole('heading', { name: 'Example Request' })`
  - Fixed copy button selector → `locator('button').filter({ has: page.locator('svg.lucide-copy') })`
  - Fixed example data selectors → `locator('div').filter({ hasText: 'Example Request' }).locator('pre.bg-muted').first()`

**Testing Results**:
- ✅ All 16 AsyncAPI tests now pass (was 9/16 passing, now 16/16 passing)
- ✅ No more strict mode violations in test suite
- ✅ Copy buttons properly detected and tested
- ✅ Example data correctly identified in specific sections
- ✅ Action badges (send/receive) properly targeted
- ✅ Schema properties vs code examples properly distinguished

**Next Steps**:
- Continue with Phase 4 medium priority tasks
- Consider implementing test utilities to avoid strict mode violations in future tests
- Run full test suite to ensure no regressions in other test files

**Issues/Blockers**:
- ❌ Strict mode violations: Generic selectors like `getByText('orderId')` matched multiple elements (schema properties + syntax highlighted code)
- ❌ Copy button detection: Tests looked for `aria-label="Copy"` but buttons used `lucide-copy` icon
- ❌ Non-specific selectors: Generic text matching needed CSS class-based targeting
- ✅ RESOLVED: All issues fixed with specific CSS class selectors and proper element targeting

---

### 2025-11-09 - AsyncAPI Array Items Fix & Testing Updates
**Session Focus**: Fix AsyncAPI array items nested properties rendering and update tests

**Achievements**:
- ✅ Enhanced AsyncAPI normalizer to recursively process array item objects
- ✅ Fixed nested properties display in array items (productId, quantity)
- ✅ Added support for nested arrays within array items
- ✅ Updated tests with specific selectors for array items functionality
- ✅ Added comprehensive test coverage for both PUBLISH and SUBSCRIBE operations
- ✅ Verified fix works correctly in UI with proper nested structure display

**Files Modified**:
- `lib/normalization/asyncapi-normalizer.ts` - Enhanced normalizePayloadProperties for recursive array processing
- `tests/e2e/operation-async.spec.ts` - Updated array items tests with specific selectors
- `.claude/WIP.md` - Updated to mark array items fix as complete
- `.claude/ITERATIONS.md` - Added new iteration entry

**Testing Results**:
- ✅ Array items tests pass for both SUBSCRIBE and PUBLISH operations
- ✅ Nested properties (productId, quantity) display correctly under "Array items:" section
- ✅ Build passes successfully with enhanced normalizer
- ✅ UI shows proper hierarchical structure: items (array) → Array items: item (object) → productId/quantity

**Next Steps**:
- Continue with Phase 4 medium priority tasks (SEO optimization, collapsible sections, homepage overview)
- Consider enhancing test suite to handle strict mode violations better

**Issues/Blockers**:
- ❌ Array items nested properties: AsyncAPI array items only showed basic type, not nested object properties
- ✅ RESOLVED: Enhanced normalizePayloadProperties to recursively process array item objects

---

### 2025-11-09 - AsyncAPI Tags Implementation & YAML Fixes
**Session Focus**: Fix AsyncAPI YAML syntax errors and implement proper tag display

**Achievements**:
- ✅ Fixed all YAML syntax errors in simple-events.yaml (duplicated keys, indentation issues)
- ✅ Standardized AsyncAPI tags format using official AsyncAPI 3.0 specification
- ✅ Verified tag extraction and display across all UI components
- ✅ Updated documentation to reflect completed AsyncAPI tags work

**Files Modified**:
- `specs/asyncapi/simple-events.yaml` - Complete rewrite with consistent YAML formatting and proper tag structure
- `lib/normalization/asyncapi-normalizer.ts` - Tag extraction logic already working correctly
- `.claude/WIP.md` - Updated to mark AsyncAPI tags as complete
- `.claude/ITERATIONS.md` - Added new iteration entry

**Testing Results**:
- ✅ Build passes successfully without YAML syntax errors
- ✅ All 4 AsyncAPI operations display tags correctly in UI
- ✅ Tag filtering works: "All", "Critical", "E-commerce", "Events", "Orders"
- ✅ Operation cards show tag truncation: "Orders", "Events", "+2" for additional tags
- ✅ Individual operation pages show full tag lists
- ✅ Dev server runs cleanly on port 3000

**Next Steps**:
- Continue with Phase 4 medium priority tasks (SEO optimization, collapsible sections, homepage overview)
- Consider implementing tag-based search enhancement

**Issues/Blockers**:
- ❌ YAML syntax errors: Multiple indentation and duplicate key issues in simple-events.yaml
- ✅ RESOLVED: Complete file rewrite with consistent formatting
- ❌ Array items nested properties: AsyncAPI array items only showed basic type, not nested object properties
- ✅ RESOLVED: Enhanced normalizePayloadProperties to recursively process array item objects

---

### 2025-11-09 - Dark/Light Mode Theme Updates & AsyncAPI Tags
**Session Focus**: Update syntax highlighting themes and add tags to AsyncAPI spec

**Achievements**:
- ✅ Updated syntax highlighting themes: "an-old-hope" (dark) + "vs" (light)
- ✅ Added comprehensive tags to AsyncAPI spec for UI testing
- ✅ Created ITERATIONS.md file for session tracking
- ✅ Updated documentation references to include ITERATIONS.md

**Files Modified**:
- `components/unified/CodeExamples.tsx` - Updated theme URLs from github-dark to an-old-hope, github to vs
- `components/unified/OperationDetail.tsx` - Updated theme URLs for JSON highlighting
- `specs/asyncapi/simple-events.yaml` - Added tags to channels and operations
- `.claude/ITERATIONS.md` - New file created
- `.claude/WIP.md` - Added reference to ITERATIONS.md
- `.claude/CLAUDE.md` - Added requirement to update both files

**Testing Results**:
- ✅ Theme switching works correctly with new color schemes
- ✅ AsyncAPI tags display properly in operation cards, sidebar, and filtering
- ✅ Build passes successfully with all changes

**Next Steps**:
- Continue with Phase 4 medium priority tasks (SEO optimization, collapsible sections, homepage overview)
- Test tag functionality across all UI components thoroughly

**Issues/Blockers**:
- None encountered

---

## 2025-11-09 19:30 - AsyncAPI Avro Schema Implementation

**Customer Request**: "Use the above summary generated from your last session to resume from where you left off."

**Duration**: ~45 minutes

**Files Modified**:
- `package.json` - Added @asyncapi/avro-schema-parser dependency
- `lib/parsers/asyncapi-parser.ts` - Registered Avro schema parser with main parser
- `lib/loaders/spec-loader.ts` - Removed fallback parsing logic (no longer needed)

**Implementation Details**:
- Installed proper AsyncAPI Avro schema parser package instead of using fallback approach
- Registered AvroSchemaParser() with main AsyncAPI parser in both parseAsyncAPISpec() and parseAsyncAPIString()
- Removed complex fallback parsing logic from spec loader
- Fixed function serialization errors that were causing Next.js build failures
- Existing Avro normalization logic worked perfectly with proper parser

**Testing Results**:
- ✅ Build successful with 13 static operation pages (9 total operations: 4 REST + 5 AsyncAPI)
- ✅ Avro operation accessible at /operations/onUserSignedUp
- ✅ Avro schema properly parsed with correct type mapping:
  - int → integer (with min/max validation)
  - long → integer (with min/max validation)  
  - string → string
  - boolean → boolean
  - map → object
  - array → array
- ✅ Field documentation preserved (Avro doc fields)
- ✅ Required fields correctly identified
- ✅ Example payload displays correctly
- ✅ UI integration seamless (operation appears in lists and detail pages)

**Key Learning**:
Using official @asyncapi/avro-schema-parser is much cleaner than implementing fallback parsing. The AsyncAPI parser architecture supports plugin-based schema parsers - register them properly instead of working around parser limitations. Existing normalization logic was already robust enough to handle Avro schemas once the parser could understand them.

---

**END OF HISTORY**
