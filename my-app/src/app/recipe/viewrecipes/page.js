'use client';
import { ToastContainer } from 'react-toastify';
import Image from 'next/image';
import { cookingTimeData, ratingData } from '@/app/utils/appConstants';
import { useEffect, useState } from 'react';
import InputField from '@/app/_components/input/InputField';
import { Messages } from '@/app/utils/messages';
import { API, ApiMethods } from '@/app/utils/util';
import { Rating } from 'react-simple-star-rating';
import Button from '@/app/_components/button/Button';
import { DropDown } from '@/app/_components/dropdown/Dropdown';
import TextareaField from '@/app/_components/textarea/TextareaField';
import isAuth from '@/app/_components/auth/isAuthenticated';
import { request } from '@/app/utils/request';
import { useRouter } from 'next/navigation';
import { redirect } from 'next/navigation';

const ViewAllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState({});
  const [rating, setRating] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async (filters = {}) => {
    try {
      // Construct query parameters based on the filters provided
      const queryParams = new URLSearchParams(filters).toString();

      const response = await request({
        method: ApiMethods.GET,
        url: `${API.recipeAPI.recipe}?${queryParams}`,
      });
      if (!response.error) {
        // Generate Blob URLs for each recipe image
        const recipeImages = response?.map((recipe) => {
          const blob = new Blob([Int8Array.from(recipe.image.data.data)], {
            type: recipe.image.contentType,
          });

          return window.URL.createObjectURL(blob);
        });
        setRecipes(response);
        setImages(recipeImages);
      } else {
        setRecipes([]); // Clear recipes if there's an error
      }
    } catch (error) {
      console.log(error);
    }
  };

  const SearchRecipes = async (e) => {
    try {
      if (e.target.value) {
        let Searchedrecipes = await request({
          url: `${API.recipeAPI.searchRecipes}`,
          method: ApiMethods.GET,
          params: {
            key: e.target.value,
          },
        });
        // Set the searched recipes or empty if none found
        if (!Searchedrecipes.message) {
          setRecipes(Searchedrecipes);
        } else {
          setRecipes([]);
        }
      } else {
        fetchRecipes();
      }
    } catch (error) {
      console.log(error);
      toast.error(Messages.errors.UNABLE_TO_SEARCH);
    }
  };

  return (
    <div style={{ marginTop: '60px' }}>
      <h1>Recipes</h1>
      <ToastContainer />
      <div className='filters'>
        <div className='rating-filter'>
          <DropDown
            id='ratings'
            itemsList={ratingData} // Dropdown for rating filter
            label='Ratings  '
            optionStyle={'stars'}
            // onChange={handleRatingsFilter}
          />
          <Button
            className={'clear clear-rating'}
            // onClick={handleResetFilters}
            id='clear-rating-button'
            aria-label='Clear Rating Filter'
          >
            Clear Filter
          </Button>
        </div>
        <div className='time-filter'>
          <DropDown
            id='cookingTime'
            itemsList={cookingTimeData}
            label='CookingTime  '
            // onChange={handleCookingTimeFilter}
            optionStyle={'time'}
          />
          <Button
            className={'clear clear-time'}
            // onClick={handleResetFilters}
            id='clear-time-button'
          >
            Clear Filter
          </Button>
        </div>
        <div className='search-bar'>
          <InputField
            type='text'
            className='search-input'
            placeholder='Search recipes'
            onChange={(e) => SearchRecipes(e)}
            isBr={true}
            id='search'
          />
        </div>
      </div>
      {recipes.length > 0 ? (
        <ul
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
          }}
        >
          {recipes?.map((recipe, index) => (
            <li key={recipe._id}>
              <div>
                <h2>{recipe.title}</h2>
              </div>
              <div style={{ margin: '20px', width: '400px' }}>
                {recipe.steps.match(/^\d+\./) ? (
                  <div>
                    {recipe.steps.split('\n').map((step, index) => (
                      <p key={index}>{step}</p>
                    ))}
                  </div>
                ) : (
                  <ol>
                    {recipe.steps
                      .split('\n')
                      .map(
                        (step, index) => step && <li key={index}>{step}</li>,
                      )}
                  </ol>
                )}
              </div>
              <Image
                src={images[index]}
                alt={recipe.title}
                width={400}
                height={400}
                onClick={() => {
                  // router.push(`/recipe/${recipe._id}`);
                  const recipeId = recipe._id;
                  router.push(`/recipe/${recipeId}`);
                }}
              />
              <div>
                <h3>Average Rating</h3>
                <Rating readonly initialValue={recipe?.averageRating} />{' '}
                {/* Display recipe average rating */}
              </div>
              <h3>Ingredients:</h3>
              <ul>
                {recipe.ingredients.length > 0 && (
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                )}
              </ul>
              <TextareaField
                placeholder={'Add comment'}
                className='add-comment'
                onChange={(event) =>
                  setComments((prev) => ({
                    ...prev,
                    [recipe._id]: event.target.value, // Update the comment for the specific recipe
                  }))
                }
                value={comments[recipe._id] || ''} // Get the comment for the specific recipe
              />
              <br />
              <Button
                data-testid='addComment'
                className={'btn-add-comment'}
                type='button'
                onClick={() => handleAddComment(recipe._id)} // Handle comment submission
                role='button'
              >
                Add comment
              </Button>
              <br />
              <Rating
                onClick={(rate) => handleRating(rate, recipe._id)} // Handle rating submission
                emptyColor='gray'
                initialValue={rating}
                value={rating}
                className={`${index}`}
              />
              <p>Cooking Time: {recipe.cookingTime} minutes</p>

              {recipe.ratingsAndComments.length > 0 && (
                <div style={{ width: '400px' }}>
                  <h1>Customer Ratings and Comments</h1>

                  {recipe.ratingsAndComments.map((entry, index) => (
                    <div key={index}>
                      <h4>{entry.userName}</h4>
                      <Rating initialValue={entry.rating} size='15' readonly />
                      <br />
                      <p>{entry.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <h2>{Messages.success.RECIPE_NOT_FOUND}</h2>
      )}
    </div>
  );
};

export default isAuth(ViewAllRecipes);
