import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import {
  PiPlantFill,
  PiMagnifyingGlassFill,
  PiChartLineUpFill,
  PiCloudSunFill,
  PiFlaskFill,
  PiShieldCheckFill,
  PiArrowRightBold,
  PiUploadSimpleBold,
  PiCpuFill,
  PiCheckCircleFill,
  PiLeafFill,
  PiGithubLogoFill,
  PiEnvelopeFill,
  PiUsersFill,
  PiTargetFill,
  PiCropFill,
} from 'react-icons/pi'
import { useEffect, useRef, useState } from 'react'

function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  )
}

/* ===== HERO SECTION ===== */
function HeroSection() {
  return (
    <section style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--gradient-hero)',
      padding: '120px 24px 80px',
    }}>
      {/* Decorative blobs */}
      <div className="blob blob-primary" style={{ width: 400, height: 400, top: -100, right: -100 }} />
      <div className="blob blob-accent" style={{ width: 300, height: 300, bottom: -80, left: -60 }} />
      <div className="blob blob-primary" style={{ width: 200, height: 200, top: '40%', left: '20%', opacity: 0.15 }} />

      <div style={{
        maxWidth: 900,
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <div
          className="badge badge-primary animate-fade-in-down"
          style={{ marginBottom: 24, fontSize: '0.8rem' }}
        >
          <PiLeafFill /> AI-Powered Agriculture Platform
        </div>

        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: 24,
            letterSpacing: '-0.02em',
            color: 'var(--color-text)',
          }}
        >
          Smart Farming,{' '}
          <span className="gradient-text">Smarter Decisions</span>
        </h1>

        <p
          className="animate-fade-in-up delay-200"
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: 640,
            margin: '0 auto 40px',
            lineHeight: 1.7,
          }}
        >
          Harness the power of artificial intelligence to get personalized crop recommendations,
          instant disease detection, accurate yield predictions, and real-time weather insights.
        </p>

        <div
          className="animate-fade-in-up delay-300"
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Free <PiArrowRightBold />
          </Link>
          <a href="#features" className="btn btn-secondary btn-lg">
            Explore Features
          </a>
        </div>

        {/* Floating feature icons */}
        <div className="animate-fade-in delay-500" style={{ marginTop: 60, position: 'relative' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 32,
            flexWrap: 'wrap',
          }}>
            <FloatingIcon icon={<PiPlantFill />} label="Crop AI" delay={0} />
            <FloatingIcon icon={<PiMagnifyingGlassFill />} label="Disease Detection" delay={0.5} />
            <FloatingIcon icon={<PiChartLineUpFill />} label="Yield Prediction" delay={1} />
            <FloatingIcon icon={<PiCloudSunFill />} label="Weather" delay={1.5} />
          </div>
        </div>
      </div>
    </section>
  )
}

function FloatingIcon({ icon, label, delay }) {
  return (
    <div
      className="animate-float"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        animationDelay: `${delay}s`,
      }}
    >
      <div className="card-glass" style={{
        width: 64,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5rem',
        color: 'var(--color-primary)',
        borderRadius: 'var(--radius-lg)',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: 600,
        color: 'var(--color-text-secondary)',
      }}>
        {label}
      </span>
    </div>
  )
}

