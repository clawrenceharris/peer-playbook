# Session Deletion Cache Invalidation - Debug Guide

## Changes Made

### 1. **Core Invalidation Fix**

- Updated `useDomainMutation` to use `exact: false` by default for query key matching
- This allows partial keys like `sessionKeys.paginated()` to match all variants with filters
- Added `invalidationOptions` to `DomainMutationOptions` type for flexibility

**Files changed:**

- `src/lib/queries/types.ts` - Added `InvalidationOptions` interface
- `src/lib/queries/mutations.ts` - Default to `exact: false`, added debug logging
- `src/features/sessions/hooks/use-session-mutations.ts` - Added `invalidationOptions: { exact: false }` to `useDeleteSession`

### 2. **Debug Logging**

Added console logs at three levels:

#### In `useDomainMutation` (mutations.ts)

```typescript
console.debug(
  `[useDomainMutation] Invalidating query keys:`,
  queryKeys,
  "with options:",
  invalidationOpts
);
```

This shows:

- Which query keys are being invalidated
- The `exact` flag value
- Timing of invalidation (right after mutation success)

#### In `useSessionActions` (use-session-actions.ts)

```typescript
console.debug(`[SessionActions] Initiating delete for session: ${sessionId}`);
console.debug(`[SessionActions] Confirming delete for session: ${sessionId}`);
console.debug(`[SessionActions] Delete successful:`, result);
console.error(
  `[SessionActions] Delete failed for session ${sessionId}:`,
  error
);
```

This shows:

- When delete is initiated
- When user confirms delete
- Success/failure of the mutation
- Any errors that occur

### 3. **Test Coverage**

Created comprehensive test suite in `src/features/sessions/hooks/__tests__/use-session-mutations.test.ts`

**Test scenarios:**

- ✅ Create session successfully
- ✅ Invalidation of `sessionKeys.all` on create
- ✅ Create error handling
- ✅ Update session successfully
- ✅ Invalidation of detail and list queries on update
- ✅ Update error handling
- ✅ Delete session successfully
- ✅ Invalidation with `exact: false` flag
- ✅ Partial key matching for paginated queries
- ✅ Delete error handling
- ✅ No invalidation on delete error

## How to Debug

### Step 1: Open Browser Console

1. In Chrome/Firefox DevTools, open the Console tab
2. Filter for messages starting with `[SessionActions]`, `[useDomainMutation]`, or `[QueryClient]`

### Step 2: Delete a Session

1. Navigate to Sessions page
2. Click delete on any session
3. Confirm deletion in modal
4. **Expected console output:**

```
[SessionActions] Initiating delete for session: <session-id>
[SessionActions] Confirming delete for session: <session-id>
[useDomainMutation] Invalidating query keys:
  [['sessions', 'list'], ['sessions', 'paginated'], ['sessions', 'detail', '<session-id>']]
  with options: { exact: false }
[SessionActions] Delete successful: <session-object>
```

### Step 3: Verify Cache Updates

Open React Query DevTools (if installed):

```bash
npm install @tanstack/react-query-devtools
```

