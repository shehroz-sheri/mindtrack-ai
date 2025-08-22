import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import HowToUse from '@/components/HowToUse';
import Features from '@/components/Features';
import WhyItMatters from '@/components/WhyItMatters';
import Impact from '@/components/Impact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowToUse />
      <Features />
      <WhyItMatters />
      <Impact />
      <Footer />
    </main>
  );
}