/* ===== FEATURES SECTION ===== */
function FeaturesSection() {
  const features = [
    {
      icon: <PiPlantFill />,
      title: 'Crop Recommendation',
      description: 'Get AI-powered crop suggestions based on soil type, climate, rainfall, and nutrient levels for maximum yield.',
      color: '#10b981',
    },
    {
      icon: <PiMagnifyingGlassFill />,
      title: 'Disease Detection',
      description: 'Upload a photo of your crop leaf and get instant disease diagnosis with treatment recommendations.',
      color: '#f59e0b',
    },
    {
      icon: <PiChartLineUpFill />,
      title: 'Yield Prediction',
      description: 'Predict your harvest output before the season begins using historical data and machine learning.',
      color: '#6366f1',
    },
    {
      icon: <PiFlaskFill />,
      title: 'Fertilizer Advisor',
      description: 'Receive personalized fertilizer recommendations based on your soil nutrients and crop type.',
      color: '#ec4899',
    },
    {
      icon: <PiCloudSunFill />,
      title: 'Weather Intelligence',
      description: 'Real-time weather data and 7-day forecasts to help you plan farming activities effectively.',
      color: '#0ea5e9',
    },
    {
      icon: <PiShieldCheckFill />,
      title: 'Data Security',
      description: 'Your farm data is encrypted and securely stored. We prioritize your privacy and data protection.',
      color: '#065f46',
    },
  ]

  return (
    <section id="features" className="section-lg" style={{ background: 'white' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-primary" style={{ marginBottom: 16 }}>
            <PiTargetFill /> Core Features
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}>
            Everything You Need to{' '}
            <span className="gradient-text">Farm Smarter</span>
          </h2>
          <p style={{
            color: 'var(--color-text-secondary)',
            maxWidth: 560,
            margin: '0 auto',
            fontSize: '1.05rem',
          }}>
            Our AI-powered platform provides comprehensive tools designed specifically for modern agriculture.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ icon, title, description, color, index }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="card-glass"
      style={{
        padding: 32,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.5s ease-out ${index * 0.1}s`,
      }}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: 'var(--radius-md)',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.4rem',
        color: color,
        marginBottom: 20,
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.15rem',
        fontWeight: 700,
        marginBottom: 8,
        color: 'var(--color-text)',
      }}>
        {title}
      </h3>
      <p style={{
        fontSize: '0.9rem',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.6,
      }}>
        {description}
      </p>
    </div>
  )
}

/* ===== HOW IT WORKS ===== */
function HowItWorksSection() {
  const steps = [
    {
      icon: <PiUploadSimpleBold />,
      title: 'Input Your Data',
      description: 'Enter your soil parameters, upload crop images, or provide your farm location.',
    },
    {
      icon: <PiCpuFill />,
      title: 'AI Analysis',
      description: 'Our trained ML models process your data using advanced algorithms and real-time data.',
    },
    {
      icon: <PiCheckCircleFill />,
      title: 'Get Results',
      description: 'Receive actionable insights — crop recommendations, diagnoses, yield forecasts, and more.',
    },
  ]

  return (
    <section className="section-lg" style={{ background: 'var(--color-bg)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div className="badge badge-accent" style={{ marginBottom: 16 }}>
            <PiCropFill /> Simple Process
          </div>
          <h2 style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            fontWeight: 800,
            marginBottom: 16,
          }}>
            How It Works
          </h2>
          <p style={{
            color: 'var(--color-text-secondary)',
            maxWidth: 500,
            margin: '0 auto',
            fontSize: '1.05rem',
          }}>
            Three simple steps to transform your farming decisions.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 32,
          position: 'relative',
        }}>
          {steps.map((step, index) => (
            <StepCard key={index} {...step} step={index + 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ icon, title, description, step }) {
  return (
    <div style={{
      textAlign: 'center',
      position: 'relative',
    }}>
      <div style={{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'var(--gradient-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        fontSize: '1.8rem',
        color: 'white',
        boxShadow: '0 8px 30px rgba(6, 95, 70, 0.25)',
        position: 'relative',
      }}>
        {icon}
        <div style={{
          position: 'absolute',
          top: -8,
          right: -8,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'var(--gradient-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 800,
          color: 'var(--color-primary-dark)',
        }}>
          {step}
        </div>
      </div>
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: 700,
        marginBottom: 8,
      }}>
        {title}
      </h3>
      <p style={{
        color: 'var(--color-text-secondary)',
        fontSize: '0.9rem',
        lineHeight: 1.6,
        maxWidth: 280,
        margin: '0 auto',
      }}>
        {description}
      </p>
    </div>
  )
}

/* ===== STATS SECTION ===== */
function StatsSection() {
  const stats = [
    { value: '10,000+', label: 'Farmers Helped', icon: <PiUsersFill /> },
    { value: '95%', label: 'Prediction Accuracy', icon: <PiTargetFill /> },
    { value: '50+', label: 'Crop Types', icon: <PiPlantFill /> },
    { value: '24/7', label: 'Availability', icon: <PiShieldCheckFill /> },
  ]

  return (
    <section style={{
      background: 'var(--gradient-dark)',
      padding: '80px 24px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
        }}>
          {stats.map((stat, index) => (
            <StatItem key={index} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatItem({ value, label, icon, index }) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        textAlign: 'center',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `all 0.5s ease-out ${index * 0.15}s`,
      }}
    >
      <div style={{
        fontSize: '1.5rem',
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 12,
      }}>
        {icon}
      </div>
      <div style={{
        fontSize: 'clamp(2rem, 4vw, 2.8rem)',
        fontWeight: 900,
        color: 'white',
        marginBottom: 4,
        letterSpacing: '-0.02em',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: '0.9rem',
        color: 'rgba(255,255,255,0.6)',
        fontWeight: 500,
      }}>
        {label}
      </div>
    </div>
  )
}

/* ===== CTA SECTION ===== */
function CTASection() {
  return (
    <section className="section-lg" style={{ background: 'white' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
          fontWeight: 800,
          marginBottom: 16,
        }}>
          Ready to Transform Your{' '}
          <span className="gradient-text">Farming?</span>
        </h2>
        <p style={{
          color: 'var(--color-text-secondary)',
          maxWidth: 500,
          margin: '0 auto 32px',
          fontSize: '1.05rem',
        }}>
          Join thousands of farmers already using AI to make better decisions and increase their yield.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-primary btn-lg">
            Create Free Account <PiArrowRightBold />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ===== FOOTER ===== */
function Footer() {
  return (
    <footer style={{
      background: 'var(--color-primary-dark)',
      color: 'rgba(255,255,255,0.7)',
      padding: '48px 24px 24px',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 40,
          marginBottom: 40,
        }}>
          {/* Brand */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 16,
              fontSize: '1.2rem',
              fontWeight: 800,
              color: 'white',
            }}>
              <PiLeafFill style={{ color: 'var(--color-primary-lighter)' }} />
              AgriVision AI
            </div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
              AI-powered smart farming decision support platform for modern agriculture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FooterLink to="#features" label="Features" />
              <FooterLink to="/login" label="Login" />
              <FooterLink to="/register" label="Register" />
            </div>
          </div>

          {/* AI Services */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>
              AI Services
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FooterLink to="#" label="Crop Recommendation" />
              <FooterLink to="#" label="Disease Detection" />
              <FooterLink to="#" label="Yield Prediction" />
              <FooterLink to="#" label="Weather Analysis" />
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>
              Connect
            </h4>
            <div style={{ display: 'flex', gap: 12 }}>
              <a
                href="#"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '1rem',
                  transition: 'all 200ms',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                <PiGithubLogoFill />
              </a>
              <a
                href="#"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '1rem',
                  transition: 'all 200ms',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'rgba(255,255,255,0.7)'
                }}
              >
                <PiEnvelopeFill />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          textAlign: 'center',
          fontSize: '0.8rem',
        }}>
          © {new Date().getFullYear()} AgriVision AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ to, label }) {
  return (
    <Link
      to={to}
      style={{
        color: 'rgba(255,255,255,0.6)',
        textDecoration: 'none',
        fontSize: '0.85rem',
        transition: 'color 200ms',
      }}
      onMouseEnter={(e) => e.target.style.color = 'white'}
      onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.6)'}
    >
      {label}
    </Link>
  )
}

export default LandingPage