Add to your app providers:

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function App() {
  return (
    <>
      <QueryProvider>{/* your app */}</QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

Then:

1. Click the React Query logo in bottom-right
2. Find queries starting with `['sessions', 'paginated']`
3. Delete a session
4. Watch the cache update in real-time
5. Sessions list should automatically refresh

## Query Key Hierarchy

### Before Fix ❌

```
['sessions'] (all)
  └─ ['sessions', 'list'] (lists)
['sessions', 'paginated'] (separate branch!)
  └─ ['sessions', 'paginated', { page: 0, limit: 12, filters: {...} }]
```

**Problem:** Deleting invalidated `all` and `lists`, but NOT the separate `paginated` branch

### After Fix ✅

```
['sessions'] (all)
['sessions', 'list'] (lists)
['sessions', 'paginated'] (shared parent)
  └─ ['sessions', 'paginated', { page: 0, limit: 12, filters: {...} }]
  └─ ['sessions', 'paginated', { page: 1, limit: 12, filters: {...} }]
```

**Solution:** Using `exact: false` means:

- `sessionKeys.paginated()` → matches all paginated queries
- `sessionKeys.lists()` → matches all list queries
- All variants refetch after delete ✅

## Testing

### Run Unit Tests

```bash
npm run test -- use-session-mutations.test.ts
```

Expected output:

```
✓ useSessionMutations
  ✓ useCreateSession
    ✓ should create a session successfully
    ✓ should invalidate all session queries on successful create
    ✓ should handle create errors
  ✓ useUpdateSession
    ✓ should update a session successfully
    ✓ should invalidate detail and list queries on successful update
    ✓ should handle update errors
  ✓ useDeleteSession
    ✓ should delete a session successfully
    ✓ should invalidate all relevant queries on successful delete with exact: false
    ✓ should match paginated queries with partial keys when exact: false
    ✓ should handle delete errors
    ✓ should not invalidate queries on delete error
```

### Manual Testing Checklist

- [ ] Delete a session from list → page refreshes automatically
- [ ] Delete a session on page 2 → list refetches and shows correct data
- [ ] Apply filters → delete session → filters still applied, list updates
- [ ] Search for sessions → delete a result → search results update
- [ ] Check console for `[useDomainMutation] Invalidating...` messages
- [ ] No console errors after delete
- [ ] Modal closes after successful delete

## Common Issues & Solutions

### Issue: Deletion works but list doesn't update

**Cause:** Query key mismatch
**Solution:** Verify `exact: false` is in `invalidationOptions`

```typescript
invalidationOptions: { exact: false }, // ✅ Required
```

### Issue: Console shows "Invalidating query keys" but nothing happens

**Cause:** Cache keys don't match because of filter differences
**Solution:** Use React Query DevTools to inspect exact key structures:

```typescript
// Expected: ['sessions', 'paginated', { page: 0, limit: 12, filters: {...} }]
// If actual keys differ, update sessionKeys.paginatedList()
```

### Issue: Tests fail with "invalidateQueries not called"

**Cause:** Mock service not set up correctly
**Solution:** Ensure mock returns a Promise and resolves before assertions

```typescript
mockSessionService.delete.mockResolvedValue(mockSession); // ✅ Use mockResolvedValue
// NOT: mockSessionService.delete.mockReturnValue(mockSession);
```

## Performance Considerations

The `exact: false` option can cause more queries to invalidate than strictly necessary, but:

- ✅ Ensures UI consistency
- ✅ Prevents stale data being displayed
- ✅ Minor performance impact (typical sessions page has 1-3 cached variants)

If performance becomes an issue, consider:

1. Use specific filter keys instead of `sessionKeys.paginated()`
2. Implement optimistic updates (remove item from cache before mutation)
3. Cache invalidation by status only (active/completed)

## Next Steps

1. **Run tests:**

   ```bash
   npm run test -- use-session-mutations.test.ts
   ```

2. **Manual test in browser:**

   - Open DevTools Console
   - Delete a session
   - Verify console logs appear
   - Verify list updates automatically

3. **If still not working:**
   - Check React Query DevTools cache state
   - Verify `sessionService.delete()` is returning data
   - Check for network errors in Network tab
   - Ensure no error is thrown that prevents invalidation

## Rollback Plan

If `exact: false` causes issues:

1. Revert `invalidationOptions` in `use-session-mutations.ts`
2. Explicitly list all paginated query variants:
   ```typescript
   invalidateFn: (_, { sessionId }) => [
     ...sessionKeys.all,
     ...sessionKeys.lists(),
     // Manually list known pagination combinations
     ...sessionKeys.paginatedList(0, 12),
     ...sessionKeys.paginatedList(1, 12),
   ];
   ```
3. This is less flexible but more explicit
