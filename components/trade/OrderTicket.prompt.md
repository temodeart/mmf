The Trade right-rail: side toggle, instrument summary, quantity, live cost, and an intent-colored CTA disabled-with-reason until valid.

```jsx
<OrderTicket side={side} onSideChange={setSide} instrument={sel} qty={qty} onQtyChange={setQty} balance={bal} onSubmit={confirm} />
```

Populated by DataTable/InstrumentCard selection. CTA follows side (--pos/--neg) and blocks with a reason when empty/short.
