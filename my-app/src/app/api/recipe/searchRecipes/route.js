import { recipeSchema } from '@/app/lib/models/recipeModel';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  try {
    const queryParams = req.nextUrl.searchParams;
    const searchKey = queryParams.get('key');

    const recipes = await recipeSchema.find({
      ingredients: {
        $regex: new RegExp(searchKey, 'i'),
      },
    });
    if (recipes.length === 0) {
      return NextResponse.json(
        { message: 'No recipes found' },
        { status: 404 },
      );
    }
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { stauts: 500 },
    );
  }
};
