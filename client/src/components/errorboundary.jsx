import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <main className="grid min-h-screen place-items-center bg-bg p-6"><section className="max-w-md rounded-2xl border border-border bg-surface p-6 text-center"><h1 className="text-xl font-bold text-textPrimary">This page could not load</h1><p className="mt-2 text-sm text-textSecondary">Please refresh the page and try again.</p><button type="button" onClick={() => window.location.reload()} className="mt-5 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white">Refresh page</button></section></main>;
    }
    return this.props.children;
  }
}
