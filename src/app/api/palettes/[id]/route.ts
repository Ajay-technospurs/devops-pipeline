import { NextRequest, NextResponse } from 'next/server';


// app/api/palette/[id]/route.ts
import { 
  getPaletteOptionById, 
  updatePaletteOption, 
  deletePaletteOption 
} from '@/lib/utils/file_operations';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const paletteOption = await getPaletteOptionById(params.id);
    if (!paletteOption) {
      return NextResponse.json({ error: 'Palette option not found' }, { status: 404 });
    }
    return NextResponse.json(paletteOption);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch palette option' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const paletteOptionData = await request.json();
    const updatedPaletteOption = await updatePaletteOption(params.id, paletteOptionData);
    if (!updatedPaletteOption) {
      return NextResponse.json({ error: 'Palette option not found' }, { status: 404 });
    }
    return NextResponse.json(updatedPaletteOption);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update palette option' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    await deletePaletteOption(params.id);
    return NextResponse.json({ message: 'Palette option deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete palette option' }, { status: 500 });
  }
}