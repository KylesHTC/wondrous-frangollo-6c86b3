ONE COMMUNITY CLEANUP — OCC V127 — PARTNERS MY OCC BOTTOM NAV FIX

FIXED
- Restores the existing Partners five-button bottom navigation on My OCC.
- Footer remains pinned to the bottom while scrolling the My OCC menu, including Samsung Fold inner screen.
- No duplicate or additional menu introduced.
- Retains the V126 Partners Messages fixes and all other pathway screens.

The issue was caused by the common work-screen rule hiding the app footer on the Partner My OCC screen. This CSS change overrides that rule only for the Partners My OCC page.

Use as a new Netlify manual deploy; extract ZIP and upload app files with index.html at the root. Keep your existing deploy available as backup.
