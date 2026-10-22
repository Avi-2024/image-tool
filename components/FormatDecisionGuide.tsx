import type { ConverterPage } from '@/config/converters';

type Guide = NonNullable<ConverterPage['decisionGuide']>;

export default function FormatDecisionGuide({ guide }: { guide: Guide }) {
  return (
    <section className="section decision-guide" aria-labelledby="format-decision-heading">
      <div className="section-heading">
        <span className="eyebrow">CHOOSING THE RIGHT FORMAT</span>
        <h2 id="format-decision-heading">{guide.heading}</h2>
        <p>{guide.intro}</p>
      </div>
      <div className="decision-guide-list">
        {guide.cases.map(item => (
          <div className="decision-guide-item" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
      <p className="decision-guide-note"><strong>Before you convert:</strong> {guide.warning}</p>
    </section>
  );
}
