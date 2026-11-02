import { company as c } from '../config/company';
export default function KhaiToan() {
  return (<><section className="pagehead"><h1>Khái toán điện mặt trời</h1><p>Công cụ khái toán cấu hình thiết bị và chi phí hệ thống điện mặt trời</p></section>
    <section className="wrap wide"><p><a className="ghost" href={c.khaiToanUrl} target="_blank" rel="noopener noreferrer">Mở trang khái toán trong tab mới ↗</a></p>
      <iframe title="Khái toán điện mặt trời HALOSUN" className="khaitoan" src={c.khaiToanUrl} loading="lazy" referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads" /></section></>);
}
