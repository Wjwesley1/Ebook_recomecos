'use client'

import Nav from "./components/Nav";

export default function Home() {
  return (
    <div className="hero">
      <div className="top-bar">
        <div className="top-bar-content">
          <span className="top-bar-title animate-fadeIn">Recomeços</span>
          <div className="top-bar-links animate-slideUp">
            <a href="#sobre" className="top-bar-link">Sobre</a>
            <a href="#autor" className="top-bar-link">Autor</a>
            <a href="#depoimentos" className="top-bar-link">Depoimentos</a>
          </div>
          {/* <a href="/checkout" className="top-bar-button animate-fadeIn">
            Compre Agora
          </a> */}
        </div>
      </div>
      <Nav />
      <main className="container main">
        <h1 className="hero-title animate-fadeIn">Recomeços em Tempos de Crise</h1>
        <p className="hero-text animate-slideUp">Um guia transformador para superar desafios e recomeçar com confiança!</p>
        <div className="price-container animate-scaleUp">
          <span className="price">R$19,90</span>
          <span className="price-old">R$29,90</span>
        </div>
        {/* <a href="/checkout" className="button hover:brightness-110 transition-all duration-300 transform hover:scale-105">
          Adquirir Agora
        </a> */}

        {/* Seção Sobre */}
        <section id="sobre" className="section about-section animate-fadeIn">
          <h2 className="section-title">Sobre</h2>
          <div className="about-content">
            <img src="/ebook-cover-placeholder.jpg" alt="Capa do e-book Recomeços em Tempos de Crise" className="section-image" />
            <p className="section-text">
              Descubra um guia poderoso para transformar crises em recomeços! Com mais de 150 páginas de estratégias práticas, 
              este e-book traz esperança e renovação, guiado pela fé em Jesus Cristo. Em apenas 30 dias, mude sua vida com 
              sabedoria espiritual e ferramentas comprovadas. Não perca essa oportunidade de renascer!
            </p>
          </div>
        </section>

        {/* Seção Autor */}
        <section id="autor" className="section author-section animate-slideUp">
          <h2 className="section-title">Autor</h2>
          <div className="author-content">
            <img src="/author-placeholder.jpg" alt="Foto do autor" className="section-image" />
            <p className="section-text">
              Escrito por [Nome do Autor], um especialista em desenvolvimento pessoal com anos de experiência 
              em ajudar pessoas a superar desafios e encontrar novos caminhos.
            </p>
          </div>
        </section>

        {/* Seção Depoimentos */}
        <section id="depoimentos" className="section testimonials-section animate-scaleUp">
          <h2 className="section-title">Depoimentos</h2>
          <div className="testimonials-container">
            <div className="testimonial">
              <p className="testimonial-text">"Mudou minha vida! Recomendo a todos."</p>
              <p className="testimonial-author">- Maria Silva</p>
            </div>
            <div className="testimonial">
              <p className="testimonial-text">"Incrível, superou minhas expectativas."</p>
              <p className="testimonial-author">- João Santos</p>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé com Informações de Direitos */}
      <footer className="footer">
        <p className="footer-text">
          © 2025 Recomeços em Tempos de Crise. Todos os direitos reservados.
        </p>
        <p className="footer-text">
          Este ebook não substitui aconselhamento médico ou espiritual profissional. Consulte um especialista se necessário.
        </p>
      </footer>
    </div>
  );
}