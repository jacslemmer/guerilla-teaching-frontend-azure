import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Article1 from '../assets/Article1.jpg';
import Article2 from '../assets/Article2.png';
import Article3 from '../assets/Article3.png';
import Article4 from '../assets/Article4.jpg';
import Article5 from '../assets/Article5.jpg';
import './Articles.css';

const blogData = [
  {
    id: 1,
    image: Article1,
    title: 'The Flipped Classroom',
    author: 'Dan Landi',
    date: 'Mar 25, 2021',
    comments: 0,
    content: `Our Vision\n\nWe at Guerilla Teaching have a vision of self-directed learning. We believe that the student’s learning is not dependent on the teacher. The teacher’s job is to teach them how to learn. We believe that the motivation to learn comes from within. Curiosity, the satisfaction of accomplishment and the desire to achieve far outweigh the grade.\n\nBut this is not a simple sound bite. Guerilla Teaching has a vision and a culture that creates an environment that allows this to happen. Our students come to us form many backgrounds, but few if any, have anything remaining of the child-like wonder that was present in their first years of school. Our tutors nurture, our roles are negotiated and agreed upon, our tutors are the facilitators. We put the power in the hands of the learner, but this means that they must assume responsibility for their own learning and their own choices.\n\nHow to Achieve it\n\nTo this end we train our teachers with a clear collective vision, we provide the technology for the “Flipped Classroom” and we develop open and honest communication with our clients – the parents – to get their support.\n\nThe “Flipped Classroom” concept is a departure from teacher – centred learning. Compare these pedagogies: A student walks into a classroom with no idea what they will be learning or “taught” that day. The teacher stands in front and describes and explains the content, the student then takes away questions based on the content, to assess their comprehension. They complete the questions in isolation (at home) and hand them to the teacher. The teacher marks them in isolation and then returns them to the student (the next week, month or whenever). The student scans through all the painfully constructed comments straight to the grade and judges their success by the grade alone. They do not learn or develop their knowledge and understanding, they do not know how or why they were right or wrong.\n\nAlternatively, the student accesses the content before the lesson, they see the Learning Objectives (what they need to know); they see the Success Criteria (how they can prove that they know it); they read the text, watch the videos, consider the questions and then when they they engage with the facilitator, they process the information and construct new understanding from it; they answer the questions through discussion and forums , developing their knowledge under the direction of the facilitator and through their p and in the end see that they have achieved success.\n\nWhich do you prefer? Guerilla Teacher’s vision is to consistently achieve the latter.`
  },
  {
    id: 2,
    image: Article2,
    title: "Write don’t type",
    author: 'Dan Landi',
    date: 'May 05, 2025',
    comments: 0,
    content: `Why Handwriting Still Matters in a Digital Age\nInsights from an experienced educator\n\nDoes handwriting improve memory and learning?\nYes—and significantly so. Multiple cognitive studies have shown that the act of handwriting activates more regions of the brain associated with memory and understanding than typing. When we write by hand, we process information more deeply, which leads to better retention and comprehension. For students, especially those with learning difficulties or attention challenges, handwriting can slow the pace of input, allowing the brain more time to absorb and connect ideas.\n\nCan handwriting support focus in a way typing can’t?\nAbsolutely. Typing often leads to passive transcription—students copy information without fully engaging with it. In contrast, handwriting is slower, requiring more thought to summarise, paraphrase, and prioritise information. This process strengthens focus and critical thinking. For many students, particularly those with ADHD, the physical act of writing helps reduce distractions and anchor attention.\n\nIs there a link between handwriting and creativity?\nCreativity often flows more freely through a pen than a keyboard. The tactile nature of handwriting allows for spontaneous sketching, doodling, mind-mapping, and note-making—all of which stimulate divergent thinking. The unstructured space of a blank page encourages experimentation in a way that the rigid lines of typed text may not.\n\nShould handwriting still be taught in a tech-driven world?\nYes. While typing is essential in the 21st century, it should complement—not replace—handwriting. Developing both skills equips students for versatility in learning, expression, and assessment. Handwriting remains a powerful tool not only for academic success but also for self-regulation, emotional processing, and deeper thinking.\n\nThe pen may be old-fashioned—but in education, it remains mightier than the keyboard.`
  },
  {
    id: 3,
    image: Article3,
    title: 'Why Choose Pearson?',
    author: 'Dan Landi',
    date: 'May 05, 2025',
    comments: 0,
    content: `Why Pearson Edexcel is the Ideal Choice\nLooking for a globally recognised qualification that universities and employers trust?\nPearson Edexcel’s International GCSE and AS Levels are part of the world’s largest education company, and are accepted by leading universities in the UK, the US, Europe, and beyond. Edexcel qualifications meet UK National Curriculum standards while offering an international outlook—making them ideal for globally mobile families or those preparing students for higher education abroad.\n\nDoes your child need flexibility without compromising on academic depth?\nEdexcel exams are modular in many subjects, meaning students can sit individual units throughout the year rather than all at once. This suits homeschoolers who want to build learning around their child’s pace. With options to re-sit specific papers to improve grades, learners can develop confidence without high-stakes pressure.\n\nConcerned about the balance between theory and real-world application?\nPearson Edexcel is known for its balance of rigorous content and accessible, real-world questions. Science assessments are based on clear learning objectives with lab-based alternatives for practicals. In subjects like Business, Economics and Geography, students engage with current global issues, developing analytical and critical thinking skills—not just rote learning.\n\nWant high-quality resources without being tied to one provider?\nBecause Edexcel is a widely adopted curriculum, homeschoolers benefit from a vast range of textbooks, past papers, online videos, and teaching guides—both from Pearson and independent publishers. This allows parents to tailor the learning experience while still relying on a robust and credible framework.\n\nWhy not choose a curriculum that opens doors but leaves them wide open?\nChoosing Pearson Edexcel doesn’t mean giving up educational freedom—it enhances it. You retain control, but your child gains qualifications that are valued worldwide.`
  },
  {
    id: 4,
    image: Article4,
    title: 'What are we assessing in examinations?',
    author: 'Dan Landi',
    date: 'Mar 25, 2021',
    comments: 0,
    content: `It continues to amaze me how entrenched people are in their perspective and how bound by policy or habit. What are exams for if only to obtain an accurate account of a learner’s knowledge and skills and judge them against others? But what if a learner’s knowledge and skills cannot be assessed by sitting in front of a piece of paper and writing down answers to two dimensional questions and requiring a specific form of recall and cognitive processing? Does this mean that they do not have the knowledge?\n\nWhen asked “What are the characteristics of a planned economy” they stare blankly. But when encouraged to recall foundational knowledge of what an economy is, then prompted to describe different types of economy, then given time to make the links between their advantages and disadvantages… then the light comes on. Ah! If a planned economy is controlled by the government, then this is a planned economy, which means it looks like this, which means these are the characteristics!\n\nSo they did understand the question, and they did have the knowledge, but they couldn’t recall the content… so the examination paper remains blank.\n\nIf we only teach the content, but students are not given the opportunity to communicate their understanding and made to feel a failure rather than experience the thrill of success and the buzz of understanding something new, what is the point of examinations?\n\nAh! I hear the pedants cry “it proves their perseverance in acquiring new knowledge and displays marketable skills!” But you were not there when the student struggled through the lessons, your heart did not break when they failed over and over, and you did not swell with pride as they finally succeeded and the light came on and their face shone. You will not be there when they enter the job market (and don’t pretend you can predict the jobs that will be available to them, or the skills these as yet non-existent jobs will require) so again… what is the point?\n\nJust a thought….`
  },
  {
    id: 5,
    image: Article5,
    title: 'Guerilla Teaching: Developing Excellent Teaching Skills – Notes on Mentoring',
    author: 'Dan Landi',
    date: 'Mar 25, 2021',
    comments: 0,
    content: `PRINCIPLES OF DIPLOMACIA & EMPATHY\n\nDIPLOMACY: I try to listen to myself talk and keep an eye on the way I come across. I make sure that I say things in a way that is not hurtful at any level and try to take into account who I am talking to. We know that these youngsters can be very sensitive and can (and indeed do!) take comments out of context!! So I make sure that I earn their trust as soon as possible in the school year.\nI check their reaction when I say something and have to decide what reactions they are entitled to (e.g. part of their stage of growth) and what reactions are my projections (e.g. making them accountable for something that they shouldn’t be).\nWhen the interactions are clean and the boundaries preserved, there is no damage When there is an abuse of power at any level, there is backslash of some sort at some point in the future. Then you know that your integrity and their integrity was not preserved. It takes a keen eye to walk on the neat line of responsibility.\nEMPATHY: If I don’t know / sense / understand where my students are coming from, I can’t go down where they are at and bring them where I want them to go.\nI need to adjust my understanding to what they know and to their level of growth before I can help them learn more / grow more.\nIt is about preparing their mind and heart for learning and for making the long-term commitment to succeed, rather than simply teaching them facts and figures.\nSTAYING CENTRED: I can’t give my power away so I can’t let them press my buttons. I diffuse, in many more occasions than I can count, the energies on the moment.\nI don’t take everything to heart and I don’t take everything literally. They try to take control by breaking the rules: e.g. swearing, making noise, doing anything inappropriate…And they will do it again and again if I lose it. So if I make a joke instead: “Are you OK? I was worried about you for a minute…”. This diffusing strategy tends to make them laugh so they lose the grip on that particular trick at that particular moment, and the group moves on.\nWhen they realise that a trick doesn’t work with me, they may take it to the next level and try to disrupt the lesson by finding something else that may be more effective. The problem with this is that they escalate their misbehaviour… At some point, I may see that they simply refuse to be called to order, an open sabotage of the class, then I step up and I use my voice to make this point: a) I summon all my authority, b) I look at them in the eye and hold their gaze and c) I give them a choice and finally, d) I make sure that I say the last word.\nIt is at that point where I allow no excuse to step over that boundary. I don’t need to reason and I don’t need to concede – I imply: “I am in charge here, this is my classroom, you will do as you are told”. Normally that curbs the behaviour of the most rebellious at that point.\nThis is a point of making them submit. However, I make sure that in my next interaction I show that I don’t hold a grudge = it is not personal, I don’t hate that individual student: I talk to them normal, I give them praise on anything that they do well… They soon learn that the line between what is acceptable and is not acceptable is very clear indeed and that I don’t like or dislike them based on their behaviour. By being neutral and not projecting, they soon go back to the right side of the line.\nI make sure that in these interactions I make it very unpleasant for them to be on the wrong side of the boundary line of acceptable behaviour. And bit by bit by bit, with a lot of patience, love, compassion and empathy, they align themselves with the right direction of things.\nNOT FALLING FOR “THE DRAMA”: which would allow our students to drive the lessons. There is an emotional response to everything that happens in life and it is usually quite\nBecause their energies are not fully anchored (not that many adults’ are either!), it is easy to feel for them. But feeling sorry for them puts us at their level and sucks us into their game. For me it is simply a manipulation technique that buys them some time before they actually get on with their responsibilities at the school.\nSo I ask them what’s up, then listen briefly to their pains and sorrows but take it with a pinch of salt. If they need a moment to compose themselves, that is fine.\nI do realise that they may feel under duress but I always try to quickly give them a fresh and neutral perspective of what life is about: a different outlook of the issue, which usually has the effect to get them off the emotional hook, at least for a brief moment.\nThis brief moment is usually enough to allow the lesson to continue with a certain level of harmony; the effect is usually that of bringing them back to reality and to re-grounding When they realise that they don’t need to feel sorry for themselves, they get out of their victim mentality.\nNOT “PROJECTING” YOUR OWN LIMITATIONS: I have to be very clear whether the issues in the classroom are mine or them. I can’t be projecting my negative emotions, limitations, frustrations, etc, on them because this would be the beginning of the end!\nI need to keep my house in order at all times and be centred. If I make a mistake, if I get upset because they have pressed a button, a weak point of mine, then I quickly must recover and say something along the line: “yes, this is something I still need to work on”.\nNormally, this kills the emotionally charged moment and the imbalance in the class is quickly corrected. They understand that we are all imperfect and we are all human. When this happens, they tend to quickly forget the issue and move on, continuing with their work.\nThis can be a very sensitive and touchy state of being for a teacher who may not want to admit that the students are not always wrong; but nevertheless, it is totally necessary in order to keep a good-will / balanced atmosphere in the classroom.\nOPEN-MINDNESS: I can’t come to the classroom knowing everything and deciding what is going to happen at all times. I have to come to the classroom with an attitude of allowing the energies of the moment to guide me where we all need to get to as a group that day.\nI don’t know everything about them and I don’t know what will trigger them that day, so I have to be open-minded. Life is bigger than me and these children have their own destinies. Deep inside they know what is a good or bad path for them, so when you align yourself with them, they will follow your lead without friction, and this feels like effortlessness.\nI also need to realise that their language is different from that of the previous generation so I have to be open to what they mean rather than how they say things, otherwise I might get upset about something that was not even intended!\nALLOWING FOR THE MIRACLE OF “BEING SURPRISED”: When students go further and faster that you expected, you acknowledge that they are ready to take the responsibility and follow your guidance.\nI must always stay open to the expectation that you never know when this can take place. When they do take place, I acknowledge it and make sure I sound positive and encouraging, but I don’t make a fuss. That would give them power to manipulate you in the future.\nBut it is definitely these moments that make everything worth it!\nBy Dr. Ana Garcia PhD, DTM.`
  }
];

