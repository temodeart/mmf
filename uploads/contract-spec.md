# DA ↔ CL Bundle Contract — MMF v1.0

Shared truth between **DA** (Claude Design, exporter) and **CL** (Cowork Figma builder, consumer)
for the **Money Market Fund (MMF / Мони Маркет Фанд ХХК)** project.
Both sides receive this document verbatim. CL validates every bundle against it before any build;
on violation CL **aborts with the exact error below** — it never guesses or repairs a bundle.

> MMF is a **separate project** from CarMax/Midas. It has its own contract, its own token
> namespace (`--mmf-*`), its own themes (`mmf`, `mmf-dark`), and its own build state. Never
> merge an MMF bundle with a CarMax bundle or share node-maps between them.

## 1. Bundle structure

A bundle is any folder whose root contains `manifest.json`. Recommended location:
`<project>/exports/` (overwritten each export; history lives in version numbers + build state).

```
<bundle-root>/
  manifest.json        REQUIRED
  changes.json         REQUIRED from the 2nd export on (first export: "changes": [])
  tokens.css           REQUIRED — always the COMPLETE token set, never a diff
  components.json      REQUIRED — component manifest (see §2.3)
  screens/
    <ScreenId>.jsx     one file per screen; ScreenId = basename, [A-Za-z0-9_-]+ only
    <flow>.css         shared flow CSS; every css file must be referenced by ≥1 screen
  assets/              OPTIONAL — only assets actually used by the screens (logo SVGs, etc.)
```

Rules:
- Screen identity = JSX basename without extension. Renaming a file = delete + add, declare both in changes.json.
- No screen source outside `screens/`. No file in `screens/` that the manifest doesn't list.
- Everything a screen needs (JSX, CSS, tokens, assets) is inside the bundle — CL never reads outside it during a build.
- MMF source files in the repo (screens.jsx, colors_and_type.css, flow files) are split into
  one self-contained JSX per screen for the bundle. The DA exporter does that splitting; CL
  consumes only the per-screen files.

## 2. manifest.json

```json
{
  "contract_version": "1.0",
  "project": "mmf",
  "bundle_version": 4,
  "exported_at": "2026-06-14T14:00:00Z",
  "tokens_version": "r4",
  "components_version": "r2",
  "screens": {
    "Home": {
      "file": "screens/Home.jsx",
      "css": ["screens/app.css"],
      "hash": "r4",
      "modified": "2026-06-14T13:58:00Z",
      "theme": "mmf"
    }
  }
}
```

- `project`: must equal `"mmf"`. Guards against a CarMax bundle being built by the MMF skill (and vice-versa).
- `theme` (optional, per screen): `"mmf"` | `"mmf-dark"`; absent = `"mmf"`.
  `mmf` = the white-first light surface (default). `mmf-dark` = the dark-mode surface added in
  Update Round 1 / P14 — different tokens (`[data-theme="dark"]` set), same layout. Light and dark
  of the same screen are SEPARATE screen entries (different ScreenId), never one entry with two
  renders. Additive field — no contract version bump. CL routes styling (tokens, surfaces, hero
  treatment) by it.
- `contract_version`: must equal this document's version ("1.0").
- `bundle_version`: integer, strictly +1 per export.
- `tokens_version` / `components_version` / per-screen `hash`: DA's best-effort revision marker.
  A content hash is ideal; a revision string ("r4") or ISO timestamp is acceptable. The ONLY
  requirement: **the marker changes if and only if the file content changed.**
- **CL does not trust DA's markers for diffing.** CL recomputes `sha256` (first 12 hex chars) of every
  file itself and stores those in build state. DA markers are advisory; a marker that changed while
  content didn't (or vice versa) produces a WARNING in the pre-flight report, not an abort.

### 2.3 components.json

```json
{
  "components_version": "r2",
  "components": {
    "PillBtn":   { "variants": ["primary","ghost","destructive"], "hash": "r2", "modified": "…" },
    "BackBar":   { "variants": [], "hash": "r1", "modified": "…" },
    "Badge":     { "variants": ["neutral","warning","success","onsale"], "hash": "r1", "modified": "…" },
    "PinDots":   { "variants": ["4","6"], "hash": "r2", "modified": "…" }
  }
}
```

One entry per MMF component set (the shared atoms exported to `window` in screens.jsx: `Frame`,
`PillBtn`, `BackBar`, `SignupStepHeader`, `LogoMark`, `Dot`, `Badge`, `DanLogo`, `PinDots`, plus
any new sets like the transaction-PIN sheet or notification row). `variants` may be empty; names
must be stable across exports.

## 3. changes.json

```json
{
  "from_version": 3,
  "to_version": 4,
  "changes": [
    { "type": "token",     "target": "--mmf-indigo-500", "old": "#4F46E5", "new": "#4338CA" },
    { "type": "content",   "screen": "Home", "target": "hero title", "old": "Сайн уу", "new": "Тавтай морил" },
    { "type": "layout",    "screen": "Home", "note": "added Education carousel section at bottom" },
    { "type": "component", "component": "PinDots", "note": "6-dot → 4-dot transaction PIN", "affected_screens": ["CreatePin","TxnPin","SellConfirm"] }
  ]
}
```

