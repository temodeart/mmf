The core data surface — sticky header, sortable columns, whole-row select, and all four states.

```jsx
<DataTable columns={cols} rows={rows} selected={sel} onRowClick={setSel} total={128} page={p} onPageChange={setP} />
```

Numeric columns set align:'right' + mono:true. Selection drives the OrderTicket. Pass loading / error / empty* for the non-populated states.
