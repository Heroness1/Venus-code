'use client';
import { useState, type FormEvent } from 'react';

const questions = [
  ['signals', 'The Signals', 'Ceritakan contoh perhatian atau flirting yang membuatmu bertanya-tanya.'],
  ['consistency', 'The Moon Phase', 'Apakah kata-kata dan tindakan konsisten dari waktu ke waktu? Beri contoh.'],
  ['commitment', 'The Seventh House', 'Apa yang sudah dibicarakan tentang status, komitmen, atau eksklusivitas?'],
  ['boundaries', 'The Shadow', 'Bagaimana dia merespons saat kamu menyampaikan kebutuhan atau batasan?'],
  ['context', 'The Full Picture', 'Apa konteks lain yang penting agar situasinya tidak dinilai dari satu kejadian?'],
] as const;

function sunSign(value: string) {
  if (!value) return '';
  const date = new Date(value + 'T12:00:00Z');
  const month = date.getUTCMonth() + 1, day = date.getUTCDate();
  if ((month===3&&day>=21)||(month===4&&day<=19)) return 'Aries';
  if ((month===4&&day>=20)||(month===5&&day<=20)) return 'Taurus';
  if ((month===5&&day>=21)||(month===6&&day<=20)) return 'Gemini';
  if ((month===6&&day>=21)||(month===7&&day<=22)) return 'Cancer';
  if ((month===7&&day>=23)||(month===8&&day<=22)) return 'Leo';
  if ((month===8&&day>=23)||(month===9&&day<=22)) return 'Virgo';
  if ((month===9&&day>=23)||(month===10&&day<=22)) return 'Libra';
  if ((month===10&&day>=23)||(month===11&&day<=21)) return 'Scorpio';
  if ((month===11&&day>=22)||(month===12&&day<=21)) return 'Sagittarius';
  if ((month===12&&day>=22)||(month===1&&day<=19)) return 'Capricorn';
  if ((month===1&&day>=20)||(month===2&&day<=18)) return 'Aquarius';
  return 'Pisces';
}
function lifePath(value: string) {
  if (!value) return '';
  let n = value.replaceAll('-', '').split('').reduce((a, b) => a + Number(b), 0);
  while (n > 9 && ![11,22,33].includes(n)) n = String(n).split('').reduce((a,b)=>a+Number(b),0);
  return String(n);
}

export default function Home() {
  const [name,setName]=useState(''), [birthDate,setBirthDate]=useState('');
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [busy,setBusy]=useState(false), [done,setDone]=useState(false), [error,setError]=useState('');
  const [honeypot,setHoneypot]=useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError('');
    if (!name.trim() || !birthDate || questions.some(([id])=>!answers[id]?.trim())) { setError('Lengkapi profil dan semua refleksi.'); return; }
    setBusy(true);
    try {
      const response=await fetch('/api/reading',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,birthDate,answers,honeypot})});
      const result=await response.json();
      if (!response.ok) throw new Error(result.error || 'Pengiriman gagal.');
      setDone(true);
    } catch (err) { setError(err instanceof Error ? err.message : 'Terjadi kesalahan.'); }
    finally { setBusy(false); }
  }
  return <main className="shell">
    <header><a className="brand" href="#top">✦ VENUS CODE</a><span>A COSMIC REFLECTION</span></header>
    <section className="hero" id="top"><div className="moon">☾</div><p className="eyebrow">✧ YOUR STORY, WRITTEN IN THE STARS ✧</p><h1>Decode<br/><em>the Vibe.</em></h1><p className="lead">Jelajahi dinamika hubungan lewat simbol kosmik dan refleksi yang jujur. Bukan untuk menghakimi—melainkan melihat pola dengan lebih jernih.</p><a className="gold" href="#reading">Mulai cosmic reading ↘</a><p className="orbit-label">ASTROLOGY　✦　NUMEROLOGY　✦　SELF REFLECTION</p></section>
    <section className="features"><article><b>☉</b><h2>Cosmic profile</h2><p>Zodiak dan angka numerologi berdasarkan tanggal lahir.</p></article><article><b>☽</b><h2>Relationship patterns</h2><p>Refleksi sinyal, konsistensi, batasan, dan kejelasan.</p></article><article><b>✧</b><h2>Your perspective</h2><p>Perilaku nyata lebih penting daripada ramalan.</p></article></section>
    <section className="form-wrap" id="reading"><div className="heading"><p className="eyebrow">THE PERSONAL READING</p><h2>Open your <em>cosmic file.</em></h2><p>Isi dengan jujur, spesifik, dan sesuai pengalamanmu.</p></div>
    {done ? <div className="success"><b>✦</b><h2>Your reflection is in orbit.</h2><p>Jawaban berhasil dikirim. Hasilnya adalah bahan refleksi, bukan bukti mutlak tentang karakter atau niat siapa pun.</p><button type="button" onClick={()=>{setDone(false);setName('');setBirthDate('');setAnswers({});}}>Mulai lagi</button></div> :
    <form onSubmit={submit}>
      <section className="panel"><p className="step">01</p><h2>Birth profile</h2><p className="muted">Mulai dari data kosmik dasar.</p>
      <label>Nama<input value={name} onChange={e=>setName(e.target.value)} maxLength={100} autoComplete="name" placeholder="Nama yang ingin kamu gunakan" required/></label>
      <label>Tanggal lahir lengkap<input type="date" value={birthDate} onChange={e=>setBirthDate(e.target.value)} max={new Date().toISOString().slice(0,10)} required/></label>
      {birthDate && <div className="result"><div><small>YOUR SUN SIGN</small><strong>{sunSign(birthDate)}</strong></div><div><small>LIFE PATH NUMBER</small><strong>{lifePath(birthDate)}</strong></div><p>Interpretasi simbolik untuk hiburan dan refleksi, bukan penilaian ilmiah.</p></div>}
      </section>
      <section className="panel"><p className="step">02</p><h2>The relationship spread</h2><p className="muted">Fokus pada tindakan yang kamu amati, bukan dugaan tentang isi pikirannya.</p>
      {questions.map(([id,title,question],i)=><label className="question" key={id}><small>0{i+1}</small><strong>{title}</strong><span>{question}</span><textarea rows={4} maxLength={3000} required value={answers[id]||''} onChange={e=>setAnswers(old=>({...old,[id]:e.target.value}))} placeholder="Tulis pengalaman konkret di sini…"/></label>)}
      </section>
      <label className="honeypot">Kosongkan<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={e=>setHoneypot(e.target.value)}/></label>
      <aside className="privacy"><b>◈ Catatan privasi</b><p>Saat kamu menekan tombol kirim, nama, tanggal lahir, dan seluruh jawaban esai akan dikirim ke Telegram pengelola VENUS CODE untuk ditinjau. Hindari memasukkan kata sandi, data finansial, atau informasi sangat sensitif tentang dirimu maupun orang lain.</p></aside>
      {error && <p className="error" role="alert">{error}</p>}<button className="gold submit" disabled={busy}>{busy?'Mengirim ke bintang…':'Kirim & buka reading ✦'}</button>
      <p className="disclaimer">Astrologi dan numerologi tidak dapat membuktikan seseorang setia, manipulatif, atau memiliki sifat tertentu.</p>
    </form>}
    </section><footer><a className="brand" href="#top">✦ VENUS CODE</a><p>Look for patterns. Trust observable actions.</p><small>MADE UNDER THE SAME SKY</small></footer>
  </main>;
}