const BlogDetail: React.FC = () => {
  const { id } = useParams();
  const blog = blogData.find(b => b.id === Number(id));
  const [comments, setComments] = useState(blog?.comments || 0);
  const [form, setForm] = useState({ name: '', email: '', website: '', comment: '', saveInfo: false });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareType, setShareType] = useState('email');
  const [shareValue, setShareValue] = useState('');
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!blog) return <div>Blog not found.</div>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.email.trim()) newErrors.email = 'Email is required.';
    if (!form.comment.trim()) newErrors.comment = 'Comment is required.';
    return newErrors;
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess(false);
      return;
    }
    setComments(c => c + 1);
    setForm({ name: '', email: '', website: '', comment: '', saveInfo: false });
    setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowShare(false);
    setShareValue('');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2500);
  };

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <Link to="/resources/articles" className="blog-back-link">&larr; Back to Blog</Link>
        <img src={blog.image} alt={blog.title} className="blog-detail-image" />
        <h2 className="blog-detail-title">{blog.title}</h2>
        <div className="blog-meta-row blog-detail-meta">
          <Link className="blog-author" to="#author-bio">{blog.author}</Link>
          <span className="blog-date">{blog.date}</span>
        </div>
        <div className="blog-comments-top" style={{ width: '100%', textAlign: 'center', marginBottom: '1.5rem' }}>
          <span className="blog-comments" style={{ cursor: 'pointer', color: '#667eea', fontWeight: 600 }} onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})}>
            {comments} comments &mdash; Leave a comment below
          </span>
        </div>
        <div className="blog-detail-body">
          {blog.content.split('\n').map((para, idx) => <p key={idx}>{para}</p>)}
        </div>
        <div
          className="blog-share-row"
          style={{ cursor: 'pointer' }}
          onClick={() => setShowShare(true)}
        >
          <span className="blog-share-icon">🔗</span>
          <span className="blog-share-text">Share this post</span>
        </div>
        {shareSuccess && (
          <div className="blog-share-success">Thank you! The blog link was shared.</div>
        )}
        {showShare && (
          <div className="blog-share-modal">
            <form className="blog-share-form" onSubmit={handleShareSubmit}>
              <h4>Share this blog</h4>
              <div className="blog-share-options">
                <label>
                  <input
                    type="radio"
                    name="shareType"
                    value="email"
                    checked={shareType === 'email'}
                    onChange={() => setShareType('email')}
                  />
                  Email
                </label>
                <label>
                  <input
                    type="radio"
                    name="shareType"
                    value="whatsapp"
                    checked={shareType === 'whatsapp'}
                    onChange={() => setShareType('whatsapp')}
                  />
                  WhatsApp
                </label>
                <label>
                  <input
                    type="radio"
                    name="shareType"
                    value="website"
                    checked={shareType === 'website'}
                    onChange={() => setShareType('website')}
                  />
                  Website/URL
                </label>
              </div>
              <div className="blog-form-group">
                <label htmlFor="shareValue">
                  {shareType === 'email' && 'Recipient Email Address'}
                  {shareType === 'whatsapp' && 'WhatsApp Number'}
                  {shareType === 'website' && 'Website/URL'}
                </label>
                <input
                  type="text"
                  id="shareValue"
                  value={shareValue}
                  onChange={e => setShareValue(e.target.value)}
                  required
                  placeholder={
                    shareType === 'email'
                      ? 'example@email.com'
                      : shareType === 'whatsapp'
                      ? '+1234567890'
                      : 'https://example.com'
                  }
                />
              </div>
              <div className="blog-share-actions">
                <button type="submit" className="blog-submit-btn">Share</button>
                <button type="button" className="blog-cancel-btn" onClick={() => setShowShare(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        <form className="blog-comment-form" onSubmit={handleCommentSubmit} style={{ marginTop: '2rem', width: '100%' }}>
          <h3>Leave your thought here</h3>
          <p className="blog-comment-note">Your email address will not be published. Required fields are marked *</p>
          {success && <div className="blog-comment-success">Thank you for your comment!</div>}
          <div className="blog-form-row">
            <div className="blog-form-group">
              <label htmlFor="name">Name *</label>
              <input type="text" id="name" name="name" value={form.name} onChange={handleInputChange} required />
              {errors.name && <div className="blog-form-error">{errors.name}</div>}
            </div>
            <div className="blog-form-group">
              <label htmlFor="email">Email *</label>
              <input type="email" id="email" name="email" value={form.email} onChange={handleInputChange} required />
              {errors.email && <div className="blog-form-error">{errors.email}</div>}
            </div>
            <div className="blog-form-group">
              <label htmlFor="website">Website</label>
              <input type="text" id="website" name="website" value={form.website} onChange={handleInputChange} />
            </div>
          </div>
          <div className="blog-form-group blog-form-comment">
            <label htmlFor="comment">Comment *</label>
            <textarea id="comment" name="comment" value={form.comment} onChange={handleInputChange} required rows={4}></textarea>
            {errors.comment && <div className="blog-form-error">{errors.comment}</div>}
          </div>
          <div className="blog-form-group blog-save-info">
            <input type="checkbox" id={`save-info-${blog.id}`} name="saveInfo" checked={form.saveInfo} onChange={handleInputChange} />
            <label htmlFor={`save-info-${blog.id}`}> Save my name, email, and website in this browser for the next time I comment.</label>
          </div>
          <button type="submit" className="blog-submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default BlogDetail; 