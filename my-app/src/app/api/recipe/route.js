import { connectDB } from '@/app/lib/db/connection';
import { recipeSchema } from '@/app/lib/models/recipeModel';
import { NextResponse } from 'next/server';

export const GET = async (req) => {
  try {
    connectDB();
    let filterCondition = {};

    // Get filters from the query params
    const queryParams = req.nextUrl.searchParams;
    const rating = queryParams.get('rating');
    const cookingTime = queryParams.get('cookingTime');

    // If rating is provided, add it to the filter condition
    if (rating) {
      // Convert rating to a number if it's not already
      const ratingValue = parseInt(rating, 10);
      if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
        return NextResponse.json(
          {
            error: 'Invalid rating value. Rating must be between 1 and 5.',
          },
          {
            status: 400,
          },
        );
      }
      filterCondition.averageRating = ratingValue;
    }

    // If cookingTime is provided, add it to the filter condition
    if (cookingTime) {
      const cookingTimeValue = parseInt(cookingTime, 10);
      if (isNaN(cookingTimeValue)) {
        return NextResponse.json(
          {
            error: 'Invalid cooking time value.',
          },
          { status: 400 },
        );
      }

      // Depending on the cookingTime value, adjust the filter condition
      if (cookingTimeValue === 30) {
        filterCondition.cookingTime = { $lte: 30 }; // Less than or equal to 30 minutes
      } else if (cookingTimeValue === 60) {
        filterCondition.cookingTime = { $lte: 60 }; // Less than or equal to 60 minutes
      } else if (cookingTimeValue === 61) {
        filterCondition.cookingTime = { $gt: 60 }; // Greater than 60 minutes
      } else {
        return NextResponse.json({
          error:
            'Invalid cooking time value. Allowed values are 30, 60, or 61.',
        });
      }
    }

    // Fetch recipes based on filter condition
    const recipes = await recipeSchema.find(filterCondition);

    // If no recipes are found, return a message
    if (recipes.length === 0) {
      return NextResponse.json(
        {
          error: 'No recipes found matching the specified filter criteria.',
        },
        { status: 404 },
      );
    }

    // Return the filtered recipes
    return NextResponse.json(recipes, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};

export const POST = async (req) => {
  const formData = await req.formData();

  const title = formData.get('title');
  const ingredients = formData.get('ingredients');
  const steps = formData.get('steps');
  const cookingTime = formData.get('cookingTime');
  const userOwner = formData.get('userOwner');
  const image = formData.get('image');

  if (!title || !ingredients || !steps || !cookingTime || !image) {
    return NextResponse.json({ error: 'Missing recipe details' });
  }

  const imageBuffer = await image.arrayBuffer(); // Convert to Buffer
  const imageContentType = image.type; // Get the MIME type

  const recipe = new recipeSchema({
    title,
    ingredients,
    steps,
    image: {
      data: Buffer.from(imageBuffer), // Store the image as binary data
      contentType: imageContentType, // Store the MIME type of the file
    },
    cookingTime,
    userOwner,
    averageRating: 0,
  });

  try {
    connectDB();
    const newRecipe = await recipe.save();
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
};
