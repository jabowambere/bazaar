export default function MembershipSection() {
  return (
    <section className="membership-section" id="membership">
      <div className="membership-copy">
        <p className="eyebrow">Membership</p>
        <h2>Sell access, not just downloads.</h2>
        <p>
          Turn your storefront into a members club with early drops, saved products,
          private scenes, and licensing perks bundled into one polished experience.
        </p>
      </div>
      <div className="membership-cards">
        <article className="membership-card" style={{ color: '#9f3518' }}>
          <span>Starter</span>
          <strong>Free access</strong>
          <p style={{color: '#9f3518' }}>Preview featured assets, join the list, and unlock occasional public drops.</p>
        </article>
        <article className="membership-card accent" style={{ color: '#9f3518' }}>
          <span>Pro</span>
          <strong>$19 / month</strong>
          <p>Get the full asset library, license activations, weekly releases, and bonus files.</p>
        </article>
        <article className="membership-card" style={{ color: '#9f3518' }}>
          <span>Studio</span>
          <strong>Team licensing</strong>
          <p style={{color: '#9f3518'}}>Built for agencies needing commercial usage rights, shared seats, and priority support.</p>
        </article>
      </div>
    </section>
  )
}
