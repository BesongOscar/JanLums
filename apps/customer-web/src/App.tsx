import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track" element={<div style={{ padding: '40px 5%', maxWidth: '1400px', margin: '0 auto' }}><h2>Track Your Order</h2></div>} />
        <Route path="/orders" element={<div style={{ padding: '40px 5%', maxWidth: '1400px', margin: '0 auto' }}><h2>My Orders</h2></div>} />
        <Route path="/profile" element={<div style={{ padding: '40px 5%', maxWidth: '1400px', margin: '0 auto' }}><h2>Profile</h2></div>} />
      </Routes>
    </Layout>
  );
}

export default App;
