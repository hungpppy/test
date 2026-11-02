import { Component } from 'react';
interface Props { items: { label: string; target: number }[]; speed?: number }
interface State { tick: number }
// Class Component: constructor → render → componentDidMount → componentDidUpdate → componentWillUnmount
export default class Stats extends Component<Props, State> {
  static defaultProps = { speed: 30 };
  state: State = { tick: 0 }; timer?: number;
  componentDidMount() { this.timer = window.setInterval(() => this.setState((s) => ({ tick: Math.min(s.tick + 1, 50) })), this.props.speed); }
  componentDidUpdate(_p: Props, s: State) { if (s.tick === 49 && this.state.tick === 50) clearInterval(this.timer); }
  componentWillUnmount() { clearInterval(this.timer); }
  render() {
    return <div className="stats">{this.props.items.map((i) =>
      <div key={i.label}><b>{Math.round((i.target * this.state.tick) / 50).toLocaleString('vi')}+</b><span>{i.label}</span></div>)}</div>;
  }
}
