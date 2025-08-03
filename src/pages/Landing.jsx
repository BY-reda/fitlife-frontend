import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import SignupForm from '../pages/Signup';
import '../css/Landing.css';
import Footer from './Footer';

const slides = [
  {
    image: './media/3.png',
    title: 'State-of-the-Art Facilities',
    description: 'Experience fitness in our premium, fully-equipped gym with the latest technology.',
    button: 'View Our Gym',
  },
  {
    image: './media/5.png',
    title: 'Expert Trainers, Real Results',
    description: 'Achieve your goals faster with professional guidance.',
    button: 'Meet Our Trainers',
  },
  {
    image: './media/4.png',
    title: 'be your own coach',
    description: 'Every journey is different, let’s personalize yours.',
    button: 'Get Started',
  }, {
    image: './media/2.png',
    title: 'meals prep',
    description: 'make your own meals with our programms.',
    button: 'Get Started',
  }
];

const Landing = () => {
  const signupRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
    const [nextIndex, setNextIndex] = useState(1);


  const scrollToSignup = () => {
    signupRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
  // Load the initial image first
  const img = new Image();
  img.src = slides[current].image;
  img.onload = () => setLoaded(true);

  // Then start the slideshow
  const interval = setInterval(() => {
    const next = (nextIndex + 1) % slides.length;
    const imgNext = new Image();
    setLoaded(false);
    imgNext.src = slides[nextIndex].image;
    imgNext.onload = () => {
      setCurrent(nextIndex);
      setNextIndex(next);
      setLoaded(true);
    };
  }, 5000);

  return () => clearInterval(interval);
}, []);
  return (
    <div className="landing-container">
      <Navbar onJoinClick={scrollToSignup} />
      <section className="hero-slider">
        <div
          className={`hero-slide ${loaded ? 'loaded' : 'loading'}`}
          style={{
            backgroundImage: loaded ? `url(${slides[current].image})` : 'none',
          }}
        >
          <div className="hero-overlay" />
          {loaded && (
            <div className="hero-content">
              <h1>{slides[current].title}</h1>
              <p>{slides[current].description}</p>
              <button onClick={scrollToSignup}>{slides[current].button}</button>
            </div>
          )}
        </div>
      </section>

      <section className="services-section">
        <h2>Our Services</h2>
        <p>We offer a variety of fitness programs to help you achieve your goals.</p>
        <div className="service-cards">
          <div className="card">
            <img src="./media/Personal Training.png" alt="Personal Training" />
            <h3>Personal Training</h3>
            <p>One-on-one sessions with expert trainers</p>
          </div>
          <div className="card">
            <img src="./media/Group Classes.png" alt="Group Classes" />
            <h3>Group Classes</h3>
            <p>Fun, energetic workouts for all fitness levels</p>
          </div>
          <div className="card">
            <img src="./media/Nutrition Coaching.png" alt="Nutrition Coaching" />
            <h3>Nutrition Coaching</h3>
            <p>Personalized nutrition plans for optimal health</p>
          </div>
        </div>
      </section>

    <section className="pricing-section">
  <h2>Membership Plans</h2>
  <p>Start your fitness journey for free. Upgrade to unlock nutrition tracking, personalized programs, and more!</p>
  
  <div className="pricing-cards">

    {/* FREE PLAN - Default Selected */}
    <div className="pricing-card selected-plan">
      <h3>Free</h3>
      <p className="subtitle">Get started with the basics</p>
      <p className="price">$0<span>/month</span></p>
      <ul>
        <li>Basic gym workouts</li>
        <li>Access to food diary</li>
        <li>Community support</li>
        <li>Progress tracking (basic)</li>
      </ul>
      <button className="active">Selected</button>
    </div>

    {/* PREMIUM PLAN - Locked */}
    <div className="pricing-card locked-plan">
      <h3>Premium <span className="lock-icon"></span></h3>
      <p className="subtitle">Enhance your results</p>
      <p className="price">$59<span>/month</span></p>
      <ul>
        <li>Advanced workout programs</li>
        <li>Unlimited food diary entries</li>
        <li>AI nutrition suggestions</li>
        <li>Personalized plans</li>
      </ul>
      <button disabled className="disabled">Locked</button>
    </div>

    {/* ELITE PLAN - Locked */}
    <div className="pricing-card locked-plan">
      <h3>Elite <span className="lock-icon"></span></h3>
      <p className="subtitle">Everything, unlimited</p>
      <p className="price">$99<span>/month</span></p>
      <ul>
        <li>24/7 gym + all features</li>
        <li>4 personal coaching sessions/month</li>
        <li>Full access to nutrition & recovery</li>
        <li>Exclusive elite community</li>
      </ul>
      <button disabled className="disabled">Locked</button>
    </div>

  </div>
</section>


      <section ref={signupRef} className="signup-section">

        <SignupForm />
      </section>

      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Landing;
