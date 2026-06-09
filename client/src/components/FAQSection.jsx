import { useState, useRef, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'What is ProductHub?',
    a: 'ProductHub is a curated digital marketplace where creators and collectors buy and sell premium digital assets, physical products, and exclusive drops.'
  },
  {
    q: 'Do I need an account to browse products?',
    a: 'No — anyone can browse the catalog. However, you need a free account to add products to your cart, purchase, or list your own items.'
  },
  {
    q: 'How do I list my own product?',
    a: 'Sign in or create an account, go to My Products, and click "Add Product". Fill in the details, upload an image, and your listing goes live instantly.'
  },
  {
    q: 'Are my uploaded images safe?',
    a: 'Yes. All product images are stored on Cloudinary, a secure and reliable cloud storage service. Your images are safe from data loss.'
  },
  {
    q: 'What payment methods are supported?',
    a: 'ProductHub currently supports checkout via cart. Full payment integration with Stripe is coming soon in the next major update.'
  },
  {
    q: 'Can I delete or edit my products?',
    a: 'Absolutely. You can edit or delete any product you own from the My Products page. Admins can also manage all products from the admin dashboard.'
  },
  {
    q: 'Is there a mobile app?',
    a: 'Not yet. The platform is still being optimized for mobile and may not display perfectly on all screen sizes, but a fully responsive experience is actively being worked on.'
  },
]

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onClick={() => setOpen(!open)}
      style={{
        border: '1px solid rgba(159,53,24,0.15)',
        borderRadius: '18px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: open ? 'linear-gradient(135deg, rgba(217,95,57,0.06), rgba(159,53,24,0.04))' : '#fff',
        transition: 'all 0.3s ease',
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        opacity: visible ? 1 : 0,
        transitionDelay: `${index * 0.07}s`,
        boxShadow: open ? '0 8px 32px rgba(159,53,24,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 24px', gap: '16px',
      }}>
        <p style={{
          margin: 0, fontWeight: 600, fontSize: '0.98rem',
          color: open ? '#9f3518' : '#1a1815', transition: 'color 0.3s',
        }}>{faq.q}</p>
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
          display: 'grid', placeItems: 'center',
          background: open ? 'linear-gradient(135deg, #d95f39, #9f3518)' : 'rgba(159,53,24,0.08)',
          transition: 'all 0.3s ease',
        }}>
          {open
            ? <Minus size={16} color="#fff" />
            : <Plus size={16} color="#9f3518" />
          }
        </div>
      </div>

      <div style={{
        maxHeight: open ? '200px' : '0',
        overflow: 'hidden',
        transition: 'max-height 0.4s ease',
      }}>
        <p style={{
          margin: 0, padding: '0 24px 20px',
          color: '#6f665d', lineHeight: 1.7, fontSize: '0.92rem',
        }}>{faq.a}</p>
      </div>
    </div>
  )
}

export default function FAQSection() {
  const [headingVisible, setHeadingVisible] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeadingVisible(true) },
      { threshold: 0.2 }
    )
    if (headingRef.current) observer.observe(headingRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section style={{ paddingTop: '60px', paddingBottom: '20px' }} id="faq">

      {/* Heading */}
      <div
        ref={headingRef}
        style={{
          textAlign: 'center', marginBottom: '48px',
          transform: headingVisible ? 'translateY(0)' : 'translateY(40px)',
          opacity: headingVisible ? 1 : 0,
          transition: 'all 0.6s ease',
        }}
      >
        <p className="eyebrow" style={{ justifyContent: 'center', display: 'flex', marginBottom: '12px' }}>
          Got Questions?
        </p>
        <h2 style={{
          fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', lineHeight: 0.94,
          letterSpacing: '-0.05em', color: '#1a1815', margin: '0 0 16px',
        }}>
          Everything you need{' '}
          <span style={{
            background: 'linear-gradient(135deg, #d95f39, #9f3518)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            fontStyle: 'italic',
          }}>to know.</span>
        </h2>
        <p style={{
          color: '#6f665d', fontSize: '1rem', maxWidth: '40ch',
          margin: '0 auto', lineHeight: 1.7,
        }}>
          Can't find what you're looking for? Reach out and we'll get back to you.
        </p>
      </div>

      {/* FAQ Items */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 520px), 1fr))',
        gap: '12px',
        maxWidth: '1100px',
        margin: '0 auto',
      }}>
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} index={i} />
        ))}
      </div>
    </section>
  )
}
