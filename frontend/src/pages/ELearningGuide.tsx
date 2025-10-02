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

  return (
    <div className="bg-gray-50 p-6 rounded-lg my-8">
      <h3 className="text-xl font-semibold font-montserrat mb-4">Pre-Course Checklist</h3>
      <p className="text-gray-600 mb-4">Check off items as you complete them:</p>
      <div className="space-y-3">
        {checklistItems.map((item, index) => (
          <label key={index} className="flex items-center space-x-3 cursor-pointer hover:bg-white p-2 rounded transition-colors">
            <input
              type="checkbox"
              checked={checkedItems.includes(index)}
              onChange={() => toggleItem(index)}
              className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
            />
            <span className={`${checkedItems.includes(index) ? 'line-through text-gray-500' : 'text-gray-700'}`}>
              {item}
            </span>
          </label>
        ))}
      </div>
      <div className="mt-4 p-3 bg-purple-100 rounded">
        <p className="text-purple-800 font-semibold">
          Progress: {checkedItems.length}/{checklistItems.length} items completed
        </p>
        <div className="w-full bg-purple-200 rounded-full h-2 mt-2">
          <div 
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(checkedItems.length / checklistItems.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const CollapsibleSection: React.FC<{
  title: string;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ title, children, isExpanded, onToggle }) => {
  return (
    <div className="border border-purple-100 rounded-lg overflow-hidden mb-6">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left bg-purple-50 hover:bg-purple-100 transition-colors duration-200 flex justify-between items-center group"
      >
        <h3 className="text-xl font-semibold font-montserrat text-purple-900 group-hover:text-purple-700">
          {title}
        </h3>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 text-purple-600 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isExpanded && (
        <div className="p-6 bg-white">
          {children}
        </div>
      )}
    </div>
  );
};

