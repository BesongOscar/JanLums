import { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data for display
const orders = [
  { id: 'ORD-001', customer: 'Jean Dupont', items: 5, status: 'Processing', total: 12500, date: '2024-01-15' },
  { id: 'ORD-002', customer: 'Marie Claire', items: 3, status: 'Ready', total: 8000, date: '2024-01-15' },
  { id: 'ORD-003', customer: 'Paul Martin', items: 8, status: 'Pending', total: 20000, date: '2024-01-14' },
  { id: 'ORD-004', customer: 'Sarah Johnson', items: 2, status: 'Completed', total: 5500, date: '2024-01-14' },
  { id: 'ORD-005', customer: 'Michel Brown', items: 6, status: 'Processing', total: 15000, date: '2024-01-13' },
];

const statusPills = [
  { label: 'All', count: 156, color: '#0000EE' },
  { label: 'Pending', count: 23, color: '#FFA500' },
  { label: 'Processing', count: 45, color: '#0000EE' },
  { label: 'Ready', count: 38, color: '#28A745' },
  { label: 'Completed', count: 50, color: '#6C757D' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Processing': return { backgroundColor: '#FFF3CD', color: '#856404' };
    case 'Ready': return { backgroundColor: '#D4EDDA', color: '#155724' };
    case 'Pending': return { backgroundColor: '#FFF3CD', color: '#856404' };
    case 'Completed': return { backgroundColor: '#D4EDDA', color: '#155724' };
    default: return { backgroundColor: '#F8F9FA', color: '#6C757D' };
  }
};

export default function Orders() {
  const [activePill, setActivePill] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div>
      {/* Page Chrome - Gray header with green title */}
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
          Orders
        </h1>
        <Link
          to="/orders/new"
          style={{
            backgroundColor: '#0000EE',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '3px',
            textDecoration: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
          }}
        >
          + New Order
        </Link>
      </div>

      {/* Filter Band - White container with right-aligned filters */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderTop: 'none',
        padding: '20px 24px',
        marginBottom: '24px',
      }}>
        {/* Primary Filters */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '12px',
        }}>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '6px 12px',
              border: '1px solid #ced4da',
              borderRadius: '3px',
              fontSize: '14px',
              width: '200px',
            }}
          />
          <select style={{
            padding: '6px 12px',
            border: '1px solid #ced4da',
            borderRadius: '3px',
            fontSize: '14px',
          }}>
            <option>All Status</option>
            <option>Pending</option>
            <option>Processing</option>
            <option>Ready</option>
            <option>Completed</option>
          </select>
          <input
            type="date"
            style={{
              padding: '6px 12px',
              border: '1px solid #ced4da',
              borderRadius: '3px',
              fontSize: '14px',
            }}
          />
          <button style={{
            padding: '6px 16px',
            border: '1px solid #ced4da',
            borderRadius: '3px',
            backgroundColor: 'white',
            cursor: 'pointer',
            fontSize: '14px',
          }}>
            Export
          </button>
        </div>

        {/* Status Pills - Right aligned */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
        }}>
          {statusPills.map((pill) => (
            <button
              key={pill.label}
              onClick={() => setActivePill(pill.label)}
              style={{
                padding: '6px 16px',
                borderRadius: '3px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                backgroundColor: activePill === pill.label ? pill.color : `${pill.color}66`,
                color: activePill === pill.label ? 'white' : pill.color,
                opacity: activePill === pill.label ? 1 : 0.62,
                transition: 'all 0.2s',
              }}
            >
              {pill.label} ({pill.count})
            </button>
          ))}
        </div>
      </div>

      {/* Data Table - Bootstrap-like styling */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '15px',
        }}>
          <thead>
            <tr style={{ backgroundColor: '#F8F9FA' }}>
              {['Order ID', 'Customer', 'Items', 'Status', 'Total', 'Date', 'Actions'].map((header) => (
                <th key={header} style={{
                  padding: '12px 24px',
                  textAlign: 'left',
                  color: '#0000EE',
                  fontWeight: 'bold',
                  borderBottom: '2px solid #dee2e6',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr
                key={order.id}
                style={{
                  backgroundColor: index % 2 === 0 ? '#FFFFFF' : '#F2F2F2',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F0F7FF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.backgroundColor = index % 2 === 0 ? '#FFFFFF' : '#F2F2F2';
                }}
              >
                <td style={{ padding: '12px 24px', borderBottom: '1px solid #dee2e6' }}>{order.id}</td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid #dee2e6' }}>{order.customer}</td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid #dee2e6' }}>{order.items}</td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid #dee2e6' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    ...getStatusStyle(order.status),
                  }}
                  >
                    {order.status}
                  </span>
                </td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid #dee2e6' }}>{order.total.toLocaleString()} FCFA</td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid #dee2e6', color: '#6b7280' }}>{order.date}</td>
                <td style={{ padding: '12px 24px', borderBottom: '1px solid #dee2e6' }}>
                  <button style={{
                    padding: '4px 12px',
                    border: '1px solid #0000EE',
                    borderRadius: '3px',
                    backgroundColor: 'white',
                    color: '#0000EE',
                    cursor: 'pointer',
                    fontSize: '12px',
                  }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
