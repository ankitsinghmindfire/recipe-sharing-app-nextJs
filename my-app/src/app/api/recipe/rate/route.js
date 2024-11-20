import { connectDB } from '@/app/lib/db/connection';
import { recipeSchema } from '@/app/lib/models/recipeModel';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const POST = async (req) => {
  try {
    connectDB();
    const { recipeId, rating, userId, userName } = await req.json();

    const recipe = await recipeSchema.findById(recipeId);
    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Check if the user has already rated the recipe
    const index = recipe.ratingsAndComments.findIndex(
      (entry) => entry.user.toString() === userId.toString(),
    );

    if (index !== -1) {
      // If the user has already rated, update the existing rating
      recipe.ratingsAndComments[index].rating = rating;
    } else {
      // Otherwise, add a new rating
      recipe.ratingsAndComments.push({
        user: userId,
        userName,
        rating,
      });
    }

    // Recalculate average rating
    const totalRatings = recipe.ratingsAndComments.reduce(
      (acc, entry) => acc + entry.rating,
      0,
    );
    const avgRating = totalRatings / recipe.ratingsAndComments.length || 0;

    // Round the average rating to the nearest integer
    const roundedAvgRating = Math.round(avgRating);

    // Update the average rating field
    recipe.averageRating = roundedAvgRating;

    await recipe.save();

    return NextResponse.json(
      { message: 'Rating added successfully' },
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
