import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchSentEmails } from '../utils/supabaseService';

const SentEmails = () => {
  // State to store sent emails
  const [sentEmails, setSentEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load sent emails on component mount
  useEffect(() => {
    const loadSentEmails = async () => {
      setLoading(true);
      try {
        const emails = await fetchSentEmails();
        setSentEmails(emails);
      } catch (error) {
        console.error('Error loading sent emails:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSentEmails();
  }, []);

  // State to track the currently hovering email
  const [hoveredEmailId, setHoveredEmailId] = useState(null);
  const hoverTimerRef = useRef(null);

  // Handle mouse enter to start the hover timer
  const handleMouseEnter = (emailId) => {
    clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setHoveredEmailId(emailId);
    }, 2200); // 2.2 seconds
  };

  // Handle mouse leave to clear the hover timer
  const handleMouseLeave = () => {
    clearTimeout(hoverTimerRef.current);
    setHoveredEmailId(null);
  };

  // Extended content for popups
  const getExtendedContent = (id) => {
    switch(id) {
      case 1:
        return `Dear Acme Corporation team,

I recently came across your company and was impressed by your work in innovative technology solutions. I believe there could be some great opportunities for collaboration between our organizations.

Our company specializes in software solutions that could complement your hardware offerings, creating an integrated ecosystem for customers.

Would you be open to a brief call next week to discuss potential partnership opportunities? I'm available Tuesday or Thursday afternoon.

Looking forward to your response,

Your Name
Position | Company
Phone: (123) 456-7890
Email: your.email@company.com`;
      case 2:
        return `Dear TechVision team,

I was researching companies in your industry and was particularly interested in your approach to AI-powered analytics. Your innovative solutions align well with our goals for the upcoming quarter.

Our team at [Company Name] has developed complementary technology in the machine learning space, and I believe there's potential for significant synergy between our companies.

I'd love to schedule a conversation to explore how we might work together on future projects. Would you have 30 minutes available in the next couple of weeks?

Thank you for considering this opportunity.

Best regards,

Your Name
Position | Company
Phone: (123) 456-7890`;
      case 3:
        return `Hello Globex team,

I noticed that your company has been expanding rapidly in the past year. First of all, congratulations on your growth and success!

With rapid scaling often comes operational challenges. Our company specializes in helping organizations like yours optimize their processes and maintain efficiency during periods of growth.

We've worked with several companies in your industry to implement solutions that resulted in 15-20% cost reduction while improving output quality.

I'd be happy to share some case studies or discuss specific ways we might be able to support your continued growth. Would you be available for a quick call next week?

Looking forward to connecting,

Your Name
Position | Company
Phone: (123) 456-7890`;
      default:
        return '';
    }
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">Sent Emails</h1>
        <p className="text-neutral-500">Track and manage your sent email campaigns</p>
      </div>

      {/* Email Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-primary-600 mb-2">{sentEmails.length}</div>
          <div className="text-sm text-neutral-500">Total Emails Sent</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {sentEmails.filter(email => email.status === 'opened' || email.status === 'replied').length}
          </div>
          <div className="text-sm text-neutral-500">Opened Emails</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="text-3xl font-bold text-secondary-500 mb-2">
            {sentEmails.filter(email => email.status === 'replied').length}
          </div>
          <div className="text-sm text-neutral-500">Replies Received</div>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-[1fr,1fr,auto,auto] md:grid-cols-[2fr,3fr,1fr,auto] gap-4 p-4 border-b border-neutral-200 bg-neutral-50">
          <div className="text-sm font-medium text-neutral-500">Company</div>
          <div className="text-sm font-medium text-neutral-500">Subject</div>
          <div className="text-sm font-medium text-neutral-500">Sent Date</div>
          <div className="text-sm font-medium text-neutral-500">Status</div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-neutral-500">Loading sent emails...</p>
          </div>
        ) : sentEmails.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-500">No emails have been sent yet.</p>
          </div>
        ) : (
          sentEmails.map(email => (
            <motion.div
              key={email.id}
              className="grid grid-cols-[1fr,1fr,auto,auto] md:grid-cols-[2fr,3fr,1fr,auto] gap-4 p-4 border-b border-neutral-100 items-center hover:bg-neutral-50 transition-colors relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              onMouseEnter={() => handleMouseEnter(email.id)}
              onMouseLeave={handleMouseLeave}
            >
              <div>
                <h3 className="font-medium text-neutral-800">{email.company}</h3>
                <p className="text-sm text-neutral-500 truncate">{email.to_email}</p>
              </div>
              
              <div className="truncate">{email.subject}</div>
              
              <div className="text-sm text-neutral-500">
                {new Date(email.sent_at).toLocaleDateString()}
              </div>
              
              <div>
                {email.status === 'delivered' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Delivered
                  </span>
                )}
                {email.status === 'opened' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Opened
                  </span>
                )}
                {email.status === 'replied' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Replied
                  </span>
                )}
              </div>

              {/* Email Preview Popup */}
              {hoveredEmailId === email.id && (
                <motion.div 
                  className="absolute z-50 w-[600px] bg-white rounded-xl shadow-lg p-0 left-1/2 top-0 -translate-x-1/2 -translate-y-full mt-[-20px]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Email Header */}
                  <div className="px-6 py-4 border-b border-neutral-200 bg-neutral-50 rounded-t-xl">
                    <div className="flex justify-between items-center mb-2">
                      <div className="font-medium">{email.subject}</div>
                      <div className="text-xs text-neutral-500">{new Date(email.sent_at).toLocaleString()}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-neutral-500">To: </span>
                        <span>{email.to_email}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">From: </span>
                        <span>you@company.com</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Email Body */}
                  <div className="p-6 max-h-[400px] overflow-y-auto">
                    <div className="whitespace-pre-line text-neutral-700">
                      {email.content}
                    </div>
                  </div>
                  
                  {/* Email Footer */}
                  <div className="px-6 py-3 border-t border-neutral-200 bg-neutral-50 rounded-b-xl text-xs text-neutral-500">
                    <div className="flex justify-between">
                      <div>{email.status === 'delivered' ? 'Delivered' : email.status === 'opened' ? 'Opened' : 'Replied'}</div>
                      <div>Sent via Email Generator</div>
                    </div>
                  </div>

                  {/* Triangle pointer */}
                  <div className="absolute left-1/2 bottom-0 translate-y-full -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentEmails; 