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