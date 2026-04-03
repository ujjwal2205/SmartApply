import React from 'react';
import './CompanyScroller.css';

const logos = [
  'https://www.google.com/s2/favicons?sz=128&domain=google.com',
  'https://www.google.com/s2/favicons?sz=128&domain=meta.com',
  'https://www.google.com/s2/favicons?sz=128&domain=amazon.com',
  'https://www.google.com/s2/favicons?sz=128&domain=microsoft.com',
  'https://www.google.com/s2/favicons?sz=128&domain=netflix.com',
  'https://www.google.com/s2/favicons?sz=128&domain=tesla.com',
  'https://www.google.com/s2/favicons?sz=128&domain=airbnb.com',
  'https://www.google.com/s2/favicons?sz=128&domain=adobe.com',
  'https://www.google.com/s2/favicons?sz=128&domain=stripe.com',
  'https://www.google.com/s2/favicons?sz=128&domain=intel.com',
  'https://www.google.com/s2/favicons?sz=128&domain=apple.com',
  'https://www.google.com/s2/favicons?sz=128&domain=zomato.com',
  'https://www.google.com/s2/favicons?sz=128&domain=uber.com',
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
