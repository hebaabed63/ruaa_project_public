import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError: false, err: null }; }
  static getDerivedStateFromError(err){ return { hasError: true, err }; }
  componentDidCatch(err, info){ console.error('ErrorBoundary caught', err, info); }
  render(){
    if (this.state.hasError) {
      return (
        <div dir="rtl" className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-800">
          <h2 className="font-bold mb-2">حدث خطأ أثناء العرض</h2>
          <pre className="whitespace-pre-wrap text-xs">{String(this.state.err)}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}