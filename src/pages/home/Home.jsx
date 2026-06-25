import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/pages/home/sections/Hero'
import Stats from '@/pages/home/sections/Stats'
import Features from '@/pages/home/sections/Features'
import Testimonials from '@/pages/home/sections/Testimonials'
import CTA from '@/pages/home/sections/CTA'

/**
 * Home — public landing page. Composed entirely of section components
 * (Hero, Stats, Features, Testimonials, CTA) so each block can be
 * reordered, A/B tested, or reused on a future marketing page without
 * touching this file's structure.
 */
export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
