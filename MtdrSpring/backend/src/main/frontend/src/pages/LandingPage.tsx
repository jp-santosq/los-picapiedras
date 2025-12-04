import Header from "../components/stone-flow/Header";
import Hero from "../components/stone-flow/Hero";
import Features from "../components/stone-flow/Features";
import Stats from "../components/stone-flow/Stats";
import Footer from "../components/stone-flow/Footer";
import '../styles/landing-tailwind.css';
import '../styles/landing.css';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background stone-flow-landing">
      <Header />
      <main>
        <Hero />
        <Features />
        <Stats />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;