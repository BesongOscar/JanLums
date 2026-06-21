import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/track', label: 'Track Order' },
  { path: '/orders', label: 'My Orders' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const isLoggedIn = false; // TODO: Implement auth

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      {/* Header - Gradient like Passenger Web */}
      <header style={{
        background: 'linear-gradient(135deg, #0000CC 0%, #0000FF 100%)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 5%',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Logo */}
          <Link to="/" style={{
            color: 'white',
            textDecoration: 'none',
            fontSize: '24px',
            fontWeight: 'bold',
          }}>
            Pressing<span style={{ color: '#FFA500' }}>237</span>
          </Link>

          {/* Navigation */}
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  color: 'white',
                  textDecoration: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  opacity: location.pathname === item.path ? 1 : 0.85,
                  borderBottom: location.pathname === item.path ? '2px solid white' : 'none',
                  paddingBottom: '4px',
                }}
              >
                {item.label}
              </Link>
            ))}

            {/* User menu or Login button */}
            {isLoggedIn ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255,255,255,0.15)',
                    border: '1.5px solid rgba(255,255,255,0.4)',
                    borderRadius: '20px',
                    padding: '6px 16px',
                    color: 'white',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#FFA500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}>
                    A
                  </div>
                  <span>Account ▼</span>
                </button>

                {userMenuOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '100%',
                    marginTop: '8px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    minWidth: '180px',
                    overflow: 'hidden',
                  }}>
                    <div style={{ padding: '8px 0' }}>
                      <Link to="/profile" style={{
                        display: 'block',
                        padding: '10px 16px',
                        color: '#333',
                        textDecoration: 'none',
                        fontSize: '14px',
                      }}>
                        Profile
                      </Link>
                      <Link to="/orders" style={{
                        display: 'block',
                        padding: '10px 16px',
                        color: '#333',
                        textDecoration: 'none',
                        fontSize: '14px',
                      }}>
                        My Orders
                      </Link>
                      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '8px 0' }} />
                      <button style={{
                        display: 'block',
                        width: '100%',
                        padding: '10px 16px',
                        color: '#DC3545',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontSize: '14px',
                      }}>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" style={{
                backgroundColor: 'white',
                color: '#0000EE',
                padding: '8px 20px',
                borderRadius: '20px',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
              }}>
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer - Dark slate like Passenger Web */}
      <footer style={{
        backgroundColor: '#2C3E50',
        color: 'white',
        padding: '40px 5%',
        marginTop: '60px',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
        }}>
          <div>
            <h3 style={{ marginBottom: '16px', fontSize: '20px' }}>
              Pressing<span style={{ color: '#FFA500' }}>237</span>
            </h3>
            <p style={{ color: '#B0BEC5', fontSize: '14px', lineHeight: '1.6' }}>
              Professional laundry services in Cameroon. Fast, reliable, and convenient.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Services</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Express Service'].map((item) => (
                <li key={item} style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '14px' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['About Us', 'Contact', 'Careers', 'Blog'].map((item) => (
                <li key={item} style={{ marginBottom: '8px' }}>
                  <a href="#" style={{ color: '#B0BEC5', textDecoration: 'none', fontSize: '14px' }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '16px', fontSize: '16px' }}>Contact</h4>
            <p style={{ color: '#B0BEC5', fontSize: '14px', marginBottom: '8px' }}>📍 Douala, Cameroon</p>
            <p style={{ color: '#B0BEC5', fontSize: '14px', marginBottom: '8px' }}>📞 +237 6XX XXX XXX</p>
            <p style={{ color: '#B0BEC5', fontSize: '14px' }}>✉️ info@pressing237.com</p>
          </div>
        </div>
        
        <div style={{
          maxWidth: '1400px',
          margin: '40px auto 0',
          paddingTop: '20px',
          borderTop: '1px solid #34495E',
          textAlign: 'center',
          color: '#B0BEC5',
          fontSize: '14px',
        }}>
          © 2024 Pressing237. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
