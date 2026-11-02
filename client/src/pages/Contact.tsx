import { useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks'; import { submitLead } from '../store/leadSlice';
import { company as c } from '../config/company';
export default function Contact() {
  const [f, setF] = useState({ name: '', phone: '', message: '' }); const { status, error } = useAppSelector((s) => s.lead); const dispatch = useAppDispatch();
  const on = (k: keyof typeof f) => (e: React.ChangeEvent<any>) => setF({ ...f, [k]: e.target.value });
  const send = (e: FormEvent) => { e.preventDefault(); dispatch(submitLead(f)); };
  return (<section className="wrap"><h2>Nhận tư vấn & báo giá</h2><p>{c.address}</p>
    <form onSubmit={send}><input placeholder="Họ tên" value={f.name} onChange={on('name')} /><input placeholder="Số điện thoại" value={f.phone} onChange={on('phone')} />
      <textarea placeholder="Nhu cầu của bạn" value={f.message} onChange={on('message')} /><button disabled={status === 'sending'}>Gửi yêu cầu</button>
      {status === 'ok' && <p className="ok">Đã gửi. Chúng tôi sẽ gọi lại sớm.</p>}{status === 'error' && <p className="err">{error}</p>}</form></section>);
}
