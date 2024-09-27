import { Sequelize } from "sequelize";

const sequelize = new Sequelize("social_media_backend","root","root123",{
    host:'localhost',
    dialect : "mysql"

})
sequelize.authenticate()
.then(()=>{
    console.log("database connected successfully");
}).catch(()=>{
    console.log("something went wrong");
})
export default sequelize;