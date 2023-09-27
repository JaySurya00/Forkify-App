import { API_URL, RESULT_PER_PAGE, KEY } from './config.js';
import { getJSON, sendJSON } from './helper.js';
export const state={
    recipe: {},
    search:{
        query: '',
        results: [],
        page:1,
        resultPerPage: RESULT_PER_PAGE,
    },
    bookmarks:[],
}

const createRescipeObj=function(data){
    let { recipe }= data.data;
    recipe={
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && {key: recipe.key})
    }
    return recipe;
}



export const fetchRecipe= async (id)=>{

    try
    {
        const url= `${API_URL}${id}?key=${KEY}`;
        const data= await getJSON(url);
        state.recipe= createRescipeObj(data);
        if(state.bookmarks.some(recipe=>recipe.id===id))
        {
            state.recipe.bookmarked=true;
        }
        else
        {
            state.recipe.bookmarked=false;
        }
    }
    catch(error)
    {
        console.log(error);
        throw (error);
    }

}

export const loadSearchResult=async (query)=>{
    try
    {
        const url=`${API_URL}?search=${query}&key=${KEY}`;
        const data= await getJSON(url);
        state.search.results= data.data.recipes.map((recipe)=>{
            return {
                id: recipe.id,
                title: recipe.title,
                publisher: recipe.publisher,
                image: recipe.image_url,
            }
        });
        state.search.page=1;
    }
    catch(error)
    {
        console.log(error);
        throw (error);
    }
}

export const getSearchResultsPage= function(page= state.search.page){
    state.search.page=page;
    const start= (page-1)*state.search.resultPerPage;
    const end= page*state.search.resultPerPage;
    return state.search.results.slice(start, end);
}

export const updateServings=(newServings)=>{
    state.recipe.ingredients.forEach((ing)=>{
        ing.quantity=ing.quantity * newServings/state.recipe.servings;
    })
    state.recipe.servings=newServings;
}

export const addBookmarks= function(recipe){
    state.bookmarks.push(recipe);

    if(recipe.id===state.recipe.id) state.recipe.bookmarked=true;
    persistBookmarks();
}

export const deleteBookmarks=(id)=>{
    const index= state.bookmarks.findIndex((bookmark)=>bookmark.id===id);
    state.bookmarks.splice(index,1);
    if(state.recipe.id===id) state.recipe.bookmarked=false;
    persistBookmarks();
}

const persistBookmarks=function (){
    localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
}

export const uploadRecipe=async (newRecipe)=>{
    try{
    const dataArr= Object.entries(newRecipe);
    const ingredients= dataArr
    .filter(entry=> entry[0].startsWith('ingredient') && entry[1]!=='')
    .map((ing)=>{

        const ingArr= ing[1].replaceAll(' ','').split(',');

        if(ingArr.length!==3)
        {
            throw new Error ('Wrong ingredients format');
        }

        const [ quantity, unit, description ]= ingArr;
        return{
            quantity: quantity? +quantity: null,
            unit,
            description
        }
    })

    const recipe={
        id: newRecipe.id,
        title: newRecipe.title,
        publisher: newRecipe.publisher,
        source_url: newRecipe.sourceUrl,
        image_url: newRecipe.image,
        servings: newRecipe.servings,
        cooking_time: newRecipe.cookingTime,
        ingredients: ingredients,
    }

    console.log(recipe);
    const data= await sendJSON(`${API_URL}?key=${KEY}`, recipe);
    state.recipe= createRescipeObj(data);
    addBookmarks(state.recipe);
    console.log(state.recipe);
}
catch(error)
{
    throw error;
}
}

const init=function (){
    const bookmarks= JSON.parse(localStorage.getItem('bookmarks'));
    state.bookmarks=bookmarks;
}