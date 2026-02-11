
import { useState,useEffect } from 'react'
import Card from '../components/card'
import axios from 'axios'

const Electronics =()=>{
    const [components,setcomponents]=useState([])
    useEffect(() => {
    axios
        .get('/api/electronics')
        .then((res) => {
        setcomponents(res.data)
        })
        .catch((err) => {
        console.error(err)
        })
    }, [])
    return(
        <section className='containet'>
            <header>
                <h1>Электронные компоненты</h1>
                <a href="/" className='backLink'>← На главную</a>
            </header>

            <main className='cards grid'>
                {components.map((comp)=>(
                <Card
                key={comp.id}
                to={`/electronics/${comp.id}`}
                image={comp.images || 'none'}
                title={comp.neme_detail}
                description={comp.description || 'Нет описания'}
                buttonText="Подробнее"
                />
            ))}

            </main>
        </section>

    )
}
export default Electronics