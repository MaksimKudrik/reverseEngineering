import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


const typeConfig = {
    "1": {
        title: "Сервопривод большой",
        fields: [
        { key: "speed", label: "Скорость " },
        { key: "voltage", label: "Напряжение " },
        { key: "current", label: "Ток " },
        { key: "speed_sensor", label: "Датчик скорости ", format: (v) => (v ? "Есть" : "Нет") },
        { key: "url_ozon", label: "", isButton: true, buttonText: "Купить" },
        { key: "price", label: "Цена ", unit: ' ₽' },
        ],
    },
    "2": {
        title: "Сервопривод средний",
        fields: [
        { key: "speed", label: "Скорость " },
        { key: "voltage", label: "Напряжение " },
        { key: "current", label: "Ток " },
        { key: "speed_sensor", label: "Датчик скорости ", format: (v) => (v ? "Есть" : "Нет") },
        { key: "url_ozon", label: "", isButton: true, buttonText: "Купить" },
        { key: "price", label: "Цена ", unit: ' ₽' },
        ],
    },
    "3": {
        title: "Цветовые датчики",
        fields: [
        { key: "recognizes_color", label: "Распознавание цвета ", unit: '' },
        { key: "measures_light", label: "Измерение освещённости ", format: v => v ? "Да" : "Нет" },
        { key: "polling_rate_ms", label: "Частота опроса ", unit: "  " },
        { key: "url_ozon", label: "", isButton: true, buttonText: "Купить" },
        { key: "price", label: "Цена ", unit: ' ₽' },
        ]
    },
    "4": {
        title: "Тактильные датчики",
        fields: [
        { key: "touch_mode", label: "Тип нажатия ", unit: '' },
        { key: "force_mode", label: "Сила нажатия ", unit: '' },
        { key: "polling_rate", label: "Частота опроса ", unit: " "  },
        { key: "url_ozon", label: "", isButton: true, buttonText: "Купить" },
        { key: "price", label: "Цена ", unit: ' ₽' },
        ]
    },
    "5": {
        title: "Датчики расстояния",
        fields: [
        { key: "range",       label: "Диапазон ",     unit: " см" },
        { key: "accuracy",    label: "Точность ",     unit: " см" },
        { key: "type",    label: "Тип " },
        { key: "polling_rate", label: "Частота опроса ", unit: " " },
        { key: "url_ozon", label: "", isButton: true, buttonText: "Купить" },
        { key: "price", label: "Цена ", unit: ' ₽' },
        ]
    },
};

const Device = () => {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const [device, setDevice] = useState(null);          // ← новое
    const [components, setComponents] = useState([]);    // было data
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const config = typeConfig[type] || {
        title: `Тип ${type}`,
        fields: [],
    };

    useEffect(() => {
        axios
            .get(`/api/electronics/${type}/${id}`)
            .then((res) => {
                setDevice(res.data.device);
                setComponents(Array.isArray(res.data.components) ? res.data.components : []);
            })
            .catch((err) => {
                console.error(err);
                setError(err.response?.data?.error || "Не удалось загрузить данные");
            })
            .finally(() => setLoading(false));
    }, [type, id]);

    if (loading) return <div className="container loading">Загрузка...</div>;

    if (error) {
        return (
            <div className="container error">
                <h2>Ошибка</h2>
                <p>{error}</p>
                <a href="/electronics/:id" className="backLink" onClick={() => navigate(-1)}>
                    ← Назад
                </a>
            </div>
        );
    }

    // Название берём из бэкенда, если есть
    const pageTitle = device?.name 
        ? device.name 
        : `${config.title} ${id}`;

    return (
        <div className="container device-page">
            <header>
                <h1>{pageTitle}</h1>
                <a href={`/electronics/${type}`} className="backLink" onClick={() => navigate(-1)}>
                    ← Назад к компонентам
                </a>
            </header>

            <main>
                {components.length === 0 ? (
                    <div className="empty-state">
                        <p>У этого устройства пока нет зарегистрированных компонентов</p>
                    </div>
                ) : (
                    <div className="component-grid">
                        {components.map((item) => (
                            <div key={item.id} className="component-card">
                                <div className="features">
                                    {config.fields.map((field) => {
                                        let value = item[field.key];

                                        if (field.format) {
                                            value = field.format(value);
                                        }

                                        if (field.isButton && item[field.key]) {
                                            return (
                                                <div key={field.key} className="feature button-feature">
                                                    <a
                                                        href={item[field.key]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="buy-button"
                                                    >
                                                        {field.buttonText || "Купить"}
                                                    </a>
                                                </div>
                                            );
                                        }

                                        let displayValue = value;
                                        if (field.unit && value != null && !field.isButton) {
                                            displayValue = `${value}${field.unit}`;
                                        }

                                        return (
                                            <div key={field.key} className="feature">
                                                {field.label && <span className="label">{field.label}</span>}
                                                <span className="value">{displayValue}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Device;