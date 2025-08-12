import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Header from '../../components/Header/Header';
import CompanyScroller from '../../components/CompanyScroller/CompanyScroller';
import WhySmartApply from '../../components/Why_Smart_Apply/WhySmartApply';
import MiniAbout from '../../components/MiniAbout/MiniAbout';

function Home({login}) {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay for DOM readiness
      }
    }
  }, [location]);

  return (
    <div>
      <Header login={login}/>
      <CompanyScroller />
        <WhySmartApply />
      <MiniAbout />
    </div>
  );
}

export default Home;
