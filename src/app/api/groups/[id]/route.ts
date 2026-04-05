import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

type Params = { params: { id: string } };

export async function GET(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ message: 'Geçersiz ID' }, { status: 400 });

  const group = await prisma.group.findUnique({
    where: { id, status: 'approved' },
    include: {
      user: { select: { username: true } },
      category: { include: { translations: true } },
    },
  });

  if (!group) return NextResponse.json({ message: 'Grup bulunamadı' }, { status: 404 });

  return NextResponse.json({
    ...group,
    createdAt: group.createdAt.toISOString(),
    updatedAt: group.updatedAt.toISOString(),
  });
}

export async function PUT(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: 'Yetkisiz' }, { status: 401 });

  const id = Number(params.id);
  const group = await prisma.group.findUnique({ where: { id } });
  if (!group) return NextResponse.json({ message: 'Bulunamadı' }, { status: 404 });

  const isOwner = group.userId === session.user.id;
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  if (!isOwner && !isAdmin) return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });

  const body = await request.json();
  const updated = await prisma.group.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      categoryId: body.categoryId,
      language: body.language,
      status: isAdmin ? body.status : 'pending',
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ message: 'Yetkisiz' }, { status: 401 });

  const id = Number(params.id);
  const group = await prisma.group.findUnique({ where: { id } });
  if (!group) return NextResponse.json({ message: 'Bulunamadı' }, { status: 404 });

  const isOwner = group.userId === session.user.id;
  const isAdmin = (session.user as { role?: string }).role === 'admin';
  if (!isOwner && !isAdmin) return NextResponse.json({ message: 'Yetkisiz' }, { status: 403 });

  await prisma.group.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
