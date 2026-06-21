import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id: string;
  garmentType: string;
  service: string;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
}

const services = [
  { name: 'Wash \u0026 Fold', price: 500 },
  { name: 'Dry Cleaning', price: 1500 },
  { name: 'Ironing / Pressing', price: 300 },
  { name: 'Stain Removal', price: 1000 },
];

export default function CreateOrder() {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [notes, setNotes] = useState('');
  const [isExpress, setIsExpress] = useState(false);

  const addItem = () => {
    setItems([...items, {
      id: Math.random().toString(36).substr(2, 9),
      garmentType: '',
      service: '',
      quantity: 1,
      unitPrice: 0,
    }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, updates: Partial<OrderItem>) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, ...updates };
        if (updates.service) {
          const service = services.find(s => s.name === updates.service);
          if (service) {
            updated.unitPrice = isExpress ? service.price * 2 : service.price;
          }
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order created successfully!');
    navigate('/orders');
  };

  return (
    <div>
      {/* Page Chrome */}
      <div style={{
        backgroundColor: '#F7F7F7',
        border: '1px solid #dee2e6',
        borderRadius: '4px 4px 0 0',
        padding: '16px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ color: '#0ED145', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          Create New Order
        </h1>
        <button
          onClick={() => navigate('/orders')}
          style={{
            padding: '8px 16px',
            border: '1px solid #ced4da',
            borderRadius: '3px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
        {/* Customer Information */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>Customer Information</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>Customer Name *</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '14px',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>Phone Number *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+237 6XX XXX XXX"
                required
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #ced4da',
                  borderRadius: '3px',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827' }}>Order Items</h2>
            <button
              type="button"
              onClick={addItem}
              style={{
                backgroundColor: '#0000EE',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              + Add Item
            </button>
          </div>

          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No items added. Click "Add Item" to get started.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {items.map((item) => (
                <div key={item.id} style={{
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  padding: '16px',
                  backgroundColor: '#F8F9FA',
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr auto', gap: '12px', alignItems: 'end' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: '#6b7280' }}>Service</label>
                      <select
                        value={item.service}
                        onChange={(e) => updateItem(item.id, { service: e.target.value })}
                        required
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          border: '1px solid #ced4da',
                          borderRadius: '3px',
                          fontSize: '14px',
                        }}
                      >
                        <option value="">Select service...</option>
                        {services.map((service) => (
                          <option key={service.name} value={service.name}>
                            {service.name} - {service.price} FCFA
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: '#6b7280' }}>Garment</label>
                      <input
                        type="text"
                        value={item.garmentType}
                        onChange={(e) => updateItem(item.id, { garmentType: e.target.value })}
                        placeholder="e.g., Shirt"
                        required
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          border: '1px solid #ced4da',
                          borderRadius: '3px',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: '#6b7280' }}>Qty</label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 1 })}
                        min="1"
                        style={{
                          width: '100%',
                          padding: '6px 10px',
                          border: '1px solid #ced4da',
                          borderRadius: '3px',
                          fontSize: '14px',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, marginBottom: '4px', color: '#6b7280' }}>Price</label>
                      <div style={{ fontWeight: 'bold', color: '#0000EE', fontSize: '16px' }}>
                        {(item.quantity * item.unitPrice).toLocaleString()} FCFA
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={{
                        padding: '6px 12px',
                        color: '#DC3545',
                        backgroundColor: 'white',
                        border: '1px solid #DC3545',
                        borderRadius: '3px',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Options */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#111827' }}>Order Options</h2>
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isExpress}
                onChange={(e) => setIsExpress(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span style={{ fontSize: '14px' }}>Express Service (2x price for same-day delivery)</span>
            </label>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, marginBottom: '6px', color: '#374151' }}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Any special instructions..."
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ced4da',
                borderRadius: '3px',
                fontSize: '14px',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {/* Total and Submit */}
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #dee2e6',
          borderRadius: '4px',
          padding: '24px',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid #dee2e6',
          }}>
            <div>
              <span style={{ color: '#6b7280', fontSize: '14px' }}>Total Items: {items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>Total Amount</div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#0000EE' }}>{calculateTotal().toLocaleString()} FCFA</div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!customerName || !customerPhone || items.length === 0}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#0000EE',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              opacity: (!customerName || !customerPhone || items.length === 0) ? 0.5 : 1,
            }}
          >
            Create Order
          </button>
        </div>
      </form>
    </div>
  );
}
