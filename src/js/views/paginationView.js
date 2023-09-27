import View from './view.js';
import icons from 'url:../../img/icons.svg';
class paginationView extends View{
    _parentElement= document.querySelector('.pagination');

    addHandlerClick(handler)
    {
        this._parentElement.addEventListener('click',(e)=>{
            e.preventDefault();
            const btn= e.target.closest('.btn--inline');
            const goto= parseInt(btn.getAttribute('data-goto'));
            if(!btn) return;
            handler(goto);
        })
    }

    _generateMarkup()
    {
        const numPages= Math.ceil(this._data.results.length/this._data.resultPerPage);
        const currPage=this._data.page;
        if(currPage===1 && numPages>currPage)
        {
            return `
                <button data-goto=${currPage+1} class="btn--inline pagination__btn--next">
                    <span>${currPage+1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button> `;
        }
        if(currPage===numPages)
        {
            return `
            <button data-goto=${currPage-1}  class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>${currPage-1}</span>
            </button>`;
        }
        if(currPage!==1 && numPages>currPage)
        {
            return `
            <button data-goto=${currPage-1}  class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>${currPage-1}</span>
            </button>
            <button data-goto=${currPage+1}  class="btn--inline pagination__btn--next">
                <span>${currPage+1}</span>
                <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button> `;
        }
        return '';

    }
}

export default new paginationView();