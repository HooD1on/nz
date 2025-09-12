import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

const API_BASE_URL = process.env.BACKEND_API_URL?.replace(/\/$/, '') || 'http://localhost:5152';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: '缺少Stripe签名' }, { status: 400 });
    }

    // 转发到后端处理webhook
    const response = await fetch(`${API_BASE_URL}/api/payments/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Stripe-Signature': sig
      },
      body: body
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Webhook处理失败' }, { status: response.status });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook错误:', error);
    return NextResponse.json({ error: '处理webhook失败' }, { status: 400 });
  }
}