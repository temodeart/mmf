The single source of Buy/Sell semantics (or a neutral indigo toggle).

```jsx
<SegmentedControl semantic="buy-sell" value={side} onChange={setSide} options={[{value:'buy',label:'Авах'},{value:'sell',label:'Зарах'}]} />
```

With semantic="buy-sell", propagate the active intent to the ticket CTA color.
