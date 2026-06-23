import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import SuccessStories from "@/components/landing/SuccessStories";
import CtaBanner from "@/components/landing/CtaBanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <SuccessStories />
      <CtaBanner />
      <Footer />
    </>
  );
}