Change types, ordered by cost (CL routes work by this classification):

| type | meaning | CL action | cost |
|---|---|---|---|
| `token` | token VALUE changed, nothing structural | update the Figma variable/style/fill once via node-map; no screen rebuild | cheapest |
| `content` | copy/text only, same structure | set `characters` on the mapped text node(s) | cheap |
| `layout` | structure changed within one screen | rebuild that one screen frame | medium |
| `component` | a component set's structure changed | planner handles: update kit/library, then verify every screen in `affected_screens` | expensive |

Rules:
- `to_version` must equal manifest `bundle_version`; `from_version` = previous bundle_version.
- Every `screen` / `affected_screens` entry must exist in the manifest (or be declared deleted).
- A screen whose recomputed hash changed but that appears in NO change entry → pre-flight ERROR
  (undeclared change). DA must classify everything.
- When unsure between two types, DA must pick the **more expensive** one (e.g. content vs layout → layout).
  Misclassifying down corrupts screens silently; misclassifying up only costs tokens.
- MMF copy is Mongolian Cyrillic, Та-form, no emoji, no exclamation marks. A `content` change that
  introduces an exclamation mark or a non-Cyrillic UI string is still a valid bundle (CL builds it)
  but the pre-flight emits **W4** so the planner can flag it back to DA.

## 4. Validation rules (CL pre-flight)

Run before ANY Figma work. On the first failure, abort with the exact code+message; build nothing.

- **E1** `manifest.json missing or unparseable at <path>` — not a bundle.
- **E2** `contract_version <x> ≠ 1.0` — regenerate export or update both sides of the contract.
- **E3** `required file missing: <tokens.css|components.json|changes.json>` (changes.json exempt on first-ever export).
- **E4** `screen <id> listed in manifest but screens/<id>.jsx missing` (and reverse: file present but unlisted).
- **E5** `bundle_version <n> not > last built version <m>` — stale or duplicate export.
- **E6** `changes.json to_version <x> ≠ manifest bundle_version <y>`.
- **E7** `change entry references unknown screen/component <id>`.
- **E8** `undeclared change: screen <id> content hash changed but no change entry covers it`.
- **E9** `unknown change type <t>` — only token|content|layout|component allowed.
- **E10** `project <x> ≠ mmf` — wrong project bundle handed to the MMF builder.
- **E11** `unknown theme <t> on screen <id>` — only mmf|mmf-dark allowed.
- **W1** (warning, not abort) DA revision marker inconsistent with recomputed hash for `<file>`.
- **W2** (warning, not abort) change entry declared for `<screen>` whose content is unchanged — entry is skipped.
- **W3** (warning, not abort) OS junk files (`.DS_Store`, Finder `* 2.*` / `* 2/` duplicates) are ignored, never hashed, and exempt from E4.
- **W4** (warning, not abort) MMF copy-rule smell: a changed/added UI string contains an emoji or `!`
  exclamation, or non-Cyrillic letters where Cyrillic is expected. Built anyway; flagged for DA.

Reference implementation: `preflight.py` in the skill folder — deterministic, exit 1 on any E-code.

Abort = report the code, the offending path/field, and the sentence "Bundle violates contract — re-export from DA." Nothing else. No partial builds, no silent fixes.

## 5. DA instructions — paste into the MMF Claude Design project instructions

> **Export contract (always follow):** Every export bundle must match `contract-spec.md` MMF v1.0
> exactly: root contains `manifest.json` (with `"project": "mmf"`), `changes.json`, complete
> `tokens.css`, `components.json`, and a `screens/` folder with one self-contained JSX per screen
> plus referenced CSS. Increment `bundle_version` by exactly 1 per export. Update per-screen revision
> markers ONLY for files whose content changed. In `changes.json`, declare EVERY change since the
> previous export, classified as `token` (value only), `content` (copy only), `layout` (structure
> within a screen), or `component` (component-set structure, list `affected_screens`). If unsure
> between two types, choose the more expensive one. Never ship a change without a changes.json entry —
> the builder hard-fails on undeclared diffs. Keep screen file names stable; rename = delete + add.
> Generate changes.json by comparing against the current contents of exports/ — never from
> conversation memory. Only ever write to exports/: the consumer's own files (mmf-figma-builder/,
> .claude/, .build-state/) are its memory and must never be touched or included in anything you
> produce. Set `"theme"` on every manifest screen entry: `"mmf"` (light, default, may omit) or
> `"mmf-dark"` (dark mode). Light and dark of the same screen are SEPARATE entries with distinct
> ScreenIds (suffix `_Dark` for the dark variant). tokens.css stays one complete merged file (light
> `:root` + dark `[data-theme="dark"]`, all under the `--mmf-*` namespace). All screens self-contained
> JSX. MMF copy rules: Mongolian Cyrillic only, Та-form, no emoji, no exclamation marks, ₮ with a
> space, tabular-nums on figures, only spacing-scale values (4/8/12/16/24/32/48), 24px mobile margins.
