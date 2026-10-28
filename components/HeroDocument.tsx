"use client";

import { useRef } from "react";
import { ArrowUpRight, Check, FileText } from "lucide-react";

export function HeroDocument() {
  const cardRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = cardRef.current;
    if (!card) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `perspective(1100px) rotateX(${-y * 7}deg) rotateY(${x * 9}deg) translateZ(0)`;
    card.style.setProperty("--shine-x", `${(x + 0.5) * 100}%`);
    card.style.setProperty("--shine-y", `${(y + 0.5) * 100}%`);
  };

  const reset = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(1100px) rotateX(2deg) rotateY(-5deg)";
  };

  return (
    <div className="hero-document-wrap" onPointerMove={onPointerMove} onPointerLeave={reset}>
      <div className="document-orbit orbit-one" aria-hidden="true" />
      <div className="document-orbit orbit-two" aria-hidden="true" />
      <div className="hero-document" ref={cardRef}>
        <div className="document-shine" aria-hidden="true" />
        <div className="hero-doc-top">
          <div className="doc-symbol"><FileText size={17} strokeWidth={1.6} /></div>
          <span>FORMAL NOTICE</span>
          <span className="doc-number">001</span>
        </div>
        <div className="hero-doc-content">
          <p className="doc-date">OCTOBER 28, 2026</p>
          <h2>Demand for<br />Payment</h2>
          <div className="doc-rule" />
          <p className="doc-recipient">To Northline Studio</p>
          <p className="doc-copy">A clear request. A documented deadline.<br />A professional path toward resolution.</p>
          <div className="doc-amount-row">
            <span>AMOUNT DUE</span>
            <strong>$12,400.00</strong>
          </div>
          <div className="doc-lines"><i /><i /><i /></div>
          <div className="doc-signature">Avery Morgan</div>
        </div>
        <div className="hero-doc-footer"><span>DEMANDBASE</span><span>PRIVATE &amp; SECURE</span></div>
      </div>
      <div className="floating-resolution">
        <span className="resolution-icon"><Check size={14} strokeWidth={2.4} /></span>
        <span><strong>Ready to send</strong><small>Clear, concise, complete</small></span>
      </div>
      <a className="floating-preview" href="#studio">
        <span>Build yours</span><ArrowUpRight size={16} />
      </a>
    </div>
  );
}
