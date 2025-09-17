import { Link } from 'react-router-dom';
import aboutHero from '../assets/images/about-hero.jpg'; // Optional banner image

const About = () => {
  return (
    <main className="about-page">
      <div className="hero-wrapper">
        <img src={aboutHero} alt="Us" className="hero-img" />
        <h1 className="title">About</h1>
      </div>

      <section className="centered-section">
        <Link to="/" className="logo">
          <h2>
            Pro
            <span className="material-symbols-outlined cog-icon">settings</span>
            gressio
          </h2>
        </Link>
        <p>Passion. Quality. Community.</p>
      </section>

      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          Our journey began with a simple idea: to sell high-quality, beautifully designed products accessible to everyone, with prices for everyone.
          We have grown into a thriving e-commerce business, thanks to our amazing customers.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          We're here to redefine online shopping by focusing on quality, sustainability and customer satisfaction. We aim to make tech affordable and accessible to all the people around the world. 
          Every product we sell is chosen with care, ensuring it meets our high standards.
        </p>
      </section>

      <section className="about-section">
        <h2>What We Offer</h2>
        <p>
          We make it easy to get your hands on the latest tech: from smartphones and smart home devices to must-have accessories and everyday gadgets. 
          Our products are carefully selected for their quality, performance, and value, so you can enjoy cutting-edge technology without breaking the bank.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Promise to You</h2>
        <ul>
          <li>Fast & Free Shipping on Orders Over $100</li>
          <li>30-Day Hassle-Free Returns</li>
          <li>High-Quality, Tested Tech Products</li>
          <li>Secure Checkout & Buyer Protection</li>
          <li>Carefully Packaged to Prevent Damage</li>
          <li>Great Deals Without Compromising Quality</li>
          <li>Regular New Arrivals from Trusted Brands</li>
        </ul>
      </section>

      {/* Call to Action */}
      <section className="about-cta">
        <h3>Ready to explore?</h3>
        <Link to="/" className="back-shopping-btn new-card-btn">Shop now</Link>
      </section>

    </main>
  );
};

export default About;
