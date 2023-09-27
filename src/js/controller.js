
import { state, fetchRecipe, loadSearchResult, getSearchResultsPage, updateServings, addBookmarks, deleteBookmarks, uploadRecipe } from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

// if(module.hot)
// {
//   module.hot.accept();
// }

const controlRecipe= async function()
{
  try
  {
    const id= window.location.hash.slice(1);
    if(!id) return;
    await fetchRecipe(id);
    recipeView.render(state.recipe);
    resultsView.renderUpdate(getSearchResultsPage());
    bookmarksView.renderUpdate(state.bookmarks);
  }
  catch(error)
  {
    recipeView.renderError();
  }   
}

const controlSearchResult=async function()
{
  try
  {
    const query= searchView.getQuery();
    if(!query) return;
    await loadSearchResult(query);
    resultsView.render(getSearchResultsPage());
    paginationView.render(state.search);
    
  }
  catch(error)
  {
    console.log(error);
  }
}

const controlPagination= function(gotoPage){
  resultsView.render(getSearchResultsPage(gotoPage));
  paginationView.render(state.search);
}

const controlServings= function(newServings){
  updateServings(newServings);
  // recipeView.render(state.recipe);
  recipeView.renderUpdate(state.recipe);
}

const controlBookmarks=()=>{
  if(!state.recipe.bookmarked)
  {
    addBookmarks(state.recipe);
    
  }
  else
  {
    deleteBookmarks(state.recipe.id)
  }
  recipeView.renderUpdate(state.recipe);
  bookmarksView.render(state.bookmarks);
  
}

const controlAddRecipe= async function(newRecipe)
{
  try{
  await uploadRecipe(newRecipe);
  addRecipeView.renderMessage('Recipe Uploaded Successfuly!');
  console.log(state.recipe);

  recipeView.render(state.recipe);
  bookmarksView.render(state.bookmarks);
  window.history.pushState(null,'', `#${state.recipe.id}`);
  setTimeout(function(){
    addRecipeView.toggleWindow()
  },2500)
  }
  catch(error)
  {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
}

const init=()=>{
  recipeView.addHandlerRender(controlRecipe);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerServingsBtn(controlServings);
  recipeView.addHandlerBookmarks(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
}
init();

