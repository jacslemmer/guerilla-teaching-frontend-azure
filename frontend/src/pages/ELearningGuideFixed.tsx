import React, { useState, useRef, useEffect } from 'react';
import flexabilityImg from '../assets/flexability.jpg';
import independenceImg from '../assets/independence.jpg';
import responsibilityImg from '../assets/responsibility.jpg';
import eLearningLayoutImg from '../assets/e-learning layout2-three-tiangles.png';
import bloomsTaxonomyImg from '../assets/Blooms-Taxonomy-1.png';
import notepadPencilImg from '../assets/notepad-pencil-icon-Aplus.jpg';

const timelineData = [
  {
    title: 'Advantage: Flexibility',
    subtitle: 'Study anywhere, anytime',
    text: "Studying online gives you more flexibility. You can work and fit in your sport, family and other interests; even more so if you are taking an asynchronous class: an online class where you can study and interact with your instructor and fellow classmates at your own pace.",
    img: flexabilityImg,
  },
  {
    title: 'Advantage: Independence',
    subtitle: 'Flexible schedule & environment',
    text: "Taking an online course also means that you don't have to commute to class, which means less time spent on the road and more study time where you want.",
    img: independenceImg,
  },
  {
    title: 'Advantage: Responsibility',
    subtitle: 'Self-motivation & discipline',
    text: "Online learning requires you to be responsible for your own learning. You need to be self-motivated and disciplined to keep up with your studies.",
    img: responsibilityImg,
  },
];

const InteractiveChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const checklistItems = [
    "I have a clear reason for studying this course",
    "I have set specific goals for what I want to achieve",
    "I have identified my learning style and preferences",
    "I have a dedicated study space and time",
    "I have the necessary technology and internet access",
    "I understand the course requirements and assessment methods",
    "I have a support system in place",
    "I am prepared for the challenges of online learning"
  ];

  const toggleItem = (index: number) => {
    setCheckedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const completionPercentage = (checkedItems.length / checklistItems.length) * 100;

  return (
    <div style={{ 
      backgroundColor: '#f9f9f9', 
      padding: '24px', 
      borderRadius: '8px', 
      margin: '32px 0' 
    }}>
      <h3 style={{ 
        fontSize: '1.25rem', 
        fontWeight: '600', 
        marginBottom: '16px' 
      }}>
        Pre-Course Checklist
      </h3>
      <p style={{ 
        color: '#666', 
        marginBottom: '16px' 
      }}>
        Check off items as you complete them:
      </p>
      {checklistItems.map((item, index) => (
        <label 
          key={index} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            cursor: 'pointer', 
            padding: '8px', 
            borderRadius: '4px',
            marginBottom: '8px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'white'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <input
            type="checkbox"
            checked={checkedItems.includes(index)}
            onChange={() => toggleItem(index)}
            style={{ 
              width: '20px', 
              height: '20px', 
              accentColor: '#7c3aed' 
            }}
          />
          <span>{item}</span>
        </label>
      ))}
      <div style={{ 
        marginTop: '16px', 
        padding: '12px', 
        backgroundColor: '#f3e8ff', 
        borderRadius: '4px' 
      }}>
        <p style={{ 
          color: '#7c3aed', 
          fontWeight: '600' 
        }}>
          Progress: {Math.round(completionPercentage)}% Complete
        </p>
        <div style={{ 
          width: '100%', 
          backgroundColor: '#ddd6fe', 
          borderRadius: '9999px', 
          height: '8px', 
          marginTop: '8px' 
        }}>
          <div
            style={{ 
              backgroundColor: '#7c3aed', 
              height: '8px', 
              borderRadius: '9999px', 
              width: `${completionPercentage}%`,
              transition: 'width 0.3s ease'
            }}
          />
        </div>
      </div>
    </div>
  );
};

