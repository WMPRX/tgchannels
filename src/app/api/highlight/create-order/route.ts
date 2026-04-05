import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

const HIGHLIGHT_PRICE = 243.60;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: 'Giriş yapmanız gerekiyor' }, { status: 401 });
  }

  const { groupId, durationDays = 7 } = await request.json();
  if (!groupId) return NextResponse.json({ message: 'Grup ID gerekli' }, { status: 400 });

  const group = await prisma.group.findUnique({
    where: { id: Number(groupId), userId: session.user.id },
  });
  if (!group) return NextResponse.json({ message: 'Grup bulunamadı' }, { status: 404 });

  const order = await prisma.highlightOrder.create({
    data: {
      groupId: Number(groupId),
      userId: session.user.id,
      amount: HIGHLIGHT_PRICE * (durationDays / 7),
      currency: 'TRY',
      durationDays,
      paymentStatus: 'pending',
    },
  });

  // In production, redirect to payment gateway here
  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    message: 'Ödeme entegrasyonu için iletişime geçin',
  });
}
