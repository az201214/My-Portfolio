import { Component, ErrorInfo, PropsWithChildren, ReactNode } from "react";

type ErrorBoundaryProps = PropsWithChildren<{ fallback?: ReactNode }>;

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("3D character failed; showing the static image.", error, info);
  }
  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
