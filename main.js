import path from 'path';
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";

const HOST = "44.205.132.119";
const PORT = 4200;
const app = express();

function configServer()
{
    app.use(cors());
    app.use(bodyParser.raw());
    app.use(express.json());
    app.use(express.static(path.join(process.cwd(), 'public/')));
}

function listenRequests()
{
    let dataListener;
    let captureListener;

    app.get('/stream', (req, res) => {
        const boundary = "123456789000000000000987654321";

        res.setHeader('Content-Type', `multipart/x-mixed-replace;boundary=${boundary}`);
        res.setHeader("Access-Control-Allow-Origin", "*");

        if(dataListener)
        {
            dataListener.on('data', chunk => {
                res.write(chunk);
            });

            dataListener.on('end', () => {
                res.send('OK, FINISHED STREAM!');
            });
        }
    });

    app.get('/capture', (req, res) => {
        if(captureListener)
        {
            captureListener.on('data', capture => {
                res.setHeader('Content-Type', 'image/jpeg');

                res.write(capture);
            });
        }
        else
        {
            res.send('Aun no se ha enviado datos de imagen!');
        }
    });

    app.post('/capture', (req, res)=>{
        captureListener = req;
    });

    app.post('/stream', (req, res) => {
        dataListener = req;
    });

}

function initializeServer()
{
    app.listen(process.env.PORT || PORT, '0.0.0.0', (req) => {
        console.log(`Servidor corriendo en: ${HOST}:${PORT}`);
    });
}

async function init()
{
    configServer();
    listenRequests();
    initializeServer();
}

init();