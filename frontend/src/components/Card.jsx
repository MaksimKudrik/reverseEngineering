const Card=(props)=>{
    const{
        image,
        title,
        description,
        buttonText,
        to,
        onClick,
    }=props
    const content=(
        <div className="card">
            <div className="photo">
                <img src={image} alt={title} loading="lazy" />
            </div>
            <div className="content">
                <h2>{title}</h2>
                {description && <p className="description">{description}</p>}
                {buttonText && (<button className="card__button"
                                        onClick={onClick}>
                                            {buttonText}
                                            </button>)}
            </div>
        </div>
    )
    if (to){
        return(
        <a href={to} className="card">
            {content}
        </a>
        )
    }
    
}
export default Card