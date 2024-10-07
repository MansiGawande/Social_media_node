import { DataTypes } from "sequelize";
import sequelize from "../database/dbConfig.js";

const Likes = sequelize.define("likes",{
    like_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    profile_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    post_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
    }
},{sequelize,
timestamps: true})

sequelize.sync()
.then(()=>{
    console.log("Likes table created successfully...")
}).catch(err=>{
    console.log("error while create Post table: "+err)
})
export default Likes;