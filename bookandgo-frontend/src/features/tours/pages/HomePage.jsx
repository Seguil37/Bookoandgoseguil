// src/features/tours/pages/HomePage.jsx

import HeroSection from '../components/HeroSection';
import WhyUsSection from '../components/WhyUsSection';
import CTASection from '../components/CTASection';
import PopularLocationsSection from '../components/PopularLocationsSection';
import FeaturedToursSection from '../components/FeaturedToursSection';
import PopularCountriesSection from '../components/PopularCountriesSection';
import ReferenceContentSection from '../components/ReferenceContentSection';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <WhyUsSection />
      <CTASection />
      <PopularLocationsSection />
      <FeaturedToursSection />
      <PopularCountriesSection />
      <ReferenceContentSection />
    </div>
  );
};

export default HomePage;