import icons from 'url:../../img/icons.svg';
export default class View{
    _data;

    render(data, render=true){
        if(!data || (Array.isArray(data) && data.length==0)){
            return this.renderError();
        }
        this._data= data;
        const markup= this._generateMarkup();
        if(!render) return markup;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }

    _clear()
    {
        this._parentElement.innerHTML='';
    }
    renderError(message=this._errorMessage)
    {
        const markup= `
            <div class="error">
                <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
                </div>
                <p>${message}</p>
            </div> `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }
    renderMessage(message= this.message)
    {
        const markup= `
        <div class="message">
            <div>
            <svg>
                <use href="${icons}#icon-smile"></use>
            </svg>
            </div>
            <p>${message}</p>
        </div> `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin',markup);
    }
    renderUpdate(data){
        if(!data || (Array.isArray(data) && data.length==0)){
            return this.renderError();
        }
        this._data= data;
        
        const newMarkup= this._generateMarkup();
        const newDOM= document.createRange().createContextualFragment(newMarkup);
        const newElement= Array.from(newDOM.querySelectorAll('*'));
        const currElement= Array.from(this._parentElement.querySelectorAll('*'));
        // console.log(newElement, currElement);
        newElement.forEach((newEl, i)=>{
            const currEl=currElement[i];
            if(!newEl.isEqualNode(currEl) && newEl.firstChild?.nodeValue.trim())
            {
                currEl.textContent=newEl.textContent;
            }
            if(!newEl.isEqualNode(currEl))
            {
                Array.from(newEl.attributes).forEach((atr)=>{
                    currEl.setAttribute(atr.name, atr.value);
                })
            }
        })
    }
}