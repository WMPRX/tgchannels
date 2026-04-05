import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string().min(2).max(30),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = schema.parse(body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      return NextResponse.json({ message: 'Bu e-posta zaten kayıtlı' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        username: data.username,
        passwordHash,
        provider: 'email',
      },
      select: { id: true, email: true, username: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Geçersiz veriler', errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Sunucu hatası' }, { status: 500 });
  }
}
