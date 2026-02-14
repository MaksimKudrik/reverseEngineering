import { useState,useEffect } from "react"
import {useParams} from "react-router-dom"
import axios from "axios"


const ElectronicsDetail =()=>{
    const {id} = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState(null)

    useEffect(()=>{
        axios
            .get(`/api/electronics/${id}`)
            .then((res)=>{
                setData(res.data)
                setLoading(false)
            })
            .catch((err)=>{
                setError(err.response?.data?.error || 'Ошибка загрузки')
                setLoading(false)
            })
    },[id])


    const openModal = (device) => setSelectedDevice(device)
    const closeModal = () => setSelectedDevice(null)

    if (loading) return <p>Загрузка...</p>
    if (error) return <div className="container_error">{error}</div>
    if (!data.component) return  <p>Компонент не найден</p>


    const {component, devices} = data
    

    return(
        <div className="container">
            <header>
                <a href="/electronics" className="backLink">← Назад к компонентам</a>
            </header>

            <h1>{component.name_detail}</h1>
            <p>{component.description || 'Нет описания'}</p>


            <h2>Устройсттва на базе этого компонента ({devices.length})</h2>


            <div className="device-card">
                {devices.length === 0 ?(
                    <p className="empty">Пока нет устройств на базе этого компонента</p>
                ):(
                    devices.map((dev)=>(
                        <div className="device-card" key={dev.id}>
                            <div className="photo">
                                {dev.images ? (
                                    <img src={dev.images} alt={dev.name_device} loading="lazy" />
                                ):(
                                    <div className="no-photo">Нет фото</div>
                                )}
                            </div>
                            <div className="contenet">
                                <h3>{dev.name_device}</h3>
                                <button
                                className="content__button"
                                onClick={()=>openModal(dev)}
                                >
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {selectedDevice && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal__content" onClick={(e)=>e.stopPropagation()}>
                        <span className="modal__close" onClick={closeModal}>
                            &times;
                        </span>
                        {selectedDevice.images ? (
                            <img src={selectedDevice.images} 
                                alt={selectedDevice.name_device} 
                                className='modal__image'
                            />
                        ):(
                            <div className="no-photo">Нет фото</div>
                        )}
                        <h2>{selectedDevice.name_device}</h2>
                        <p className="modal__description">
                            {selectedDevice.parameters || 'Нет описания'}
                        </p>

                        <p className="modal__price">
                            Цена: {selectedDevice.price ? `${selectedDevice.price} ₽`: '-'}
                        </p>

                    </div>
                </div>
            )}

        </div>
    )

}
export default ElectronicsDetail