import { Component, ErrorInfo, PropsWithChildren } from "react";
export default class ErrorBoundary extends Component<
  PropsWithChildren,
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn("Optional visual component failed", error, info);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
