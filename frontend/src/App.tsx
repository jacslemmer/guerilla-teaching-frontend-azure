import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
// TEMPORARILY REMOVED TO FIX SCROLL CONFLICTS
// import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import StartHere from './pages/StartHere';
import FAQs from './pages/FAQs';
import RoutesToMatriculation from './pages/RoutesToMatriculation';
import ELearningGuide from './pages/ELearningGuide';
import ELearningGuideFixed from './pages/ELearningGuideFixed';
import Pricing2025 from './pages/Pricing2025';
import LearningPortal from './pages/LearningPortal';
import InternationalGCSE from './pages/InternationalGCSE';
import InternationalASLevels from './pages/InternationalASLevels';
import IGCSEQuoteCourses from './pages/IGCSEQuoteCourses';
import ASLevelQuoteCourses from './pages/ASLevelQuoteCourses';
import GCSEcourses from './pages/GCSEcourses';
import IGCSECoursesGrid from './pages/IGCSECoursesGrid';
import IGCSECourseDetail from './pages/IGCSECourseDetail';
import ASLevelCourses from './pages/ASLevelCourses';
import Resources from './pages/Resources';
import Articles from './pages/Articles';
import Webinars from './pages/Webinars';
import CanWeHelp from './pages/CanWeHelp';
import QuoteCart from './pages/QuoteCart';
import Checkout from './pages/Checkout';

import AdminQuotes from './pages/AdminQuotes';
import AboutUs from './pages/AboutUs';
import OurEthos from './pages/OurEthos';
import OurClients from './pages/OurClients';
import BlogDetail from './pages/BlogDetail';

function App() {
  return (
    <Router>
      {/* TEMPORARILY REMOVED TO FIX SCROLL CONFLICTS */}
      {/* <ScrollToTop /> */}
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/about-us/our-ethos" element={<OurEthos />} />
            <Route path="/about-us/our-clients" element={<OurClients />} />
            <Route path="/start-here" element={<StartHere />} />
            <Route path="/start-here/faqs" element={<FAQs />} />
            <Route path="/start-here/routes" element={<RoutesToMatriculation />} />
            <Route path="/start-here/elearning" element={<ELearningGuideFixed />} />
            <Route path="/shop" element={<Pricing2025 />} />
            <Route path="/learning-portal" element={<LearningPortal />} />
            <Route path="/learning-portal/igcse" element={<InternationalGCSE />} />
            <Route path="/learning-portal/as-levels" element={<InternationalASLevels />} />
            <Route path="/learning-portal/igcse/courses" element={<IGCSECoursesGrid />} />
            <Route path="/learning-portal/igcse/courses/:courseId" element={<IGCSECourseDetail />} />
            <Route path="/learning-portal/as-levels/courses" element={<ASLevelCourses />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resources/articles" element={<Articles />} />
            <Route path="/resources/webinars" element={<Webinars />} />
            <Route path="/resources/articles/:id" element={<BlogDetail />} />
            <Route path="/can-we-help" element={<CanWeHelp />} />
            <Route path="/quote-cart" element={<QuoteCart />} />
            <Route path="/request-quote" element={<Checkout />} />

            <Route path="/admin/quotes" element={<AdminQuotes />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App; 