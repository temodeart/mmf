Centered dialog + scrim; header with logo/title/ticker + close, sticky footer CTA. The single order dialog.

```jsx
<Modal open={open} onClose={close} logo="ХБ" title="Захиалга баталгаажуулах" ticker="CAPIT 1450 CD 240227" footer={cta}>...</Modal>
```

Scrim click closes. Use for order confirmation and other blocking decisions.
