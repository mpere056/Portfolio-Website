'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

export default class ExhibitExperienceBoundary extends Component<
  { children: ReactNode; projectHref: string },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[museum] exhibit experience unavailable', error, info.componentStack);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section role="alert" className="rounded-[2rem] border border-amber-100/15 bg-[#15120d] p-6 text-stone-100">
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.24em] text-amber-100/50">The interactive layer is resting</p>
        <h3 className="mt-3 font-serif text-3xl">LifeInbox is still reachable.</h3>
        <p className="mt-3 max-w-xl text-sm leading-6 text-stone-300/60">The exhibit identity and evidence remain intact even when its optional demonstration cannot load.</p>
        <a href={this.props.projectHref} className="mt-5 inline-flex rounded-full border border-amber-100/20 px-4 py-2 text-sm text-amber-50">Enter the project world</a>
      </section>
    );
  }
}