const ELearningGuide: React.FC = () => {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="font-sans bg-white text-gray-900">
      {/* Hero Section */}
      <section className="w-full flex flex-col items-center pt-8 pb-4 bg-gradient-to-b from-purple-50 to-white">
        <h2 className="text-base md:text-lg font-semibold text-purple-700 text-center mb-1">The KEYS to Success:</h2>
        <h1 className="text-3xl md:text-4xl font-light font-montserrat text-center mb-2 uppercase text-black tracking-wide">
          The Advantages and Challenges of<br />
          Online Learning
        </h1>
        <p className="text-gray-600 text-center max-w-2xl px-4">
          Master the art of distance learning with our comprehensive guide designed to help you succeed in your online education journey.
        </p>
      </section>

      {/* Interactive Checklist */}
      <section className="mx-auto py-6 px-4">
        <InteractiveChecklist />
      </section>

      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-3xl md:text-4xl font-light font-montserrat text-center mb-6 uppercase text-black tracking-wide">
          Your Guide to Effective<br />
          Distance Learning
        </h2>

        {/* 1. Before you start */}
        <CollapsibleSection
          title="Before you start"
          isExpanded={openSection === 'before-start'}
          onToggle={() => setOpenSection(openSection === 'before-start' ? null : 'before-start')}
        >
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li className="leading-relaxed">Traditional schools are designed on an outdated Victorian model designed to produce factory workers trained to respond to routine and crush their spirit.</li>
            <li className="leading-relaxed">Studies show that High School negatively affects the well-being of a significant number of students.</li>
            <li className="leading-relaxed">The success of distance or eLearning is reflected in the massive increase in numbers of those choosing to learn online.</li>
            <li className="leading-relaxed">The support we offer and the methods we use are designed to reflect the latest and best thinking in effective online learning.</li>
            <li className="leading-relaxed italic text-gray-600">…well we think the first four points should be enough to convince anyone…but if you are still not convinced…</li>
          </ol>
          <div className="w-full flex justify-center my-4">
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/zDZFcDGpL4U"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full max-w-2xl h-72 rounded-lg shadow-lg"
            ></iframe>
          </div>
        </CollapsibleSection>

        {/* 2. What is eLearning? */}
        <CollapsibleSection
          title="What is eLearning?"
          isExpanded={openSection === 'what-is-elearning'}
          onToggle={() => setOpenSection(openSection === 'what-is-elearning' ? null : 'what-is-elearning')}
        >
          <div className="space-y-6 text-gray-700">
            {/* Introduction */}
            <h3 className="text-xl font-bold text-purple-700">Introduction</h3>
            <p>Are you in a classroom, in a school, facing a teacher?</p>
            <p>No?</p>
            <p>Are you learning, researching, enquiring, investigating, gaining new knowledge, understanding and skills along the way?</p>
            <p>Yes?</p>
            <p>Then you are engaged in elearning!</p>
            <p>If a traditional learning environment or "school" is not for you – for whatever reason – you live too far away, or it costs too much, or because of bullying or you are a actor or professional sports person on set or on tour, or simply due to the mind-numbing, spirit crushing tedium of it all, then elearning or distance learning is for you.</p>
            <p>Millions of people all around the world have successfully completed courses of study both through elearning or "blended" learning (elearning with some elements of the course done face to face.)</p>
            <p>This guide is meant to give you a head start, to encourage you and inform you of the potential difficulties and suggest ways to overcome them. Firstly remember:</p>
            <p>Many issues are the same: Time, money, socialising, relationships with others in the course, getting hold of resources, the excitement of learning new things, changing attitudes, learning difficulties, deadlines and achieving your goals.</p>

            {/* The e-Learning Advantage Video */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">The e-Learning Advantage</h3>
            <div className="w-full flex justify-center my-4">
              <iframe
                width="560"
                height="315"
                src="https://www.youtube.com/embed/nzV1NmhC7ik"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full max-w-2xl h-72 rounded-lg shadow-lg"
              ></iframe>
            </div>

            {/* What you are learning and what you are not! */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">What you are learning and what you are not!</h3>
            <p className="mt-2">What you learn will be determined by the subject you choose and what you should know by the end of the course is spelled out in the learning objectives and the aims of the course.</p>
            <p className="font-bold text-black mt-2">Bloom et al (1956) classified the outcomes of learning into 3 areas or DOMAINS.</p>
            <div className="w-full flex justify-center my-4">
              <img
                src={eLearningLayoutImg}
                alt="E-learning layout - three triangles"
                className="w-full max-w-2xl object-contain rounded-lg shadow-lg border border-purple-200"
              />
            </div>
            <p>Now don't kid your self – this is eLearning and you wont get any psycho motor development here…except for typing…not much of a physical activity really. Cognitive and effective skills however, yes indeed.</p>
            <p>Cognitive is to do with thinking abilities: comprehending and understanding information – what you know and what you do with that knowledge. We try to reach you in all sorts of different ways – what is called accelerated blended learning, using several different media to reach a variety of learning styles. Effective skills are attitudes and approaches, and we will certainly develop those – well, this particular approach to e learning sets out to do this.</p>
            <div className="w-full flex justify-center my-8">
              <img
                src={bloomsTaxonomyImg}
                alt="Bloom's Taxonomy JPEG"
                className="w-full max-w-xl object-contain rounded-lg shadow-lg border border-purple-200"
              />
            </div>

            {/* Look at the cognitive pyramid above. */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">Look at the cognitive pyramid above.</h3>
            <ul className="list-disc list-inside ml-6">
              <li>The lowest level is <b>knowledge</b> – you can recall facts. Read the information and use the STUDY SKILLS course to find out how best to learn and recall these facts.</li>
              <li>Then comes <b>comprehension</b> – you can recall AND understand the significance of what you have learned. Answer the questions and complete the quizzes.</li>
              <li><b>Application</b>: you can use the knowledge and understanding to write longer answers and be able to explain more complex ideas.</li>
              <li><b>Analysis</b> – you can take a whole bunch of different sources and find connections and meaning from them.</li>
              <li><b>Synthesis</b> – you can take all this information and create new meaning for your self.</li>
              <li><b>Evaluation</b> – you can compare and contrast information and judge the significance and value of what has been learned.</li>
            </ul>
            <p className="font-bold text-black mt-2">You must aim to attain the highest leaves of this domain and all the courses will help guide you in this effort.</p>
            <p>The affective domain is not often dealt with by simple distance learning courses. However, we want to instill a love of learning and a boundless curiosity in our students. We want them to look in wonder at at the world and believe that they are capable of anything thing they put their mind to. These ATTITUDES and VALUES must first be identified by their presence or absence, then encourage their adoption and then make them part of your everyday, normal response.</p>
            <p>From unconscious incompetent, to conscious incompetent, to conscious competent, to unconscious competent.</p>
            <p>Got it?</p>
            <p>Good.</p>
            <p>Your attitude must develop from accepting all facts are true; to questioning everything and finding or creating your own truth.</p>

            {/* Assessment */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">Assessment</h3>
            <div className="w-full flex justify-center my-4">
              <img
                src={notepadPencilImg}
                alt="Notepad Pencil Icon"
                className="w-32 h-32 object-contain rounded-lg shadow-lg border border-purple-200"
              />
            </div>

            {/* Summary & Conclusion */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">Summary & Conclusion</h3>
            <p>Assessment for any course is the measurement of your achievement of the learning outcomes. IGCSE requires knowledge, comprehension, application and analysis. For AS Level both synthesis and evaluation will also be required. Always look at the PAST PAPERS provided at the start of each course to check where you are going.</p>
            <p>Our courses provide the following opportunities for assessment.</p>
            <ul className="list-disc list-inside ml-6">
              <li>Self assessment (by completing tasks set and then being provided with the memo or mark scheme.)</li>
              <li>Peer assessment (tasks that require you to contribute to a blog or forum where others assess your contribution and you do the same for them.)</li>
              <li>Summative assessment (tasks with short answers or multiple choice answers that are automatically marked and a grade given.)</li>
              <li>Formative assessment (Longer written answers submitted as a file or presentation and assessed by your tutor and then discussed after ward so that you learn more from the experience.)</li>
            </ul>
          </div>
        </CollapsibleSection>

        {/* 3. Preparation */}
        <CollapsibleSection
          title="Preparation"
          isExpanded={openSection === 'preparation'}
          onToggle={() => setOpenSection(openSection === 'preparation' ? null : 'preparation')}
        >
          <div className="space-y-4 text-gray-700">
            <h3 className="text-xl font-bold">First Steps: Preparing for e learning</h3>
            <p>E learning is not the easy option. Although the benefits far outweigh the challenges, it often requires more initiative and mental resilience that sitting in a classroom with a teacher. Learning alone can be difficult."</p>
            <p className="italic text-right">Guerillateaching 2014</p>
            <p>So now you have had your reality check, but with the right preparation, like millions of others, you will succeed.</p>
            <p>This guide will help you clear your head, get organized and charge confidently into your course. It will give you the skills to become an effective e learner.</p>
            <ol className="list-decimal list-inside space-y-2 mt-4">
              <li>
                <b>Why?</b>
                <p>Why are you studying? When it gets tough, and it will, the reason for all this effort in the first place will be the reason for keeping on going till the end. So be clear of your reasons for starting the course.</p>
                <p>Write down the reasons you want to START and COMPLETE the course. (Be brief and be clear. Your reasons are your own, but might include getting into university, or advancing your earning capacity.)</p>
              </li>
              <li>
                <b>Motivation</b>
                <p>Self-motivation isn't easy. Goals are your driving force. You know why you want to study, but effective learning is also knowing what you want to study.</p>
                <p className="italic">"Motivation without strategy is pointless!"</p>
                <p className="italic text-right">Guerillateaching 2014</p>
                <p>Write down what knowledge and skills you want to have developed by the end of the course. (a more in-depth look at goals is available in the STUDY SKILLS course. Remember that these goals should be revisited every 3 months.)</p>
              </li>
              <li>
                <b>Character</b>
                <p>Many personal qualities and skills are needed for studying at a distance, and many are the same as those required by any learner. But some have more importance as a distance learner.</p>
                <p>Write down the personal qualities and skills you think you will need to successfully complete your e learning course.</p>
                <p>Remember the REFLECTION and REVIEW are vital to any real learning. So at the end of this process return to this exercise to see if you have any more to add.</p>
              </li>
              <li>
                <b>The Pitfalls and how to avoid them.</b>
                <p>Even with all of the attributes suggested above, it is likely that there will be obstacles to your e learning that you need to overcome.</p>
                <p>Write down the the difficulties you expect to have to deal with in order to successfully complete your distance learning course. Think of categories:  personal life / social life / responsibilities / study skills / time etc..</p>
              </li>
            </ol>
          </div>
        </CollapsibleSection>

        {/* 4. Know Yourself */}
        <CollapsibleSection
          title="Know Yourself"
          isExpanded={openSection === 'know-yourself'}
          onToggle={() => setOpenSection(openSection === 'know-yourself' ? null : 'know-yourself')}
        >
          <div className="space-y-6 text-gray-700">
            {/* Know Thyself Heading */}
            <h3 className="text-xl font-bold text-purple-700">Know Thyself</h3>
            <p>This chapter is designed to make you think about how YOU learn.</p>

            {/* What is Studying? */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">What is Studying?</h3>
            <p>Studying is simply the process by which you learn. It is hard, but should be fun. There are rewards, both extrinsic (getting a better job) and intrinsic (feeling good, knowing more).</p>

            {/* What is Learning? */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">What is Learning?</h3>
            <p>Learning is the acquisition of new skills, knowledge, understanding and attitude and the recognition of how they relate to what you already have.</p>
            <p>Learning is a process of self-development. You learn best when you relate the new to your previous and current experience.</p>
            <p>Learning is not just collecting information, it is engaging with that information in a creative way.</p>
            <p>Don't expect to be "taught", expect to have to "Learn." We will provide all the materials, opportunities to engage with and discuss the information and provide assessment and feedback, but YOU have to do the learning!</p>
            <p>As you have seen in the previous chapter "What is elearning" Online learning is mostly about cognitive learning. This is to do with thinking abilities; comprehending, understanding, that is, what you know and what you do with what you know.</p>
            <p>The outcomes of cognitive learning are linked to what you can do:</p>
            <ul className="list-disc list-inside ml-6">
              <li><b>KNOWLEDGE:</b> you can recall what has been learned.</li>
              <li><b>COMPREHENSION:</b> you can understand the importance of what you have learned.</li>
              <li><b>APPLICATION:</b> you can use what you have learned in a familiar or new situation.</li>
              <li><b>ANALYSIS:</b> you can generate meaning from a range of information.</li>
              <li><b>SYNTHESIS:</b> you can create new meaning from information given.</li>
              <li><b>EVALUATION:</b> you can judge the significance and value of what has been learned.</li>
            </ul>

            {/* Accelerated learning Presentation */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">Accelerated learning</h3>
            <div className="w-full flex justify-center my-4">
              <iframe
                src="https://www.slideshare.net/slideshow/accelerated-learning-for-the-student-23940494/23940494"
                title="Accelerated Learning for the Student - SlideShare"
                width="800"
                height="480"
                allowFullScreen
                className="rounded-lg shadow-lg border border-purple-200"
                style={{ background: '#fff' }}
              ></iframe>
            </div>
            <p className="text-center text-lg font-semibold text-gray-700 mt-2">
              <a href="https://www.slideshare.net/slideshow/accelerated-learning-for-the-student-23940494/23940494" target="_blank" rel="noopener noreferrer" className="text-purple-900 underline font-bold hover:text-purple-700">Accelerated learning for the student</a>
              {' '}from{' '}
              <a href="https://www.slideshare.net/mrLandi" target="_blank" rel="noopener noreferrer" className="text-purple-900 underline font-bold hover:text-purple-700">Guerilla Teaching</a>
            </p>
            <div className="w-full flex justify-center my-8">
              <img
                src={bloomsTaxonomyImg}
                alt="Bloom's Taxonomy JPEG"
                className="w-full max-w-xl object-contain rounded-lg shadow-lg border border-purple-200"
              />
            </div>

            {/* The Characteristics of Distance learning */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">The Characteristics of Distance learning</h3>
            <p><b>Learn by doing:</b></p>
            <p>Complete the activities asked of you. Engage with the material. Make the effort to contribute to forums, chat rooms and discussion groups.</p>
            <p><b>Learn by assessment:</b></p>
            <p>You will have short SUMMATIVE tests at the end of every lesson or unit. these will give you a snap shot of your knowledge. Sometimes you will be required to SELF ASSESS. In other words you will be given the answer to a task (sometimes called a mark scheme or memo). FORMATIVE assessment is offered where feedback is given, you must reflect on this feedback if you are going to learn from it.</p>
            <p><b>Learning by feedback:</b></p>
            <p>Some assessments will be marked by the course tutor and returned to you with feedback. This is written advice on how to improve your understanding. READ IT! Think about it, communicate with the course tutor about it, ask questions and take ownership for your learning. Feedback is also motivation as it will show you where you are doing well!</p>
            <p><b>Learning by attending STUDY DAYS and WORKSHOPS:</b></p>
            <p>Guerilla Teachers provide students with opportunities for face-to-face meetings to focus on areas needing development. To identify misconceptions and develop overall competence in a particular subject or unit.</p>
            <p><b>Take control of your own learning.</b></p>
            <p>This is the big one! With distance learning you take far more responsibility for your own learning than in a traditional taught course. YOU have to meet the deadlines, YOU have to keep motivated and YOU have to balance work and play. Ultimately what you put in determines what you get out.</p>
            <p><b>Learning by reflection:</b></p>
            <p>The most effective learning comes when time to reflect on what you have learned is built into your study time.</p>
            <p>Taking ownership of your learning requires that you THINK about what you have learned, DISCUSS it with your tutor and fellow students.</p>

            {/* The Learning Process */}
            <h3 className="text-xl font-bold text-purple-700 mt-8">The Learning Process</h3>
            <p>Learning is NOT PASSIVE! What you DO with the information once you have accessed it determines your understanding of it and your ability to recall it.</p>
            <div className="w-full flex justify-center my-8">
              <img
                src={require('../assets/cone2.jpg')}
                alt="Cone of Learning"
                className="w-full max-w-xl object-contain rounded-lg shadow-lg border border-purple-200"
              />
            </div>
            <p>Learning does not happen in STRAIGHT LINES! Kolb was a chap who is credited with describing this best in his "Learning Cycle". But in order to avoid words like "abstract conceptualization" here is an image found on the internet that explains it very well.</p>
            <div className="w-full flex justify-center my-8">
              <img
                src={require('../assets/learningcycletxt256.gif')}
                alt="Learning Cycle"
                className="w-full max-w-xl object-contain rounded-lg shadow-lg border border-purple-200"
              />
            </div>
            <ul className="list-disc list-inside ml-6">
              <li>An idea is never really clear until you apply it…</li>
              <li>You don`t know how well it worked until you think about it or you discuss it with someone else…</li>
              <li>You then try and improve on it and try it out again…</li>
              <li>It may not be smooth, it may take a long time and where you start in the cycle is entirely up to you…are you an activist (do it), a reflector (think about it), a theorist (work out why) or a pragmatist (make it work)? BUT as the cycle must be complete you should aim to develop all aspects of learning.</li>
            </ul>
            <p>For more about learning styles go to the <a href="https://landicollege.com/moodle/login/index.php" target="_blank" rel="noopener noreferrer" className="text-purple-900 underline font-bold hover:text-purple-700">STUDY SKILLS</a> course.</p>
          </div>
        </CollapsibleSection>

        {/* 5. The Practicalities of online learning */}
        <CollapsibleSection
          title="The Practicalities of online learning"
          isExpanded={openSection === 'practicalities'}
          onToggle={() => setOpenSection(openSection === 'practicalities' ? null : 'practicalities')}
        >
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-purple-700">Where to study</h4>
            <p>Finding the right place to study is critical.</p>
            <p>Your study space must be…</p>
            <div className="w-full flex justify-center my-4">
              <img
                src={require('../assets/study-room-768x768.jpg')}
                alt="Study Room"
                className="w-96 h-96 object-cover rounded-lg shadow-lg border border-purple-200"
                style={{ display: 'block', objectFit: 'contain' }}
              />
            </div>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Warm and comfortable</li>
              <li>Lots of natural light</li>
              <li>A desk or table at the right height for you</li>
              <li>A comfortable chair at the right height</li>
            </ul>
            <div className="w-full flex justify-center my-4">
              <img
                src={require('../assets/chair-height.jpg')}
                alt="Chair Height"
                className="w-96 h-96 object-cover rounded-lg shadow-lg border border-purple-200"
                style={{ display: 'block', objectFit: 'contain' }}
              />
            </div>
            <p>Adjusting your chair height is also a great way to check up on the ergonomics of the rest of your workstation.</p>
            <p>If you can't fit your legs under the desktop (you should have enough room to comfortably cross your legs at the knees) or there is not enough space to move them freely, your desk is too low for you. Put it on risers, or invest in a desk that's the proper height.</p>
            <p>If you can sit comfortably but you have to raise your arms to reach the keyboard or work surface, your workstation is too high. Find a way to lower your work surface (a keyboard tray might help). Alternatively, you can adjust the chair height so your elbows are the same height as your desk and use a footrest high enough so you can lay your feet flat.</p>
            <div className="w-full flex justify-center my-4">
              <img
                src={require('../assets/ergo-screen-position.png')}
                alt="Ergonomic Screen Position"
                className="w-96 h-96 object-cover rounded-lg shadow-lg border border-purple-200"
                style={{ display: 'block', objectFit: 'contain' }}
              />
            </div>
            <p>The screen should be about 50cm away (about arms length) and the top of the screen level with your eye line.</p>
            <p>Some organisation and storage of your study materials is needed so your desk is not cluttered.</p>
            <p className="font-bold text-red-600">NO DISTRACTIONS!</p>
            <div className="w-full flex justify-start my-4">
              <img
                src={require('../assets/no-phones.jpg')}
                alt="No Phones"
                className="w-96 h-96 object-cover rounded-lg shadow-lg border border-purple-200"
                style={{ display: 'block', objectFit: 'contain' }}
              />
            </div>
            <div className="w-full flex justify-start my-4">
              <img
                src={require('../assets/no-tv.jpg')}
                alt="No TV"
                className="w-96 h-96 object-cover rounded-lg shadow-lg border border-purple-200"
                style={{ display: 'block', objectFit: 'contain' }}
              />
            </div>

            <h4 className="text-lg font-semibold text-purple-700 mt-8">When to study</h4>
            <p>It is important to set aside time every day, 6 days a week for study. An hour a day for 5 days is better than a 5 hour marathon on one day! Sometimes you get to choose when you can study, sometimes you study when you can. Just be aware and be reasonable of the time required to prepare for the examination, or to complete the requirements of the course.</p>
            <div className="bg-purple-50 border-l-4 border-purple-400 p-4 rounded mb-4">
              <b>ACTIVITY:</b> Make a note of when you will be able to study.
            </div>
            <p>Research has proven that it's not how much time you study that counts; it's rather how well you study. In fact, in at least one survey, students who studied more than 35 hours a week came out with poorer grades than those who studied less. Use your study time wisely, and you too will come out ahead.</p>

            <h5 className="text-md font-semibold text-purple-600 mt-6">4 Benefits of Studying During the Day</h5>
            <ul className="list-decimal list-inside space-y-1 text-left">
              <li>After a good night's sleep, you'll likely have more energy and a higher ability to concentrate the next day.</li>
              <li>Society is structured around being active during the day and sleeping at night, so by sticking to this norm there are undeniable benefits such as being able to go to the library or book shop.</li>
              <li>Most people are contactable during the day so it's easier to communicate with your friends or tutors during the day if you have any questions.</li>
              <li>Natural light is better for your eyes. Artificial light hurts our eyes and can affect our natural sleep rhythm.</li>
            </ul>

            <h5 className="text-md font-semibold text-purple-600 mt-6">4 Benefits of Studying at Night</h5>
            <ul className="list-decimal list-inside space-y-1 text-left">
              <li>People are more active, louder and intense during the day. At night it's only you and the night owls so you can study in peace and quiet.</li>
              <li>If you're lucky enough to live near a library that's open late, you will notice that the library is near deserted when you want to study late.</li>
              <li>At night there are fewer distractions than during the day. Most of your friends are asleep and your social networks will be less active.</li>
              <li>It is true that things look different by night. The night can increase your creative efficacy and help you see concepts differently.</li>
            </ul>
            <p>There are possibly more reasons why each of these options could be the best time to study. It's important to note however that ultimately it all depends on your individual preferences. Sadly, there really is no objective 'best time to study'! It all depends on your personality, what you're studying, your resources, time management and your natural sleep cycle.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <b>GT TIP:</b> Avoid studying during your sleepy times. Psychologists have found that everyone has a certain time of day when he or she gets sleepy. Don't try to study during that time. If you have a pile of schoolwork, use that time to sort your notes or clear up your desk and get your books together.
            </div>

            <h4 className="text-lg font-semibold text-purple-700 mt-8">Time Management</h4>
            <p>Don't spend more than an hour at a time on one subject.</p>
            <p>Psychologists say that you learn best in short takes. In fact, studies have shown that as much is learned in four one-hour sessions distributed over four days as in one marathon six-hour session. One reason you learn better this way is that you use time more efficiently when you're under an imposed time restriction. (Have you noticed how much studying you manage to cram into the day before a big exam?) Also, between study times, your mind subconsciously works to absorb what you've just learned. If you're doing straight memorization, whether math formulas or a foreign language or names and dates, don't study more than 20 to 30 minutes.</p>
            <p>Keep alert while you're studying. The amount of attention you give a subject is as important as the amount of time you spend. The more alert you are while studying, the more you'll learn. You can promote a high level of alertness by minimizing distractions: two or three hours of study without noise or other interference is more effective than 10 hours of trying to work amidst bedlam. Another technique for keeping your mind from wandering is to begin with your most boring subject—or your hardest one—and work toward the easiest and/or the one you like best.</p>
            <p>Take frequent rest breaks. The specialists say you'll get your most effective studying done if you take a 10-minute break between subjects. (Again, it's akin to behavior modification. Pavlov's dogs were taught to respond on cue by being rewarded with tidbits. The break is your reward.) Dr. Walter Pauk, Director of the Reading and Study Center at Cornell University, suggests you take that short break whenever you feel you need one, so you don't fritter your time away in clock-watching and anticipating your break.</p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4">
              <b>REMEMBER:</b> We all have our own weaknesses. Some of us are super organised, some of us are totally chaotic. The balance lies somewhere in between and it won't help if you get all anal about sticking to a schedule exactly. Be flexible, life will laugh at your plans, and the stress will be counter productive.<br />
              Feeling mentally and physically fresh is the best way to study, and this is achieved by <b>TAKING  A BREAK FROM IT!</b>
            </div>
          </div>
        </CollapsibleSection>

        {/* 6. How to study */}
        <CollapsibleSection
          title="How to study"
          isExpanded={openSection === 'how-to-study'}
          onToggle={() => setOpenSection(openSection === 'how-to-study' ? null : 'how-to-study')}
        >
          <div className="space-y-6">
            <p>This section will cross-reference with information that you will be getting in other parts of this book. The whole book is also designed to get you studying in more successful ways. However, here are some practical tips on how to study:</p>

            <h4 className="text-lg font-semibold text-purple-700">Want it:</h4>
            <p>Everyone should know what they are studying and why. Make sure that you know what you want from each course that you are studying, and how your life will be changed when you reach your goals.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <b>GT TIP:</b> Remember to write your goals on Post-its and stick them up in your study space. Create a learning contract for each course, module or unit that you do.
            </div>

            <h4 className="text-lg font-semibold text-purple-700">Get an overview:</h4>
            <p>When on a course, do not drift from week to week wondering what's going on. Work out how the course has been put together. Know how the course is being assessed. Read the assignment question at the beginning of the course, not the end. If there are to be exams, check out past papers at the beginning of your studies, not the end. All this gives you a sense of how the course has been put together and where you are going each week</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <b>GT TIP:</b> Use the 'Get Ready for Your Exams' chapter. The advice there will help you to plan and use your time throughout your course.
            </div>

            <h4 className="text-lg font-semibold text-purple-700">Command terms:</h4>
            <p>IGCSE, A level or any curriculum has its own command terms, words that tell you what is required or what you must do. Remember, every course or subject also has its own theory of knowledge – what counts as argument and evidence for your subject. Make sure you know the what, why and how of all your subjects.</p>

            <h4 className="text-lg font-semibold text-purple-700">Be positive:</h4>
            <p>Just as an athlete will perform better if they feel like a success and think positive thoughts, so a student will learn more if they can adopt positive attitudes and develop self-conﬁdence.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <b>GT TIP:</b> When your motivation runs low, role-play, or act like, a successful student. Remind yourself that you can be a successful student.<br />
              <i>"Fake it 'till you make it!"</i>
            </div>

            <h4 className="text-lg font-semibold text-purple-700">Prioritise time:</h4>
            <p>When working, we need to be strategic, note which assignments carry the most marks, and note which deadlines are coming ﬁrst. When you make lists of what needs to be done and when, do first that with the nearest deadline; give more time to the assignment which carries the most marks.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <b>GT TIP:</b> Have a diary and note when you are going to do what. If you don't do something, re-schedule.
            </div>

            <h4 className="text-lg font-semibold text-purple-700">Use the time:</h4>
            <p>We know students who sit down to study – out come the pens and paper – they get rearranged. Out come the books and the highlighters – they get rearranged. They go for a coffee. They go for a glass of water. They put one lot of books away and get out another set. They look at the clock – oh good! An hour has passed, so they put their materials away. But they have done no work! Watch out for this.</p>
            <p>One thing that can stop people achieving enough when they sit down to work is too much worry. They sit down to write an essay, and worry about the two other essays that they also have to write. They worry about the weather or the bills. They worry about anything and everything. If we worry about everything, we do nothing. One of the hardest tricks to being a successful student is to learn how to worry about one thing at a time. It is as if we need to set up a set of shelves in our brain. We then need to put all our different worries on the shelves. Learn to take down one thing at a time and soon you will see that any house is built one brick at a time.</p>

            <h4 className="text-lg font-semibold text-purple-700">Time tips:</h4>
            <p>We concentrate best in 15-minute bursts. When we study, we have to get into the habit of regularly recharging our mental batteries to wake up our brains. We can do this by:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>taking a short rest</li>
              <li>changing what we do</li>
              <li>making the task very important</li>
              <li>making the task interesting, stimulating or more difﬁcult.</li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <b>GT TIP:</b> Have a diary and note when you are going to do what. If you don't do something, re-schedule.<br />
              <b>GT TIP:</b> Goal-setting will help you beneﬁt from independent study time.
            </div>

            <h4 className="text-lg font-semibold text-purple-700">Goal-setting:</h4>
            <p>Before you sit down to study, set yourself some goals. Know what you are doing and why. Do not just start reading a book because it is on the reading list. Know why you are reading a section of that book. If you are not sure, have a look at the assignment question and ﬁnd a bit of the book that will help you with a bit of the assignment. Then you will know what you are doing and why. This makes all the difference. Give it your total concentration. When we have ﬁnished with that, put it back on the shelf and take down something else.</p>
            <p>Like everything else recommended in this book, this is a skill that has to be learned and developed through practice.</p>

            <h4 className="text-lg font-semibold text-purple-700">Be active:</h4>
            <p>When studying independently, be just as active as when you are in a lecture or joining in a class discussion. Read actively, asking questions as you go. Think about the information that you are receiving: what does it mean? Do you understand it? If not, what are you going to do about that? How does it connect with what you already know (things that you have heard in class or read in other places)? Connecting up information in this way is a really important part of active learning. Make active notes – typically, key word notes – in patterns. Revise those notes actively.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <b>GT TIP:</b> Before reading, re-read the assignment question – make notes that would help you answer that question.
            </div>

            <h4 className="text-lg font-semibold text-purple-700">Review actively:</h4>
            <p>At the end of each study session – independent study or a lecture or class – take some time to reﬂect on what you have read or heard. Check what you have done. Recall what you have learned. Make brief notes to make the learning conscious.</p>

            <h4 className="text-lg font-semibold text-purple-700">Study with partners and groups:</h4>
            <p>Study is best when undertaken actively and interactively; this is where a study partner or a study group can be invaluable. Talking over new information with other people is the easiest way to understand and learn it, to make it your own. Further, if you encounter a problem you can talk to (or phone) your partner. Probably, they will not know the solution either. Oh, the relief! You are not alone and you are not stupid. Then the situation changes as you work on the problem and sort it out together.</p>

            <h4 className="text-lg font-semibold text-purple-700">Don't end on a sour note:</h4>
            <p>Try not to end a study session on a problem – it is de-motivating and it can make it that little bit harder to start studying again. As suggested, use a study partner, friend or online discussion space to talk it over.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
              <b>GT TIP:</b> Make a note of the problem and sleep on it – sometimes the solution comes to you when you wake up. But don't lie awake fretting all night – this does not solve the problem, and you have made everything worse by losing sleep and gaining stress.
            </div>

            <h4 className="text-lg font-semibold text-purple-700">Relaxation and dealing with stress:</h4>
            <p>Remember to make time to rest, relax and let go of stress. This is important. You need rest to carry on. Stress relief allows you to let go of tension, and this helps you to perform better. When we are stressed, our body releases cortisol, a hormone that has a direct impact on the brain causing the cortex to shrink. Further, stress releases adrenaline, the ﬂight or ﬁght hormone. The combination of these hormones eliminates short-term memory and produces the narrow, tunnel vision necessary for ﬁght or ﬂight. This might save our lives when escaping from a burning building, but works against us when studying, where we need breadth and depth of vision.</p>
          </div>
        </CollapsibleSection>

        {/* 7. Getting the support you need */}
        <CollapsibleSection
          title="Getting the support you need"
          isExpanded={openSection === 'support'}
          onToggle={() => setOpenSection(openSection === 'support' ? null : 'support')}
        >
          <div className="space-y-6">
            <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-700 bg-purple-50 py-2 rounded-r">
              "What is home? My favourite definition is "a safe place," a place where one is free from attack, a place where one experiences secure relationships and affirmation. It's a place where people share and understand each other. Its relationships are nurturing. The people in it do not need to be perfect; instead, they need to be honest, loving, supportive, recognizing a common humanity that makes all of us vulnerable."<br />
              <span className="block mt-2 text-right">― Gladys Hunt, <i>Honey for a Child's Heart: The Imaginative Use of Books in Family Life</i></span>
            </blockquote>
            <p>You might be the exception to the rule. You might not need help from anyone. But most people do. Distance learning, or independent learning is not easy. Sometimes fears, insecurities and doubt begin to loom large in your mind and you lose confidence and momentum. Remember there is support at hand to help you beat the negativity. "This too shall pass" as they say. Your studies won't last forever and sometimes everyone needs to be reminded to take a break and find balance again.</p>

            <h4 className="text-lg font-semibold text-purple-700">Coping Strategies</h4>
            <p>Sometimes studying is the straw that breaks the camel's back. The practical advice in the previous chapter will help, but no matter how organised you are sometimes we need someone else to take some of the weight. Many distance learners find that fellow students are best for providing the sort of advice and encouragement they need. Or at other times it will be your tutor who is best positioned to help.</p>
            <p>For example, very often there is a practical solution to your stress; an extension on a deadline or a point in the right direction for a particular resource for an assignment. But never forget that sometimes you just have to grit your teeth and get on with it and complete the task at hand.</p>
            <p className="font-bold text-purple-700">DEADLINES! They are designed to help! Spread the load, organise your time, meet the deadline – if you don't then things get out of control!</p>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded mb-4">
              <b>STEP 1:</b> Admit there is a problem.<br />
              <b>STEP 2:</b> Identify as simply as possible what it is – be specific.<br />
              <b>STEP 3:</b> Get the help you need – just ask!
            </div>

            <h4 className="text-lg font-semibold text-purple-700">Support from the course administrator</h4>
            <p>Every Guerilla Teaching course has a message block. Use this to communicate with the course administrator. A technical hitch or some user issue can be sorted out quickly and should not slow your progress.</p>

            <h4 className="text-lg font-semibold text-purple-700">Support from your tutor</h4>
            <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-700 bg-purple-50 py-2 rounded-r">"You can't have enough contact with your tutor, they are your rock. Distance learners like us need them more than school children"<br /><span className="block mt-2 text-right">GT Learner</span></blockquote>
            <p>Your tutor is the one who knows the content best. They are experts in their field. Although other students can help through the site-wide chat rooms and forums, the tutors have often written the course themselves, or are actual IGCSE examiners.</p>
            <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-700 bg-purple-50 py-2 rounded-r">"The most successful GT students are those that are proactive in their contact with me. You can lead a camel to water but you can't make it drink."<br /><span className="block mt-2 text-right">GT Tutor</span></blockquote>
            <p>Contact your tutor via the on-site messaging system or the Q and A forums.</p>

            <h4 className="text-lg font-semibold text-purple-700">Support from other students</h4>
            <p>Every course will have forums and chat rooms available as part of the course. In fact most REQUIRE participation in order to complete the course. But even if this is not the case you are better off setting up informal support and study groups. Distance learning has grown hand in hand with the development of social media, so most of you are all savvy as far as chat rooms and forums go. But be careful! As a distance learner these media are the main point of contact so you MUST be aware of the blurred lines of social interaction and ensure the proper behaviour at all times. (see the chapter entitled "Social Etiquette"). We are a family and we support each other without judgement.</p>
            <blockquote className="border-l-4 border-purple-400 pl-4 italic text-gray-700 bg-purple-50 py-2 rounded-r">"I was truly amazed at the support from people I'd never actually met! The challenge really bring people together!"<br /><span className="block mt-2 text-right">GT student</span></blockquote>
            <p className="font-bold text-red-600">GT has a ZERO TOLERANCE of any abusive, threatening or insensitive behaviour.</p>
            <p>Talking things through with other students engages a particular learning style and is the "apply" part of the learning cycle. Many people find simply trying to explain something to others helps clarify the problem to themselves. The key is to get someone to truly listen to you – not just wait for their turn to speak – and give you constructive feedback. You in turn, must also offer this service. Helping out someone else is a great feeling!</p>
            <p>You can get hold of anyone through the GT site. Even students that are a year ahead of you. We believe in vertical teaching! Why should you be limited to only your cohort? And in fact, why do people assume the tutor is the best one to ask? There are students on our courses whose insights and understanding match our tutors! Besides, fellow students who are closer in age to you might be able to communicate more clearly in an informal language you feel more comfortable with.</p>
            <p>Don't allow yourself to become isolated. Reach out. The very act of reaching out for contact from your fellow students might just be the contact that person was also looking for! You will find others who just don't "get" inorganic chemistry! The knowledge that you have a group meeting to discuss the material may be just the motivation you need to get through it before the meeting. Enthusiasm is infectious and making friends can be fun! Or not, Don't worry – it takes all sorts.</p>
            <p>However good we have become at GT to facilitate communication between our students, we are not such technophiles that we can't admit that face to face communication is hugely effective. So informal study groups with those in your geographical area are encouraged. Feel free to exchange phone numbers with those you strike a relationship with fellow students.</p>
          </div>
        </CollapsibleSection>

        {/* 8. Online Learning Resources */}
        <CollapsibleSection
          title="Online Learning Resources"
          isExpanded={openSection === 'resources'}
          onToggle={() => setOpenSection(openSection === 'resources' ? null : 'resources')}
        >
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-purple-700">Online course Materials</h4>
            <div className="w-full flex justify-center my-4">
              <img
                src={require('../assets/1386713570online-resources.jpg')}
                alt="Online Course Materials"
                className="w-96 h-96 object-cover rounded-lg shadow-lg border border-purple-200"
                style={{ display: 'block', objectFit: 'contain' }}
              />
            </div>
            <div className="space-y-4">
              <p>One of the advantages of GT is the fact that all courses are designed to provide ALL resources on line, so there is no need to buy expensive text books. However, each course does recommend text books that can be bought or borrowed if you prefer the tactile experience of holding a book or have connectivity issues, (that is internet connectivity, not you personally). Each course has links to internet sites, newspaper articles, forums and wiki and anything else that might be considered a useful source of information, carefully selected to support the content of each syllabus.</p>
              <p>These easily accessible on line resources and the way they are presented is GT's specialty. You could, if you were so inclined, find all these resources your self. But that would take a serious amount of time and you would never know if the ones you found were the most appropriate or the best available. GT has done this for you!</p>
              <p><b>The internet is both a BLESSING and a CURSE.</b> It is literally a world of information. BUT don't believe everything that you read! Have a look at the INFORMATION LITERACY course for some advice in cross referencing and checking.</p>
              <h4 className="text-lg font-semibold text-purple-700">Text books</h4>
              <p>Recommended text books and learner guides are available from the Edexcel web site.</p>
              <h4 className="text-lg font-semibold text-purple-700">Information Literacy.</h4>
              <p>Information literacy is the ability to extract the information you need from the millions of web sites, hours of video and pages of books. You will need to be able to manage, evaluate and use the information you obtain effectively. Have a look at the INFORMATION LITERACY course for all your needs.</p>
            </div>
          </div>
        </CollapsibleSection>

        {/* 9. Reading and note taking */}
        <CollapsibleSection
          title="Reading and note taking"
          isExpanded={openSection === 'reading'}
          onToggle={() => setOpenSection(openSection === 'reading' ? null : 'reading')}
        >
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-purple-700">Reading</h4>
            <div className="w-full flex justify-center">
              <img
                src={require('../assets/betty.notetaking.jpg')}
                alt="Note Taking Example"
                className="rounded-lg"
                style={{ display: 'block', objectFit: 'contain', width: '37.44rem', height: '37.44rem' }}
              />
            </div>
            <ol className="list-decimal list-inside space-y-2 text-left">
              <li>
                <b>Before you start</b>
                <ul className="list-disc list-inside ml-6">
                  <li>Get a clear idea about the purpose of your reading and what you want to get out of it. Ask yourself:</li>
                  <li><b>Why am I reading this?</b> Read with a purpose!</li>
                  <li>Preparation for an assignment? Pre-reading for a lecture? Researching for a presentation? Finding ideas for a project?</li>
                  <li><b>What do I want to get out of it?</b> General idea of the content? Specific facts? The author's viewpoint?</li>
                  <li><b>What do I know already?</b> Read selectively!</li>
                </ul>
                <p>Time is of the essence, use indexes, abstracts, databases and good search techniques to find RELEVANT information. Look at the following ideas to check the relevance of what you are about to read.</p>
                <h5 className="text-md font-semibold text-purple-600 mt-4">7 Reading Cheats to save time!</h5>
                <ol className="list-decimal list-inside ml-6 space-y-1">
                  <li><b>Read the Cover.</b> Seems obvious, but you need to know the gist of the book and if the author has any academic standing.</li>
                  <li><b>Read the Abstract.</b> This is more informative than the cover. According to what an abstract SHOULD be, it should provide an accurate, brief account of the aims, methods and conclusions of the article.</li>
                  <li><b>Read the contents.</b> A list of chapters is a great help in providing direction and focus.</li>
                  <li><b>Refer to the index.</b> An index identifies the vocabulary used and the pages the words appear on. Scan the index for key words from your investigation, question or essay title.</li>
                  <li><b>Check the Bibliography.</b> As your knowledge of a subject grows you should start to become familiar with well-known authors in that subject.</li>
                  <li><b>Read the introduction.</b> Whether at the start or as a first chapter, written by the author or by another academic, an introduction is especially useful to pin point key ideas. It will also give you the author's point of view or bias.</li>
                  <li><b>Conclusion.</b> Read the final chapter. SPOILER ALERT! No, this is not a novel, the conclusion will tell you if you need to read the detail and enable some critical and analytical reading.</li>
                </ol>
                <p>Managing your reading. Click on this link for excellent advice by the Information Literacy Team of Leeds University.</p>
              </li>
              <li>
                <b>Reading strategies and speed reading</b>
                <p>Choosing the most appropriate strategy for your purpose is the first step to making your reading more efficient. This one might be the best…</p>
                <p><b>The brain thinks in concepts not words</b></p>
                <p>Read this sentence: "The furry cat slunk on its four legs in search of prey. Spying a bird with its slit eyes it pounced, grasping the bird in its two front paws@<br />The concept is simple: CAT-CAUGHT-BIRD.<br />Everything else you already know! Cats are furry with four legs and slit eyes, they hunt birds and they can pounce… You don't need to read, think about or remember this to make sense of the sentence.<br />Information that is NEW is most relevant to you.<br />The key is NOT TO READ OUT LOUD (In your head) because then you can only read as fast as you can talk… FILTER OUT what you already know.<br />Choosing the most appropriate strategy for your purpose is the first step to making your reading more efficient.</p>
              </li>
              <li>
                <b>Critical thinking</b>
                <p>Critical thinking is an essential skill which should be applied to all aspects of education.</p>
                <ul className="list-disc list-inside ml-6">
                  <li>How much of what is written fact and how much is opinion?</li>
                  <li>If an opinion is stated, is it backed up with evidence?</li>
                  <li>If the evidence is cited, is it recent, up to date evidence?</li>
                  <li>Does the author have a lot of experience in the field?</li>
                  <li>Are the conclusions based on what is written in the paper?</li>
                  <li>If you follow the author's view and opinions through to their logical outcome, is this outcome reasonable and desirable?</li>
                  <li>Can you identify the "school of thought", in other words is there a common approach?</li>
                  <li>How much opposition is there to what you have read?</li>
                </ul>
                <p>Remember, academic publications are mostly peer reviewed and checked, but ANYONE can write a blog! See the Guerilla Teaching free course on Information Literacy for how to evaluate a web site. But why re-invent the wheel? Click on the link below for Leeds University (who have explained it better than we could).</p>
                <p><b>Critical Thinking</b></p>
              </li>
              <li>
                <b>Note Taking</b>
                <p>Copying out large sections from a book or journal whilst reading is bad practice: it does not help you to understand what you are reading, and can easily lead to unintentional plagiarism.</p>
                <p>Everyone has their own style, but there are some techniques that work for many…</p>
                <p><b>Skills@Library note taking resource (activity)</b><br />Detailed advice and activities on note taking strategies.<br /><b>Note making explained</b></p>
                <p><i>*All activities from designed by the Information Literacy Team of Leeds University.</i></p>
              </li>
            </ol>
          </div>
        </CollapsibleSection>
      </section>
    </div>
  );
};

export default ELearningGuide; 