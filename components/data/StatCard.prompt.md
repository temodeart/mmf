Dashboard KPI: eyebrow → big mono value → signed delta → optional sparkline.

```jsx
<StatCard label="НИЙТ БАГЦ" value="₮ 48,250,000" delta="+2.4%" deltaPositive trend={series} />
```

Empty renders ₮0 / Датагүй with no fake delta; loading shimmers. Values are pre-formatted (use formatMNT).
