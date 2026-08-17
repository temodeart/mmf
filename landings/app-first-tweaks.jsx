/* MMF — App-First landing · Tweaks */
const { useEffect } = React;

const LAF_ACCENTS = {
  '#4F46E5': { soft: '#EEF0FE' },
  '#2D6BFF': { soft: '#E7EEFF' },
  '#0B1020': { soft: '#EAECF3' },
};

function LafTweaks() {
  const [tweaks, setTweak] = useTweaks({
    accent: '#4F46E5',
    motion: 'Асаалттай',
  });

  useEffect(() => {
    const root = document.documentElement;
    const acc = LAF_ACCENTS[tweaks.accent] ? tweaks.accent : '#4F46E5';
    root.style.setProperty('--accent', acc);
    root.style.setProperty('--accent-soft', LAF_ACCENTS[acc].soft);
    root.dataset.motion = tweaks.motion === 'Асаалттай' ? 'on' : 'off';
  }, [tweaks]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Брэнд">
        <TweakColor
          label="Гол өнгө"
          value={tweaks.accent}
          options={['#4F46E5', '#2D6BFF', '#0B1020']}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweakSection>
      <TweakSection label="Хөдөлгөөн">
        <TweakRadio
          label="Анимаци"
          value={tweaks.motion}
          options={['Асаалттай', 'Унтраасан']}
          onChange={(v) => setTweak('motion', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

const lafTweaksRoot = document.createElement('div');
document.body.appendChild(lafTweaksRoot);
ReactDOM.createRoot(lafTweaksRoot).render(<LafTweaks />);
