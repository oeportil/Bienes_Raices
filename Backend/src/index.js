import server from './server.js'

const port = 4000;
server.listen(port, ()=>{
    console.log(`Puerto del servidor corriendo en ${port}`)
})