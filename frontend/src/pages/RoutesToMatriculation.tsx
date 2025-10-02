import React from 'react';
import { Link } from 'react-router-dom';
import './RoutesToMatriculation.css';
import PageHeader from '../components/PageHeader';
import routesToMatricHero from '../assets/Banners & Images/Routes_to_Matric2.png';
import cambridgeLogo from '../assets/cambridgelogo.jpg';
import pearsonLogo from '../assets/pearsonedexcellogo.jpg';
import tutorsAndExamsLogo from '../assets/tutorsandexamslogo.jpg';

interface Route {
  title: string;
  description: string;
  duration: string;
  requirements: string[];
  benefits: string[];
}

const RoutesToMatriculation: React.FC = () => {
  // Remove or comment out 'routes' if not used
  // const routes: Route[] = [
  //   {
  //     title: "Full-Time Matriculation Program",
  //     description: "Complete your matriculation through our comprehensive full-time program designed for students who can dedicate their full attention to studies.",
  //     duration: "12-18 months",
  //     requirements: [
  //       "Grade 10 completion or equivalent",
  //       "Commitment to full-time study",
  //       "Basic computer literacy",
  //       "Regular attendance"
  //     ],
  //     benefits: [
  //       "Intensive, focused learning environment",
  //       "Personalized attention from experienced educators",
  //       "Comprehensive study materials and resources",
  //       "Regular assessments and progress tracking",
  //       "University preparation and career guidance"
  //     ]
  //   },
  //   {
  //     title: "Part-Time Matriculation Program",
  //     description: "Flexible part-time program for students who need to balance studies with work or other commitments.",
  //     duration: "18-24 months",
  //     requirements: [
  //       "Grade 10 completion or equivalent",
  //       "Ability to attend classes 2-3 times per week",
  //       "Self-discipline for independent study",
  //       "Basic computer literacy"
  //     ],
  //     benefits: [
  //       "Flexible schedule to accommodate other commitments",
  //       "Same quality education as full-time program",
  //       "Access to all study materials and resources",
  //       "Online support and tutoring",
  //       "Progress at your own pace"
  //     ]
  //   },
  //   {
  //     title: "Online Matriculation Program",
  //     description: "Complete your matriculation entirely online with our state-of-the-art eLearning platform.",
  //     duration: "12-24 months",
  //     requirements: [
  //       "Grade 10 completion or equivalent",
  //       "Reliable internet connection",
  //       "Computer or tablet device",
  //       "Self-motivation and discipline"
  //     ],
  //     benefits: [
  //       "Study from anywhere, anytime",
  //       "24/7 access to learning materials",
  //       "Interactive online assessments",
  //       "Virtual tutoring and support",
  //       "Cost-effective option"
  //     ]
  //   },
  //   {
  //     title: "Accelerated Matriculation Program",
  //     description: "Fast-track your matriculation for students who want to complete their studies quickly.",
  //     duration: "6-12 months",
  //     requirements: [
  //       "Strong academic background",
  //       "Full-time availability",
  //       "High level of commitment",
  //       "Previous relevant qualifications"
  //     ],
  //     benefits: [
  //       "Complete matriculation in shortest time possible",
  //       "Intensive, focused curriculum",
  //       "Priority access to resources",
  //       "Enhanced career opportunities",
  //       "Early university admission"
  //     ]
  //   }
  // ];

  return (
    <div className="routes-to-matriculation">
      <PageHeader
        title="Routes to Matriculation"
        subtitle="Choose the pathway that best fits your lifestyle and learning preferences"
      />
      <div className="hero-image-container">
        <img src={routesToMatricHero} alt="Routes to Matriculation" className="hero-image" />
        <Link to="/start-here" className="hero-back-link">← Back to Start Here</Link>
      </div>
      
      <div className="content-section">
        <div className="container">
          <h2 className="routes-main-heading">Routes to further study (Tertiary Education)</h2>
          <h3 className="introduction-heading">Introduction:</h3>
          <p><strong>International:</strong> All courses offered by our associates are recognised by universities world wide.</p>
          <p><strong>South Africa:</strong> Matric Exemption does not guarantee acceptance into any university. Matric Exemption is required to APPLY for university entrance in South Africa. Many smaller, private universities and colleges such as Varsity College, Vega and FAFTA require only a Matric exemption. Most faculties in top universities such as UCT, Stellenbosch, WITTS and Rhodes, require more points than are achieved with the minimum requirements to achieve a Matric exemption.</p>

          <h3>Points Awarded<sup>*</sup></h3>
          <p><em>(*Be wary of APS conversions. Different Universities use different scales. The one below is a GENERIC conversion scale.)</em></p>
          <div className="points-table-wrapper">
            <table className="points-table">
              <thead>
                <tr>
                  <th>GRADE (A-E)</th>
                  <th>GRADE (9-1)</th>
                  <th>IGCSE</th>
                  <th>AS Level</th>
                  <th>A Level</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>A*</td><td>9/8</td><td>7</td><td>N/A</td><td>N/A</td></tr>
                <tr><td>A</td><td>8/7</td><td>6</td><td>7</td><td>10</td></tr>
                <tr><td>B</td><td>6/5</td><td>5</td><td>6</td><td>9</td></tr>
                <tr><td>C</td><td>5/4</td><td>4</td><td>5</td><td>8</td></tr>
                <tr><td>D</td><td>3/2</td><td>3**</td><td>4</td><td>7</td></tr>
                <tr><td>E</td><td>2/1</td><td>2**</td><td>3**</td><td>6</td></tr>
              </tbody>
            </table>
          </div>
          <p>A minimum of 5 DIFFERENT subjects are required. <strong>**</strong> These grades are below the minimum grade required for exemption and can only count as additional subjects. Matric Exemption will achieve a minimum of 24 points. (Some of the more popular universities require in excess of 38 points for Law or Medicine.)</p>

          <h3 className="route-heading">Route 1: Bachelors (Full exemption)</h3>
          <ul>
            <li>5 Subjects: 1 x IGCSE @ grade C and 4 x AS Level @ grade D</li>
            <li>At least 1 subject must be chosen from each of Groups I, II and III (see below)</li>
            <li>English Language must be taken at AS level</li>
            <li>Modern Foreign Language Required</li>
            <li>Maths IGCSE required for Business Studies and Computer Science at AS Level (and for many university courses)</li>
          </ul>

          <h3 className="route-heading">Route 2: Bachelors (Full exemption)</h3>
          <ul>
            <li>5 subjects 3 x IGCSE @ grade C and 2 x A Level @ grade E</li>
            <li>At least 1 subject must be chosen from each of Groups I, II and III (see below)</li>
          </ul>

          <h3 className="route-heading">Route 3: National Senior Certificate (Matric Pass only)</h3>
          <ul>
            <li>5 subjects 3 x IGCSE @ grade C and 2 x AS Level @ grade E</li>
            <li>English Language must be taken at AS level</li>
            <li>No other specific subject requirements</li>
          </ul>

          <h3 className="route-heading">Route 4: National Senior Certificate (Matric Pass only)</h3>
          <ul>
            <li>7 subjects 5 x IGCSE @ grade E and 2 x AS Level @ grade E</li>
            <li>No other specific subject requirements</li>
          </ul>

          <h3>Subject Choices (currently supported on our Virtual Learning Environments):</h3>
          <div className="subjects-table-wrapper">
            <table className="subjects-table">
              <thead>
                <tr>
                  <th>GROUP I</th>
                  <th>GROUP II</th>
                  <th>GROUP III</th>
                  <th>GROUP IV</th>
                  <th>GROUP V</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>English Language</td>
                  <td>Modern Foreign Language</td>
                  <td>Biology</td>
                  <td>Environmental Management</td>
                  <td>Business Studies</td>
                </tr>
                <tr>
                  <td></td>
                  <td>Afrikaans</td>
                  <td>Chemistry</td>
                  <td>Geography</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Physics</td>
                  <td>History</td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td>Maths*</td>
                  <td>Religious Education</td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
          <p><em>*We recommend students to take Mathematics at IGCSE due to the common requirements of University courses and minimum requirements for other subjects.</em></p>

          <h3>University Entrance Guides</h3>
          <p>Click on the Logos below to download the Cambridge and Pearson University Entrance Guides.</p>
          <div className="guides-logos">
            <a href="https://guerillateaching.africa/wp-content/uploads/2025/02/523166-university-recognition-south-africa.pdf" target="_blank" rel="noopener noreferrer"><img src={cambridgeLogo} alt="Cambridge Guide" className="guide-logo" /></a>
            <a href="https://guerillateaching.africa/wp-content/uploads/2025/02/Edexcel-University-Recognition-USAf.pdf" target="_blank" rel="noopener noreferrer"><img src={pearsonLogo} alt="Pearson Guide" className="guide-logo" /></a>
          </div>

          <div className="contact-tutors">
            <p><strong>Contact Tutors and Exams to find an examination center near you!</strong></p>
            <a href="https://www.tutorsandexams.co.za/" target="_blank" rel="noopener noreferrer">
              <img src={tutorsAndExamsLogo} alt="Tutors and Exams South Africa" className="guide-logo" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutesToMatriculation; 