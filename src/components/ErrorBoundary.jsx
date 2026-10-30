import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[UNNOTICED ErrorBoundary caught an exception]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    try {
      window.location.reload();
    } catch {
      this.setState({ hasError: false, error: null });
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060608] text-slate-100 flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full p-8 rounded-3xl border border-white/[0.12] bg-[#0c0d16]/95 backdrop-blur-2xl shadow-2xl text-center space-y-5">
            <div className="w-12 h-12 mx-auto rounded-full bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <span className="font-display font-black text-xl">U</span>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display font-black text-xl text-white">System Signal Interrupted</h2>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                A transient rendering anomaly occurred while assembling the dynamic stage.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-black/60 border border-white/[0.06] text-[11px] font-mono text-purple-300/80 text-left overflow-x-auto max-h-32">
                {String(this.state.error.message || this.state.error)}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white transition-all shadow-lg shadow-purple-600/30 cursor-pointer active:scale-95"
            >
              Restore Experience
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
