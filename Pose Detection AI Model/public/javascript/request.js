const URL = "http://localhost:3000/image";
const otherParam={
    method:"POST",
    body:"example"
};

fetch(URL,otherParam)
.then(data=>{return data.json()})
.then(res=>{console.log(res)})
.catch(error => console.log(error))