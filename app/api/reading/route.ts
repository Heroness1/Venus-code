import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
const keys = ['signals', 'consistency', 'commitment', 'boundaries', 'context'] as const;
type Key = (typeof keys)[number];
function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00.000Z');
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value && date <= new Date();
}
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin'), host = request.headers.get('host');
  if (origin && host) { try { if (new URL(origin).host !== host) return NextResponse.json({error:'Permintaan tidak valid.'},{status:403}); } catch { return NextResponse.json({error:'Permintaan tidak valid.'},{status:403}); } }
  if (Number(request.headers.get('content-length') || 0) > 24000) return NextResponse.json({error:'Jawaban terlalu panjang.'},{status:413});
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({error:'Format permintaan tidak valid.'},{status:400}); }
  if (!body || typeof body !== 'object') return NextResponse.json({error:'Data tidak valid.'},{status:400});
  const data = body as Record<string, unknown>;
  if (typeof data.honeypot === 'string' && data.honeypot.trim()) return NextResponse.json({ok:true});
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  if (!name || name.length > 100 || /[\u0000-\u001f]/.test(name)) return NextResponse.json({error:'Nama tidak valid.'},{status:400});
  if (!validDate(data.birthDate)) return NextResponse.json({error:'Tanggal lahir tidak valid.'},{status:400});
  if (!data.answers || typeof data.answers !== 'object' || Array.isArray(data.answers)) return NextResponse.json({error:'Jawaban tidak valid.'},{status:400});
  const raw = data.answers as Record<string, unknown>;
  const labels: Record<Key,string> = {signals:'THE SIGNALS — Flirting & perhatian',consistency:'THE MOON PHASE — Konsistensi',commitment:'THE SEVENTH HOUSE — Komitmen',boundaries:'THE SHADOW — Batas & rasa aman',context:'THE FULL PICTURE — Konteks'};
  const answers = {} as Record<Key,string>;
  for (const key of keys) { const value=raw[key]; if(typeof value!=='string'||!value.trim()||value.length>3000) return NextResponse.json({error:'Lengkapi semua refleksi. Maksimal 3.000 karakter per jawaban.'},{status:400}); answers[key]=value.trim(); }
  if (Object.keys(raw).some(key=>!keys.includes(key as Key))) return NextResponse.json({error:'Ada jawaban yang tidak dikenali.'},{status:400});
  const token=process.env.TELEGRAM_BOT_TOKEN, chatId=process.env.TELEGRAM_CHAT_ID;
  if(!token||!chatId) return NextResponse.json({error:'Pengiriman belum dikonfigurasi. Coba lagi nanti.'},{status:503});
  const lines=['✦ VENUS CODE — NEW COSMIC READING','','Nama: '+name,'Tanggal lahir: '+data.birthDate,'Waktu diterima (UTC): '+new Date().toISOString(),'',...keys.flatMap(key=>['— '+labels[key]+' —',answers[key],'']),'Catatan: astrologi/numerologi adalah hiburan dan refleksi, bukan bukti karakter atau niat seseorang.'];
  const message=lines.join('\n');
  for(let i=0;i<message.length;i+=3700) {
    try {
      const response=await fetch('https://api.telegram.org/bot'+token+'/sendMessage',{method:'POST',headers:{'Content-Type':'application/json'},cache:'no-store',body:JSON.stringify({chat_id:chatId,text:message.slice(i,i+3700),disable_web_page_preview:true}),signal:AbortSignal.timeout(8000)});
      const result=await response.json() as {ok?:boolean};
      if(!response.ok||!result.ok){console.error('VENUS_CODE_TELEGRAM_SEND_FAILED');return NextResponse.json({error:'Pesan belum berhasil dikirim. Coba lagi nanti.'},{status:502});}
    } catch { console.error('VENUS_CODE_TELEGRAM_NETWORK_ERROR');return NextResponse.json({error:'Tidak dapat menghubungi Telegram saat ini.'},{status:502});}
  }
  return NextResponse.json({ok:true});
}