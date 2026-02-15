import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import ScrollToTop from "../components/scrollButton"

const ElectronicsDetail = () => {
    const { id } = useParams()
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState(null)

    useEffect(() => {
        axios
            .get(`/api/electronics/${id}`)
            .then((res) => {
                setData(res.data)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.response?.data?.error || 'Ошибка загрузки')
                setLoading(false)
            })
    }, [id])

    const openModal = (device) => setSelectedDevice(device)
    const closeModal = () => setSelectedDevice(null)

    if (loading) return <p>Загрузка...</p>
    if (error) return <div className="container_error">{error}</div>
    if (!data.component) return <p>Компонент не найден</p>

    const { component, devices } = data

    return (
        <div className="container">
            <header>
                <a href="/electronics" className="backLink">← Назад к компонентам</a>
            </header>

            <h1>{component.name_detail}</h1>
            <p>{component.description || 'Нет описания'}</p>

            <h2>Устройства на базе этого компонента ({devices.length})</h2>

            <div className="device-cards">
                {devices.length === 0 ? (
                    <p className="empty">Пока нет устройств на базе этого компонента</p>
                ) : (
                    devices.map((dev) => (
                        <div className="device-card" key={dev.id}>
                            <div className="photo">
                                <img 
                                    src={dev.images || "/images/placeholder.png"} 
                                    alt={dev.name_device} 
                                    loading="lazy"
                                    onError={(e) => {
                                        e.target.onerror = null
                                        e.target.src = "/images/placeholder.png"
                                    }}
                                />
                            </div>
                            <div className="device-card__content">
                                <h3>{dev.name_device}</h3>
                                <button
                                    className="device-card__button"
                                    onClick={() => openModal(dev)}
                                >
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))
                )}
                <ScrollToTop />
            </div>

            {selectedDevice && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                        <span className="modal__close" onClick={closeModal}>
                            &times;
                        </span>
                        <img 
                            src={selectedDevice.images || "/images/placeholder.png"}
                            alt={selectedDevice.name_device}
                            className='modal__image'
                            onError={(e) => {
                                e.target.onerror = null
                                e.target.src = "/images/placeholder.png"
                            }}
                        />
                        <h2>{selectedDevice.name_device}</h2>
                        <p className="modal__description">
                            {selectedDevice.parameters || 'Нет описания'}
                        </p>
                        <p className="modal__price">
                            Цена: {selectedDevice.price ? `${selectedDevice.price} ₽` : '-'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ElectronicsDetail