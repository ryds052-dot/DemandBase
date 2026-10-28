import { ArrowDown, ArrowRight, ShieldCheck } from "lucide-react";
import { Atmosphere } from "./Atmosphere";
import { HeroDocument } from "./HeroDocument";

export function Hero() {
  return (
    <section className="hero" id="top">
      <Atmosphere />
      <div className="hero-glow" aria-hidden="true" />
      <div className="hero-grid container">
        <div className="hero-copy">
          <div className="eyebrow hero-eyebrow"><span /> A clearer path to getting paid</div>
          <h1>Your work has value.<br /><em>Your time does too.</em></h1>
          <p className="hero-lede">Turn an overdue invoice into a polished demand letter in minutes. Thoughtful structure, precise language, and a professional document—without the legal maze.</p>
          <div className="hero-actions">
            <a href="#studio" className="button button-primary magnetic-button">Build your demand letter <ArrowRight size={17} /></a>
            <a href="#process" className="text-link">See how it works <ArrowDown size={15} /></a>
          </div>
          <div className="hero-assurance"><ShieldCheck size={16} strokeWidth={1.7} /><span>Your draft stays in your browser. No account required.</span></div>
        </div>
        <HeroDocument />
      </div>
      <div className="hero-bottom container">
        <span>Designed for independent work</span>
        <div><i /> Freelancers <i /> Contractors <i /> Small studios</div>
      </div>
    </section>
  );
}
