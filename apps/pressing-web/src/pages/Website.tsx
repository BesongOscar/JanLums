import { useState } from 'react';
import { useToast } from '../components/ui/Toast';

const sections = [
  { id: 'hero', label: 'Hero Banner', fields: ['Headline', 'Subheadline', 'CTA Text', 'Background Image'] },
  { id: 'services', label: 'Service Descriptions', fields: ['Wash & Fold', 'Wash & Iron', 'Dry Cleaning', 'Express Service'] },
  { id: 'pricing', label: 'Pricing Display', fields: ['Per-Kilo Rates', 'Per-Item Rates', 'Flat Rate Packages'] },
  { id: 'faq', label: 'FAQ', fields: ['Question 1', 'Answer 1', 'Question 2', 'Answer 2'] },
  { id: 'testimonials', label: 'Testimonials', fields: ['Customer 1 Name', 'Customer 1 Review', 'Customer 2 Name', 'Customer 2 Review'] },
  { id: 'contact', label: 'Contact Info', fields: ['Phone', 'Email', 'Address', 'Social Media Links'] },
  { id: 'seo', label: 'SEO', fields: ['Meta Title', 'Meta Description', 'Keywords'] },
];

const faqData = [
  { question: 'What are your operating hours?', answer: 'Monday–Saturday, 7:00 AM – 8:00 PM' },
  { question: 'Do you offer pickup and delivery?', answer: 'Yes, we offer free pickup and delivery within our service zones.' },
  { question: 'How long does it take?', answer: 'Standard service: 48 hours. Express: 24 hours. Same-day available on request.' },
];

const testimonials = [
  { name: 'Marie N.', content: 'Best laundry service in town! My clothes always come back perfectly pressed and folded.' },
  { name: 'Jean-Pierre K.', content: 'The pickup and delivery service is a lifesaver. Highly professional team.' },
];

export default function Website() {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState('hero');
  const [editFaq, setEditFaq] = useState(false);

  return (
    <div>
      <div className="page-chrome">
        <h1 className="page-title">Website Content</h1>
        <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Preview Website</button>
      </div>

      <div className="bg-white border border-neutral-200 border-t-0 px-6 py-5 mb-6">
        <div className="flex gap-3">
          {sections.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)}
              className={`px-4 py-1.5 rounded text-xs font-bold border-none cursor-pointer capitalize ${activeSection === s.id ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>{s.label}</button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm">
        <div className="px-6 py-5 border-b border-neutral-200">
          <h2 className="text-base font-bold text-neutral-800 capitalize">{sections.find(s => s.id === activeSection)?.label}</h2>
          <p className="text-xs text-neutral-400 mt-1">Manage website content for this section</p>
        </div>

        {activeSection === 'hero' && (
          <div className="p-6 space-y-4">
            {['Headline', 'Subheadline', 'CTA Button Text'].map(f => (
              <div key={f}>
                <label className="block text-sm font-medium text-neutral-700 mb-1">{f}</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder={`Enter ${f.toLowerCase()}`} defaultValue={f === 'Headline' ? 'Professional Laundry & Dry Cleaning' : f === 'Subheadline' ? 'We pick up, clean, and deliver — so you don\'t have to.' : 'Get Started'} />
              </div>
            ))}
          </div>
        )}

        {activeSection === 'faq' && (
          <div className="p-6 space-y-4">
            {faqData.map((faq, i) => (
              <div key={i} className="border border-neutral-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-neutral-800">{faq.question}</span>
                  <button className="text-danger text-xs border-none bg-transparent cursor-pointer">Remove</button>
                </div>
                <p className="text-sm text-neutral-600">{faq.answer}</p>
              </div>
            ))}
            <button onClick={() => setEditFaq(true)}
              className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add FAQ</button>
          </div>
        )}

        {activeSection === 'testimonials' && (
          <div className="p-6 space-y-4">
            {testimonials.map((t, i) => (
              <div key={i} className="border border-neutral-200 rounded p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-sm text-neutral-800">{t.name}</span>
                  <button className="text-danger text-xs border-none bg-transparent cursor-pointer">Remove</button>
                </div>
                <p className="text-sm text-neutral-600">&ldquo;{t.content}&rdquo;</p>
              </div>
            ))}
            <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">+ Add Testimonial</button>
          </div>
        )}

        {activeSection !== 'hero' && activeSection !== 'faq' && activeSection !== 'testimonials' && (
          <div className="p-6 space-y-4">
            {(sections.find(s => s.id === activeSection)?.fields || []).map(f => (
              <div key={f}>
                <label className="block text-sm font-medium text-neutral-700 mb-1">{f}</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder={`Enter ${f.toLowerCase()}`} />
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-4 border-t border-neutral-200 flex justify-end gap-3">
          <button className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Reset</button>
          <button className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Save Changes</button>
        </div>
      </div>

      {editFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-neutral-800">Add FAQ</h2>
              <button onClick={() => setEditFaq(false)}
                className="text-neutral-400 hover:text-neutral-600 text-xl leading-none border-none bg-transparent cursor-pointer">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Question</label>
                <input className="w-full px-3 py-2 border border-neutral-300 rounded text-sm" placeholder="Enter the question" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Answer</label>
                <textarea className="w-full px-3 py-2 border border-neutral-300 rounded text-sm min-h-[80px]" placeholder="Enter the answer" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setEditFaq(false)}
                className="px-4 py-2 border border-neutral-300 rounded text-sm bg-white cursor-pointer hover:bg-neutral-50">Cancel</button>
              <button onClick={() => { showToast('FAQ added', 'success'); setEditFaq(false); }}
                className="px-4 py-2 bg-primary text-white rounded text-sm font-bold border-none cursor-pointer hover:bg-primary-dark">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
