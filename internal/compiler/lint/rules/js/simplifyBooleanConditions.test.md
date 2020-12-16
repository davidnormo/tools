# `harness.test.ts`

**DO NOT MODIFY**. This file has been autogenerated. Run `rome test internal/compiler/lint/rules/harness.test.ts --update-snapshots` to update.

## `js/simplifyBooleanConditions`

### `0`

```

 lint/js/simplifyBooleanConditions/reject/1/filename.ts:1 lint/js/simplifyBooleanConditions  FIXABLE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  ✖ INSERT MESSAGE HERE

    a || 0n || false || 0 || '' || null || undefined || NaN || -0
    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  ℹ Safe fix

  - a·||·0n·||·false·||·0·||·""·||·null·||·undefined·||·NaN·||·-0
  + a

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✖ Found 1 problem

```

### `0: formatted`

```
a;

```

### `1`

```
✔ No known problems!

```

### `1: formatted`

```
// insert valid examples here

```