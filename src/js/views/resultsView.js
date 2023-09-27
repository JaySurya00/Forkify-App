import View from './view.js';
import icons from 'url:../../img/icons.svg';
import previewView from './previewView.js';
class resultView extends View{
    _parentElement= document.querySelector('.results');
    _errorMessage="No recipes found for your query. Please try again!";
    _message='';

    _generateMarkup()
    {
        return this._data.map((recipe)=> previewView.render(recipe, false)).join('');
    }
}
export default new resultView();