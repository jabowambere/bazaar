import useReveal from './FadeIn'

export default function NewsletterSection() {
  const [ref, visible] = useReveal()

  return (
    <section className="newsletter-section" id="newsletter">
      <div
        ref={ref}
        className={`newsletter-panel${visible ? ' lp-blur-in' : ''}`}
        style={visible ? { animationDelay: '0s' } : { opacity: 0 }}
      >
        <div>
          <p style={{color:'#9f3518'}} className="eyebrow">Stay in the Loop</p>
          <h2 style={{color:'#9f3518'}}>Get notified the second a new product drops.</h2>
        </div>
        <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
          <label className="sr-only" htmlFor="email">Email address</label>
          <input id="email" type="email" placeholder="Email address" />
          <button type="submit">Join mailing list</button>
        </form>
      </div>
    </section>
  )
}
