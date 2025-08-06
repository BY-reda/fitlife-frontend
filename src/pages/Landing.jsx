import React, { useRef } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Navbar from '../pages/Navbar';
import SignupForm from '../pages/Signup';
import Footer from './Footer';
import '../css/Landing.css';

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
  },
  {
    image: './media/2.png',
    title: 'meals prep',
    description: 'make your own meals with our programms.',
    button: 'Get Started',
  }
];

const Landing = () => {
  const signupRef = useRef(null);

  const scrollToSignup = () => {
    if (signupRef.current) {
      window.scrollTo({
        top: signupRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

 const settings = {
  dots: true,
  infinite: true,
  speed: 900,            // Faster transition speed
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,   // Less wait between slides
  arrows: false,         // Disable arrows to reduce DOM work
  pauseOnHover: false,   // Keeps autoplay smooth
  cssEase: 'ease-in-out' // Smooth easing for transitions
};

  return (
    <div className="landing-container">
      <Navbar onJoinClick={scrollToSignup} />

      <section className="hero-slider">
        <Slider {...settings}>
          {slides.map((slide, index) => (
            <div key={index} className="hero-slide" style={{ position: 'relative' }}>
              <img src={slide.image} alt={slide.title} style={{ width: '100%', height: 'auto' }} />
              <div className="hero-overlay" />
              <div
                className="hero-content"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#fff',
                  textAlign: 'center',
                  width: '80%',
                }}
              >
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button onClick={scrollToSignup}>{slide.button}</button>
              </div>
            </div>
          ))}
        </Slider>
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
