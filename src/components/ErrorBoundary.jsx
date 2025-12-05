import { Component } from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-900/20 backdrop-blur-xl rounded-2xl p-8 max-w-md text-center border border-purple-500/20"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Klaida</h2>
            <p className="text-white/80 mb-6">
              Įvyko klaida kraunant komponentą. Prašome perkrauti puslapį.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="px-6 py-3 bg-purple-500/80 hover:bg-purple-500 rounded-lg text-white font-semibold transition-all"
            >
              Perkrauti puslapį
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
