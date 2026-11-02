// JSX thuần (.jsx) – function component + props + state
import { useState } from 'react';
export default function Banner({ messages }) {
  const [i, setI] = useState(0);
  return (<div className="banner" onClick={() => setI((i + 1) % messages.length)} role="button" tabIndex={0}>
    ☀️ {messages[i]} <small>(bấm để xem tiếp)</small></div>);
}
