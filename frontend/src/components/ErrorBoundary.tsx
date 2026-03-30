import React from 'react';

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
          <span
            className="material-symbols-outlined text-6xl text-error/50 mb-4"
            style={{ fontVariationSettings: "'FILL' 0" }}
          >
            warning
          </span>
          <h1 className="font-headline text-3xl font-bold text-on-surface mb-2">
            Cosmic Anomaly Detected
          </h1>
          <p className="font-body text-on-surface-variant mb-8 max-w-md">
            {this.state.error?.message || 'An unexpected error occurred in the constellation.'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = '/';
            }}
            className="px-6 py-3 rounded-2xl bg-primary text-on-primary font-label text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
          >
            Return to Base
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
