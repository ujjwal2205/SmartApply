import React from 'react';
import './CompanyScroller.css';

const logos = [
  'https://logo.clearbit.com/google.com',
  'https://logo.clearbit.com/meta.com',
  'https://logo.clearbit.com/amazon.com',
  'https://logo.clearbit.com/microsoft.com',
  'https://logo.clearbit.com/netflix.com',
  'https://logo.clearbit.com/tesla.com',
  'https://logo.clearbit.com/airbnb.com',
  'https://logo.clearbit.com/adobe.com',
  'https://logo.clearbit.com/stripe.com',
  'https://logo.clearbit.com/intel.com',
  'https://logo.clearbit.com/apple.com',
  'https://logo.clearbit.com/zomato.com',
  'https://logo.clearbit.com/uber.com',
];

function CompanyScroller() {
  return (
    <div className="company-section">
      <h2 className="company-heading">
      Get Hired by <span style={{color:'#6366f1'}}>Top Companies</span>
       </h2>
      <div className="logo-slider">
        <div className="logo-track">
          {logos.concat(logos).map((src, idx) => (
            <img src={src} alt="Company logo" key={idx} className="logo-img" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CompanyScroller;
