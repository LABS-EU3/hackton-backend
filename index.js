const server = require("./api/server");

const port = process.env.PORT || 4000;

server.listen(port,() => {
    console.log("listening on port", port);
})

server.get("*",(req,res) => {
    res.status(200).json("Hello from Hackton backend!");
})



