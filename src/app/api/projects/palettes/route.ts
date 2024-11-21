// app/api/palette/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { 
    getPaletteOptions, 
    createPaletteOption 
  } from '@/lib/utils/file_operations';
  
  export async function GET() {
    try {
      const paletteOptions = await getPaletteOptions();
      return NextResponse.json(paletteOptions);
    } catch (error) {
      return NextResponse.json({ error: 'Failed to fetch palette options' }, { status: 500 });
    }
  }
  
  export async function POST(request: NextRequest) {
    try {
      const paletteOptionData = await request.json();
      const newPaletteOption = await createPaletteOption(paletteOptionData);
      return NextResponse.json(newPaletteOption, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: 'Failed to create palette option' }, { status: 500 });
    }
  }