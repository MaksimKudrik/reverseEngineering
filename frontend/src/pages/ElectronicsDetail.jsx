import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ScrollToTop from "../components/scrollButton";
// import ModalDetailElectronic from "../components/ModalDetailElectronic";

const ElectronicsDetail = () => {
  const { slug } = useParams();

  // Извлекаем id — последнее число после дефиса
  let id = null;
  if (slug) {
    const match = slug.match(/-(\d+)$/);
    if (match && match[1]) {
      id = match[1];
    }
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Некорректная ссылка на компонент");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get(`/api/electronics/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Ошибка при загрузке компонента");
        setLoading(false);
        console.error("Ошибка загрузки:", err);
      });
  }, [id, slug]); // slug в зависимостях на всякий случай

  if (loading) return <p className="loading">Загрузка...</p>;
  if (error) return <div className="container_error">{error}</div>;
  if (!data?.component) return <p className="container_error">Компонент не найден</p>;

  const { component, devices } = data;

  return (
    <div className="container">
      <header>
        <a href="/electronics" className="backLink">
          ← Назад к компонентам
        </a>
      </header>

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
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
              </div>

              <div className="device-card__content">
                <h3>{dev.name_device}</h3>

                <a
                  className="device-card__button"
                  href={`/electronics/${slug}/${dev.id}`}
                >
                  Подробнее
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      <ScrollToTop />

      {/* {selectedDevice && <ModalDetailElectronic ... />} */}
    </div>
  );
};

export default ElectronicsDetail;