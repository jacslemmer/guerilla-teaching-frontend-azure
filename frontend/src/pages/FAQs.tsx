import React, { useState } from 'react';
import './FAQs.css';
import PageHeader from '../components/PageHeader';
import studentThinking from '../assets/studentthinking.png';

const faqs = [
  {
    question: 'Why Choose Guerilla Teaching?',
    answer: [
      'FLEXIBILITY - Family, friends, study - it\'s all possible.',
      'CONVENIENCE - Study on your time schedule, set your own pace, take the examination when you are ready.',
      'AFFORDABILITY - Guerilla Teaching is the most reasonably priced and best value for money option currently available.',
      'It WORKS! - Our First Cohort of Students achieve 100% A-C pass rate in IGCSE and IAS Levels.'
    ]
  },
  {
    question: 'What Makes Us Different?',
    answer: [
      'We think you can do it yourself with a little help! Relationships and trust are our unique selling points. We have been at it longer than anyone else. Yes, our content is excellent, but it is the service and support you receive that makes your learning happen.'
    ]
  },
  {
    question: 'Can I study any Subject I want?',
    answer: [
      'No, we currently only offer certain subjects at IGCSE and IAS Level, please refer to ',
      { type: 'link', text: 'this page', url: 'https://guerillateaching.africa/routes-to-matriculation/' },
      ' for the full list, and scroll down to the "Subjects Offered."'
    ]
  },
  {
    question: 'Where can I write Exams?',
    answer: [
      'For a full list of Pearson and Cambridge Exam Centers contact ',
      { type: 'link', text: 'TUTORS and EXAMS', url: 'https://www.tutorsandexams.co.za/' },
      ' directly.'
    ]
  },
  {
    question: 'Whats the difference between Pearson and Cambridge?',
    answer: [
      'They are BOTH accredited examination boards of the United Kingdom. The are BOTH accredited by USAf and SAQA for the purposes of Matric Exemption. They are BOTH accepted by Universities in South Africa and World Wide. Pearson offers some subjects Cambridge does not and vice versa. Not all exams with Pearson are offered in both May and November examination sessions. Pearson IAS Science subjects DO NOT REQUIRE PRACTICAL EXAMS. It is understood by many in education that Pearson examinations have a more practical, straightforward and applied approach, compared to Cambridge\'s more theoretical approach.',
      'It is vital that you communicate directly with Admissions Registrar of the University Department of your choice, before choosing your subjects.'
    ]
  },
  {
    question: 'Do you offer both?',
    answer: [
      'We primarily specialize in Pearson Edexcel subjects, however, IGCSE and AS Level Environmental Management, and IGCSE and AS Level Afrikaans are offered and they are only available through Cambridge. We also offer AS English Language through Cambridge as it is a popular choice.'
    ]
  },
  {
    question: 'What is the two sitting rule?',
    answer: [
      'You cannot spread your examinations out over too long a time period.',
      'The simplest way to see if you are within the rule is to consider the EARLIEST date and the MOST RECENT date on the certificates you submit to USAf for the purpose of Matric Exemption. There should be no more than 24 months between these two dates, including resits.'
    ]
  },
  {
    question: 'Can I mix and Match Pearson and Cambridge for my Matric Exam?',
    answer: [
      'Yes. International schools all offer a mix of examination boards (from AQA and OCR to Pearson and Cambridge). It is only in South Africa that schools offer only one or the other.'
    ]
  }
];

const FAQs: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="faqs">
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our teaching methods and programs"
      />
      <div className="faq-content-section">
        <img src={studentThinking} alt="Student Thinking" className="faq-hero-image" />
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`faq-item${openIndex === idx ? ' open' : ''}`}> 
              <button className="faq-question" onClick={() => toggleFAQ(idx)}>
                {faq.question}
                <span className="faq-icon">{openIndex === idx ? '−' : '+'}</span>
              </button>
              <div className="faq-answer">
                {openIndex === idx && (
                  <p>
                    {faq.answer.map((item, i) => (
                      <span key={i}>
                        {typeof item === 'string' ? item : (
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.text}
                          </a>
                        )}
                        {i < faq.answer.length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQs; 