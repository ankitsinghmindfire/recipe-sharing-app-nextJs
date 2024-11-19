import { recipeSchema } from '@/app/lib/models/recipeModel';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const { recipeId, comment, userId, userName } = await req.json();

    const recipe = await recipeSchema.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Check if the user has already rated the recipe
    const index = recipe?.ratingsAndComments?.findIndex(
      (entry) => entry.user.toString() === userId.toString(),
    );

    if (index !== -1) {
      // If the user has already rated, update the existing rating
      recipe.ratingsAndComments[index].comment = comment;
    } else {
      // Otherwise, add a new rating
      recipe.ratingsAndComments.push({ user: userId, comment, userName });
    }

    await recipe.save();
    return NextResponse.json(
      { message: 'Comment added successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
