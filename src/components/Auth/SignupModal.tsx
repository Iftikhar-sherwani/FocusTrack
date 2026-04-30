import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, X } from 'lucide-react';
import toast from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function SignupModal({ isOpen, onClose }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      toast.error('Please enter both name and email.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim() }),
      });

      if (res.ok) {
        setSuccess(true);
        toast.success('Thanks for joining!');
        setTimeout(() => onClose(), 2000);
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to sign up');
      }
    } catch (err) {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md p-8 border shadow-2xl rounded-2xl relative"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {/* Close Button */}
            {!success && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            )}

            <div className="text-center mb-6">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text)' }}
              >
                {success ? 'Welcome to FocusTrack!' : 'Join the Community'}
              </h2>
              <p className="text-sm" style={{ color: 'var(--color-textMuted)' }}>
                {success 
                  ? 'Your details have been securely saved.' 
                  : 'Enter your details to receive updates and share your feedback with the developer.'}
              </p>
            </div>

            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--color-textMuted)' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--color-textMuted)' }}
                    />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                      className="w-full pl-9 pr-3 py-2.5 border text-sm outline-none focus:ring-1 rounded-lg"
                      style={{
                        borderColor: 'var(--color-border)',
                        background: 'var(--color-surfaceAlt)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-1" style={{ color: 'var(--color-textMuted)' }}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      style={{ color: 'var(--color-textMuted)' }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 border text-sm outline-none focus:ring-1 rounded-lg"
                      style={{
                        borderColor: 'var(--color-border)',
                        background: 'var(--color-surfaceAlt)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-sm font-bold tracking-wide transition-opacity disabled:opacity-60 rounded-lg mt-4"
                  style={{
                    background: 'var(--color-accent)',
                    color: '#fff',
                  }}
                >
                  {loading ? 'Saving...' : 'Sign Up'}
                </button>
              </form>
            ) : (
              <div className="flex justify-center mt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg text-sm font-bold"
                  style={{
                    background: 'var(--color-surfaceAlt)',
                    color: 'var(--color-text)',
                  }}
                >
                  Continue to App
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