const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      borderRadius: '8px', 
      overflow: 'hidden', 
      marginBottom: '24px' 
    }}>
      <button
        onClick={onToggle}
        style={{ 
          width: '100%', 
          padding: '16px 24px', 
          textAlign: 'left', 
          backgroundColor: '#faf5ff', 
          border: 'none', 
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3e8ff'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#faf5ff'}
      >
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: '#581c87', 
          margin: 0 
        }}>
          {title}
        </h3>
        <span style={{ 
          fontSize: '1.5rem', 
          color: '#581c87' 
        }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      {isOpen && (
        <div style={{ 
          padding: '24px', 
          backgroundColor: 'white' 
        }}>
          {children}
        </div>
      )}
    </div>
  );
};

const ELearningGuideFixed: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (sectionId: string) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      backgroundColor: 'white', 
      color: '#111827' 
    }}>
      {/* Hero Section */}
      <section style={{ 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        paddingTop: '32px', 
        paddingBottom: '16px', 
        background: 'linear-gradient(to bottom, #faf5ff, white)' 
      }}>
        <h2 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: '#7c3aed', 
          textAlign: 'center', 
          marginBottom: '4px' 
        }}>
          The KEYS to Success:
        </h2>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '300', 
          textAlign: 'center', 
          marginBottom: '8px', 
          textTransform: 'uppercase', 
          color: 'black', 
          letterSpacing: '0.05em',
          lineHeight: '1.2'
        }}>
          Your Guide to Effective<br />
          Online Learning
        </h1>
        <p style={{ 
          color: '#666', 
          textAlign: 'center', 
          maxWidth: '512px', 
          padding: '0 16px' 
        }}>
          Master the art of online learning with our comprehensive guide
        </p>
      </section>

      {/* Interactive Checklist */}
      <section style={{ 
        maxWidth: '896px', 
        margin: '0 auto', 
        padding: '0 16px 32px' 
      }}>
        <InteractiveChecklist />
      </section>

      {/* Main Content */}
      <section style={{ 
        maxWidth: '896px', 
        margin: '0 auto', 
        padding: '0 16px 32px' 
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '300', 
          textAlign: 'center', 
          marginBottom: '24px', 
          textTransform: 'uppercase', 
          color: 'black', 
          letterSpacing: '0.05em' 
        }}>
          Why choose e-Learning?
        </h2>

        <div>
          <ol style={{ 
            listStyle: 'decimal', 
            listStylePosition: 'inside', 
            color: '#374151',
            lineHeight: '1.8',
            marginBottom: '32px'
          }}>
            <li>Traditional schools are designed on an outdated Victorian model designed to produce factory workers trained to respond to routine and crush their spirit.</li>
            <li>Studies show that High School negatively affects the well-being of a significant number of students.</li>
            <li>The success of distance or eLearning is reflected in the massive increase in numbers of those choosing to learn online.</li>
            <li>The support we offer and the methods we use are designed to reflect the latest and best thinking in effective online learning.</li>
            <li style={{ fontStyle: 'italic', color: '#666' }}>…well we think the first four points should be enough to convince anyone…but if you are still not convinced…</li>
          </ol>

          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            margin: '16px 0' 
          }}>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '32px', 
              justifyContent: 'center', 
              alignItems: 'center' 
            }}>
              {timelineData.map((item, index) => (
                <div 
                  key={index} 
                  style={{ 
                    textAlign: 'center', 
                    maxWidth: '250px' 
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ 
                      width: '200px', 
                      height: '150px', 
                      objectFit: 'cover', 
                      borderRadius: '8px', 
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                    }}
                  />
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '600', 
                    margin: '12px 0 8px', 
                    color: '#7c3aed' 
                  }}>
                    {item.title}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#666', 
                    lineHeight: '1.5' 
                  }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ color: '#374151', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '16px' }}>
              Many issues are the same: Time, money, socialising, relationships with others in the course, getting hold of resources, the excitement of learning new things, changing attitudes, learning difficulties, deadlines and achieving your goals.
            </p>

            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginBottom: '16px'
            }}>
              The e-Learning Advantage
            </h3>

            <div style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              margin: '16px 0' 
            }}>
              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '32px', 
                justifyContent: 'center', 
                alignItems: 'center' 
              }}>
                <img
                  src={eLearningLayoutImg}
                  alt="E-Learning Layout"
                  style={{ 
                    maxWidth: '512px', 
                    width: '100%', 
                    height: 'auto', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' 
                  }}
                />
              </div>
            </div>

            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginTop: '32px',
              marginBottom: '16px'
            }}>
              What you are learning and what you are not!
            </h3>

            <p>
              Now don't kid your self – this is eLearning and you wont get any psycho motor development here…except for typing…not much of a physical activity really. Cognitive and effective skills however, yes indeed.
            </p>
            
            <p style={{ marginTop: '16px' }}>
              Cognitive is to do with thinking abilities: comprehending and understanding information – what you know and what you do with that knowledge. We try to reach you in all sorts of different ways – what is called accelerated blended learning, using several different media to reach a variety of learning styles. Effective skills are attitudes and approaches, and we will certainly develop those – well, this particular approach to e learning sets out to do this.
            </p>

            <p style={{ 
              fontWeight: 'bold', 
              color: 'black', 
              marginTop: '8px' 
            }}>
              Bloom et al (1956) classified the outcomes of learning into 3 areas or DOMAINS.
            </p>

            <div style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              margin: '16px 0' 
            }}>
              <img
                src={bloomsTaxonomyImg}
                alt="Bloom's Taxonomy"
                style={{ 
                  maxWidth: '512px', 
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'contain', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                  border: '1px solid #e5e7eb' 
                }}
              />
            </div>

            <div style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              margin: '32px 0' 
            }}>
              <img
                src={notepadPencilImg}
                alt="Study Tools"
                style={{ 
                  maxWidth: '256px', 
                  width: '100%', 
                  height: 'auto', 
                  objectFit: 'contain', 
                  borderRadius: '8px', 
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
                  border: '1px solid #e5e7eb' 
                }}
              />
            </div>

            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginTop: '32px',
              marginBottom: '16px'
            }}>
              Look at the cognitive pyramid above.
            </h3>

            <p style={{ marginBottom: '16px' }}>
              Knowledge is at the bottom, the foundation, but it is not the end goal. The goal is to be able to think about what you have learnt and apply it to new situations. This is called higher order thinking and it is what the examiners are looking for in the top grades.
            </p>

            <p style={{ marginBottom: '16px' }}>
              The affective domain is not often dealt with by simple distance learning courses. However, we want to instill a love of learning and a boundless curiosity in our students. We want them to look in wonder at at the world and believe that they are capable of anything thing they put their mind to. These ATTITUDES and VALUES must first be identified by their presence or absence, then encourage their adoption and then make them part of your everyday, normal response.
            </p>

            <p style={{ 
              fontWeight: 'bold', 
              color: 'black', 
              marginTop: '8px' 
            }}>
              You must aim to attain the highest leaves of this domain and all the courses will help guide you in this effort.
            </p>

            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginTop: '32px',
              marginBottom: '16px'
            }}>
              Assessment
            </h3>

            <p style={{ marginBottom: '16px' }}>
              Assessment for any course is the measurement of your achievement of the learning outcomes. IGCSE requires knowledge, comprehension, application and analysis. For AS Level both synthesis and evaluation will also be required. Always look at the PAST PAPERS provided at the start of each course to check where you are going.
            </p>

            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginTop: '32px',
              marginBottom: '16px'
            }}>
              Summary & Conclusion
            </h3>

            <p style={{ marginBottom: '16px' }}>
              This guide will help you clear your head, get organized and charge confidently into your course. It will give you the skills to become an effective e learner.
            </p>
          </div>
        </div>
      </section>

      {/* Collapsible Sections */}
      <section style={{ 
        maxWidth: '896px', 
        margin: '0 auto', 
        padding: '0 16px 32px' 
      }}>
        <CollapsibleSection
          title="First Steps: Preparing for e learning"
          isOpen={openSection === 'first-steps'}
          onToggle={() => toggleSection('first-steps')}
        >
          <div style={{ color: '#374151', lineHeight: '1.8' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              First Steps: Preparing for e learning
            </h3>
            <p style={{ marginBottom: '16px' }}>
              This guide will help you clear your head, get organized and charge confidently into your course. It will give you the skills to become an effective e learner.
            </p>
            <p style={{ 
              fontStyle: 'italic', 
              textAlign: 'right',
              marginBottom: '16px'
            }}>
              Guerillateaching 2014
            </p>

            <div style={{ 
              backgroundColor: '#f3e8ff', 
              borderLeft: '4px solid #7c3aed', 
              padding: '16px', 
              borderRadius: '4px', 
              marginBottom: '16px' 
            }}>
              <p style={{ marginBottom: '8px' }}>
                Self-motivation isn't easy. Goals are your driving force. You know why you want to study, but effective learning is also knowing what you want to study.
              </p>
              <p style={{ fontStyle: 'italic' }}>
                "Motivation without strategy is pointless!"
              </p>
              <p style={{ 
                fontStyle: 'italic', 
                textAlign: 'right' 
              }}>
                Guerillateaching 2014
              </p>
            </div>

            <p style={{ marginBottom: '16px' }}>
              Many personal qualities and skills are needed for studying at a distance, and many are the same as those required by any learner. But some have more importance as a distance learner.
            </p>

            <p style={{ marginBottom: '16px' }}>
              Remember the REFLECTION and REVIEW are vital to any real learning. So at the end of this process return to this exercise to see if you have any more to add.
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Know Yourself: Understanding Your Learning Style"
          isOpen={openSection === 'know-yourself'}
          onToggle={() => toggleSection('know-yourself')}
        >
          <div style={{ color: '#374151', lineHeight: '1.8' }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginBottom: '16px'
            }}>
              Know Thyself
            </h3>
            <p style={{ marginBottom: '16px' }}>
              This chapter is designed to make you think about how YOU learn.
            </p>

            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginTop: '32px',
              marginBottom: '16px'
            }}>
              What is Studying?
            </h3>
            <p style={{ marginBottom: '16px' }}>
              Studying is simply the process by which you learn. It is hard, but should be fun. There are rewards, both extrinsic (getting a better job) and intrinsic (feeling good, knowing more).
            </p>

            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: '#7c3aed',
              marginTop: '32px',
              marginBottom: '16px'
            }}>
              What is Learning?
            </h3>
            <p style={{ marginBottom: '16px' }}>
              Learning is the process of acquiring new understanding, knowledge, behaviors, skills, values, attitudes, and preferences. The ability to learn is possessed by humans, animals, and some machines; there is also evidence for some kind of learning in certain plants.
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Study Environment & Time Management"
          isOpen={openSection === 'study-environment'}
          onToggle={() => toggleSection('study-environment')}
        >
          <div style={{ color: '#374151', lineHeight: '1.8' }}>
            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#7c3aed',
              marginBottom: '16px'
            }}>
              Where to study
            </h4>
            <p style={{ marginBottom: '16px' }}>
              Find a quiet, comfortable place where you can concentrate. This should be a place where you can spread out your materials and won't be interrupted.
            </p>

            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#7c3aed',
              marginTop: '32px',
              marginBottom: '16px'
            }}>
              When to study
            </h4>
            <p style={{ marginBottom: '16px' }}>
              Find the time of day when you are most alert and able to concentrate. Some people are morning people, others are night owls. Work with your natural rhythms.
            </p>

            <div style={{ 
              backgroundColor: '#fef3c7', 
              borderLeft: '4px solid #f59e0b', 
              padding: '16px', 
              borderRadius: '4px', 
              marginBottom: '16px' 
            }}>
              <p>
                <strong>Time Management Tip:</strong> Keep alert while you're studying. The amount of attention you give a subject is as important as the amount of time you spend. The more alert you are while studying, the more you'll learn.
              </p>
            </div>

            <h4 style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: '#7c3aed',
              marginTop: '32px',
              marginBottom: '16px'
            }}>
              Time Management
            </h4>
            <p style={{ marginBottom: '16px' }}>
              Take frequent rest breaks. The specialists say you'll get your most effective studying done if you take a 10-minute break between subjects.
            </p>
          </div>
        </CollapsibleSection>
      </section>
    </div>
  );
};

export default ELearningGuideFixed;
