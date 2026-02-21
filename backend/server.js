require('dotenv').config()
const express = require('express')
const {Pool} = require('pg')
const path = require('path')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3000


app.use(cors({origin: '*'}))
app.use(express.json())
app.use((req,res,next)=>{
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
    next()
})


app.use('/api',(req,res,next)=>{
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
})


const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
})


app.get('/api/electronics',async(req,res)=>{
    try{
        const result = await pool.query(
            `SELECT id, name_detail, description, images
            FROM electronic_components
            ORDER BY  id`
        )
        res.json(result.rows)

    }
    catch (err){
        console.error(err)
        res.status(500).json({error: 'Ошибка сервера'})
    }
})

app.get('/api/electronics/:id',async (req,res)=>{
    const id = parseInt(req.params.id)
    console.log(`→ Запрос к /api/electronics/${id}`)
    try{
        const copmRes =await pool.query(
            'SELECT id, name_detail, description, images FROM electronic_components WHERE id = $1',[id]
        )
        if (copmRes.rows.length === 0) {
            return res.status(404).json({error: 'Компонент не найден'})
        }
        const component = copmRes.rows[0]

        const devicesRes = await pool.query(
            'SELECT id, name_device, images FROM electronic_devices WHERE parent_id = $1 ORDER BY id ASC',[id]
        )
        res.json({component,devices:devicesRes.rows})

        }
        catch (err){
            console.error(`Ошибка в /api/electronics/${id}:`, err.message)
            res.status(500).json({error: 'Ошибка сервера'})
        }
})


const electronicsHandlers = {
    '1': {
        table: 'large_servo_motor',
        fields: 'id, speed, voltage, current, speed_sensor, url_ozon, price',
        logName: 'большойсерво-мотор'
    },
    '2':{
        table: 'average_servo_motor',
        fields: 'id, speed, voltage, current, speed_sensor, url_ozon, price',
        logName: 'среднийсерво-мотор'
    },
    '3': {
        table: 'color_sensor',
        fields: 'id, recognizes_color, measures_light, polling_rate_ms, url_ozon, price',
        logName: 'датчики-цвета'
    },
    '4': {
        table: 'touch_sensors',
        fields: 'id, touch_mode, force_mode, polling_rate, url_ozon, price',
        logName: 'датчики-нажатия'
    },
    '5': {
        table: 'distance_sensors',
        fields: 'id, range, accuracy, type, polling_rate, url_ozon, price',
        logName: 'датчики-расстояния'
    }
};

app.get('/api/electronics/:type/:id', async (req, res) => {
    const type = req.params.type;
    const id = parseInt(req.params.id);

    const handler = electronicsHandlers[type];
    if (!handler) {
        return res.status(400).json({ error: `Неизвестный тип электроники: ${type}` });
    }

    console.log(`→ Запрос к /api/electronics/${type}/${id} (${handler.logName})`);

    try {
        const result = await pool.query(
        `SELECT ${handler.fields} FROM ${handler.table} WHERE device_id = $1 ORDER BY id ASC`,
        [id]
        );
        
        res.json(result.rows);
    } catch (err) {
        console.error(`Ошибка в /api/electronics/${type}/${id}:`, err.message);
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});


app.use(express.static(path.join(__dirname,'../frontend/dist')))

app.get(/.*/,(req,res)=>{
    res.sendFile(path.join(__dirname,'../frontend/dist/index.html'),
    (err)=>{
        if (err){
            console.error(err)
            res.status(500).send({error: 'Ошибка сервера'})
        }
    })

})

app.listen(PORT,()=>{
    console.log(`Сервер запущен на http://localhost:${PORT}`)
})
