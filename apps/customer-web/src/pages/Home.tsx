import { useState } from 'react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: '👕',
    title: 'Wash & Fold',
    description: 'Regular laundry service with care and attention to detail. Your clothes come back fresh and neatly folded.',
    price: 'From 500 FCFA/item',
  },
  {
    icon: '✨',
    title: 'Dry Cleaning',
    description: 'Professional dry cleaning for delicate fabrics, suits, dresses, and special garments.',
    price: 'From 1,500 FCFA/item',
  },
  {
    icon: '🔥',
    title: 'Ironing / Pressing',
    description: 'Crisp, wrinkle-free finishing for all your garments. Look sharp every day.',
    price: 'From 300 FCFA/item',
  },
  {
    icon: '⚡',
    title: 'Express Service',
    description: 'Need it fast? Same-day or next-day delivery available for urgent orders.',
    price: 'From 2,000 FCFA/item',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Place Order',
    description: 'Book online or visit our branch. Select services and schedule pickup.',
  },
  {
    step: '2',
    title: 'We Collect',
    description: 'Our team picks up your laundry from your doorstep at the scheduled time.',
  },
  {
    step: '3',
    title: 'Professional Cleaning',
    description: 'Your garments are cleaned, pressed, and quality-checked by our experts.',
  },
  {
    step: '4',
    title: 'Delivery',
    description: 'Fresh, clean clothes delivered back to you. Pay cash or mobile money.',
  },
];

export default function Home() {
  const [trackingId, setTrackingId] = useState('');

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0000CC 0%, #0000FF 100%)',
        padding: '80px 5%',
        textAlign: 'center',
        color: 'white',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 'bold',
            marginBottom: '20px',
            lineHeight: 1.2,
          }}>
            Professional Laundry Services
          </h1>
          
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            opacity: 0.9,
            marginBottom: '40px',
            lineHeight: 1.6,
          }}>
            We take care of your clothes so you can focus on what matters most.
            <br />
            Fast, reliable, and professional service in Douala.
          </p>

          {/* Tracking Search */}
          <div style={{
            display: 'flex',
            gap: '12px',
            maxWidth: '600px',
            margin: '0 auto 30px',
            justifyContent: 'center',
          }}>
            <input
              type="text"
              placeholder="Enter your order tracking number..."
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '30px',
                border: 'none',
                fontSize: '16px',
                outline: 'none',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
            />
            <Link
              to={trackingId ? `/track?id=${trackingId}` : '/track'}
              style={{
                padding: '14px 32px',
                backgroundColor: '#FFA500',
                color: 'white',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: 'bold',
                fontSize: '16px',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}
            >
              Track Order
            </Link>
          </div>

          <Link
            to="/orders"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              backgroundColor: 'white',
              color: '#0000EE',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            Place an Order →
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section style={{ padding: '80px 5%', backgroundColor: '#F8F9FA' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
            }}>
              Our Services
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              From everyday washing to delicate dry cleaning, we handle it all with care.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px',
          }}>
            {services.map((service) => (
              <div key={service.title} style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '32px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
              }}
              >
                <div style={{
                  fontSize: '48px',
                  marginBottom: '16px',
                }}>{service.icon}</div>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '12px',
                }}>{service.title}</h3>
                <p style={{
                  color: '#6b7280',
                  lineHeight: 1.6,
                  marginBottom: '16px',
                }}>{service.description}</p>
                <div style={{
                  color: '#0000EE',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}>
                  {service.price}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={{ padding: '80px 5%', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
            }}>
              How It Works
            </h2>
            <p style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto',
            }}>
              Getting your laundry done has never been easier.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
          }}>
            {howItWorks.map((step) => (
              <div key={step.step} style={{
                textAlign: 'center',
                padding: '24px',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#0000EE',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  margin: '0 auto 20px',
                }}>
                  {step.step}
                </div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#111827',
                  marginBottom: '12px',
                }}>{step.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: 1.6 }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: '80px 5%',
        background: 'linear-gradient(135deg, #0000CC 0%, #0000FF 100%)',
        textAlign: 'center',
        color: 'white',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            marginBottom: '20px',
          }}>
            Ready to get started?
          </h2>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            marginBottom: '40px',
          }}>
            Join thousands of satisfied customers who trust Pressing237 with their laundry.
          </p>
          <Link
            to="/orders"
            style={{
              display: 'inline-block',
              padding: '16px 40px',
              backgroundColor: '#FFA500',
              color: 'white',
              borderRadius: '30px',
              textDecoration: 'none',
              fontWeight: 'bold',
              fontSize: '18px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            }}
          >
            Place Your First Order
          </Link>
        </div>
      </section>
    </div>
  );
}
