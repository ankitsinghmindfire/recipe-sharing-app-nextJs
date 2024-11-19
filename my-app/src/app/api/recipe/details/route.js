import { connectDB } from '@/app/lib/db/connection';
import { recipeSchema } from '@/app/lib/models/recipeModel';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  try {
    // connectDB();
    const queryParams = req.nextUrl.searchParams;
    const recipeId = queryParams.get('recipeId');

    if (!recipeId || recipeId.trim().length === 0) {
      return NextResponse.json(
        { error: 'Invalid or missing recipeId' },
        { status: 400 },
      );
    }

    const recipe = await recipeSchema.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }
    return NextResponse.json(recipe, { status: 200 });
  } catch (error) {
    console.log('error=>', error);
    return NextResponse.json({ error: 'Invalid recipeId' }, { status: 500 });
  }
};
