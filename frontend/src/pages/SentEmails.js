import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SentEmails = () => {
  // Sample sent emails data
  const [sentEmails, setSentEmails] = useState([
    {
      id: 1,
      to: 'contact@acmecorp.com',
      subject: 'Partnership Opportunity with Our Company',
      content: 'Dear Acme Corporation team,\n\nI recently came across your company and was impressed by your work in innovative technology solutions...',
      sentAt: '2023-04-10T14:30:00Z',
      company: 'Acme Corporation',
      status: 'delivered'
    },
    {
      id: 2,
      to: 'hello@techvision.io',
      subject: 'Collaboration Proposal for TechVision',
      content: 'Dear TechVision team,\n\nI was researching companies in your industry and was particularly interested in your approach to AI-powered analytics...',
      sentAt: '2023-04-09T11:15:00Z',
      company: 'TechVision Inc.',
      status: 'opened'
    },
    {
      id: 3,
      to: 'info@globex.com',
      subject: 'How we can help Globex optimize operations',
      content: 'Hello Globex team,\n\nI noticed that your company has been expanding rapidly in the past year...',
      sentAt: '2023-04-05T09:45:00Z',
      company: 'Globex Corporation',
      status: 'replied'
    }
  ]);

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

        {sentEmails.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-neutral-500">No emails have been sent yet.</p>
          </div>
        ) : (
          sentEmails.map(email => (
            <motion.div
              key={email.id}
              className="grid grid-cols-[1fr,1fr,auto,auto] md:grid-cols-[2fr,3fr,1fr,auto] gap-4 p-4 border-b border-neutral-100 items-center hover:bg-neutral-50 transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h3 className="font-medium text-neutral-800">{email.company}</h3>
                <p className="text-sm text-neutral-500 truncate">{email.to}</p>
              </div>
              
              <div className="truncate">{email.subject}</div>
              
              <div className="text-sm text-neutral-500">
                {new Date(email.sentAt).toLocaleDateString()}
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
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SentEmails; 