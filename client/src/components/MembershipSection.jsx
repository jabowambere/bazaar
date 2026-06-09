import useReveal from './FadeIn'

const cards = [
  { label: 'Starter', price: 'Free access', desc: 'Preview featured assets, join the list, and unlock occasional public drops.', accent: false },
  { label: 'Pro', price: '$19 / month', desc: 'Get the full asset library, license activations, weekly releases, and bonus files.', accent: true },
  { label: 'Studio', price: 'Team licensing', desc: 'Built for agencies needing commercial usage rights, shared seats, and priority support.', accent: false },
]

export default function MembershipSection() {
  const [copyRef, copyVisible] = useReveal()
  const [cardsRef, cardsVisible] = useReveal()

  return (
    <section className="membership-section" id="membership">
      <div
        ref={copyRef}
        className={`membership-copy${copyVisible ? ' lp-slide-left' : ''}`}
        style={copyVisible ? { animationDelay: '0s' } : { opacity: 0 }}
      >
        <p className="eyebrow">Membership</p>
        <h2>Sell access, not just downloads.</h2>
        <p>
          Turn your storefront into a members club with early drops, saved products,
          private scenes, and licensing perks bundled into one polished experience.
        </p>
      </div>

      <div className="membership-cards" ref={cardsRef}>
        {cards.map(({ label, price, desc, accent }, i) => (
          <article
            key={label}
            className={`membership-card${accent ? ' accent' : ''}${cardsVisible ? ' lp-pop' : ''}`}
            style={{ color: '#9f3518', ...(cardsVisible ? { animationDelay: `${i * 0.18}s` } : { opacity: 0 }) }}
          >
            <span>{label}</span>
            <strong>{price}</strong>
            <p style={accent ? {} : { color: '#9f3518' }}>{desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
