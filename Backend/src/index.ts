import server from "./server"

const PORT = 3000

server.listen(PORT, () =>{
    console.log(`Server in ${PORT}`)
})