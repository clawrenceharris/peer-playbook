# Strategy Architecture Implementation

This document outlines the implementation status of the new strategy architecture that separates base strategies from playbook-specific instances.

## ✅ Completed

### 1. Type System
- ✅ Created `/src/types/strategies.ts` with:
  - `BaseStrategy` interface (extends Strategies with ownership/publishing fields)
  - `PlaybookStrategyOverrides` interface
  - `MergedStrategy` type (resolved strategy with base + overrides)
  - Input types for creating/publishing strategies

### 2. Repository Layer
- ✅ Updated `StrategiesRepository` with new methods:
  - `getSystemStrategies()` - Get pre-established strategies
  - `getUserStrategies(userId)` - Get user-created strategies
  - `getPublishedStrategies()` - Get published strategies for explore page
  - `createStrategy(userId, input)` - Create user strategy
  - `publishStrategy(strategyId, isPublished)` - Publish/unpublish
  - `getByIds(ids)` - Batch fetch strategies
  - `getBySlug(slug)` - Get strategy by slug

- ✅ Created `PlaybookStrategiesRepository` (`/src/features/playbooks/data/playbook-strategies.repository.ts`):
  - `createFromBaseStrategy()` - Create playbook strategy with optional overrides
  - `getByPlaybookId()` - Get all strategies for a playbook
  - `getWithBaseStrategy()` - Get single strategy with base data
  - `updateOverrides()` - Update only override fields
  - `reorderStrategies()` - Update strategy phases

### 3. Service Layer
- ✅ Updated `StrategiesService` with new repository methods
- ✅ Created `StrategyResolverService` (`/src/features/strategies/domain/strategy-resolver.service.ts`):
  - `resolvePlaybookStrategy()` - Merge base + overrides for single strategy
  - `resolvePlaybookStrategies()` - Batch resolve with efficient querying
  - `hasOverrides()` - Check if strategy has customizations

- ✅ Updated `PlaybookService`:
  - Integrated `StrategyResolverService`
  - `getPlaybookWithStrategies()` now returns `MergedStrategy[]`
  - Uses `PlaybookStrategiesRepository` instead of copying from base repository

### 4. Hooks
- ✅ Updated `usePlaybookStrategies` to use resolved strategies

## 🔄 In Progress / Needs Attention

### 1. Database Schema Changes Needed
The following fields need to be added to the database:

**`strategies` table:**
- `created_by: string | null` - User who created the strategy (null = system)
- `is_system: boolean` - true for pre-established strategies
- `is_published: boolean` - false = private, true = visible in explore
- `published_at: timestamp | null` - When strategy was published

**`playbook_strategies` table:**
- `strategy_id: string` (FK to strategies.id) - Reference to base strategy (instead of just slug)
- `custom_title: string | null` - Override for title
- `custom_description: string | null` - Override for description
- `custom_steps: string[] | null` - Override for steps
- `instructor_notes: text | null` - Playbook-specific notes

**Current Implementation:**
- Code is written to support these fields but uses backwards-compatible fallbacks
- Currently detects overrides by comparing values (title/steps differ from base)
- Once schema is updated, override detection will use dedicated fields

### 2. Hooks Still Needed
- ⏳ `useCreateStrategy` - Create user strategies
- ⏳ `usePublishStrategy` - Publish/unpublish strategies
- ⏳ `useSystemStrategies` - Get system strategies
- ⏳ `usePublishedStrategies` - Get published strategies for explore page

### 3. API Updates Needed
- ⏳ Update `/api/lessons/generate` to use `PlaybookStrategiesRepository.createFromBaseStrategy()` instead of copying all fields

### 4. Component Updates
- ⏳ Update `StrategyCard` to accept `MergedStrategy` type
- ⏳ Update `PlaybookPage` to use resolved strategies directly
- ⏳ Remove slug-to-ID mapping logic (once strategy_id is added to schema)

## 📋 Migration Path

### Phase 1: Schema Migration (Database)
```sql
-- Add fields to strategies table
ALTER TABLE strategies 
  ADD COLUMN created_by UUID REFERENCES profiles(id),
  ADD COLUMN is_system BOOLEAN DEFAULT false,
  ADD COLUMN is_published BOOLEAN DEFAULT false,
  ADD COLUMN published_at TIMESTAMP;

-- Mark existing strategies as system
UPDATE strategies SET is_system = true WHERE created_by IS NULL;

-- Add fields to playbook_strategies table
ALTER TABLE playbook_strategies
  ADD COLUMN strategy_id UUID REFERENCES strategies(id),
  ADD COLUMN custom_title TEXT,
  ADD COLUMN custom_description TEXT,
  ADD COLUMN custom_steps TEXT[],
  ADD COLUMN instructor_notes TEXT;

-- Populate strategy_id from slug lookup
UPDATE playbook_strategies ps
SET strategy_id = (
  SELECT s.id FROM strategies s WHERE s.slug = ps.slug
);

-- Move customized fields to override columns
-- (Compare current values with base strategy to detect overrides)
```

### Phase 2: Code Migration
1. Update `PlaybookStrategiesRepository` to use `strategy_id` instead of slug
2. Update override detection to use `custom_*` fields
3. Update components to use `MergedStrategy` type
4. Remove backwards compatibility fallbacks

## 🎯 Benefits Achieved

1. **Separation of Concerns**: Base strategies are templates, playbook strategies are instances
2. **Reduced Redundancy**: Only store overrides, not full copies
3. **Extensibility**: Easy to add new override fields or strategy types
4. **Update Propagation**: Can optionally propagate base strategy updates to instances
5. **Publishing Model**: Clear ownership and publishing workflow
6. **Type Safety**: Unified `MergedStrategy` type for components

## 📝 Notes

- The implementation is **backwards compatible** until schema changes are applied
- Current code uses slug-based lookups as fallback when `strategy_id` doesn't exist
- Override detection compares values (temporary) until override fields exist
- Once schema is updated, remove fallback logic for cleaner code

