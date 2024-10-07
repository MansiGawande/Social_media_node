import { DataTypes, INTEGER } from "sequelize";
import sequelize from "../database/dbConfig.js";

const Comment = sequelize.define("comment",{
    comment_id:{
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
    },
    comment:{
        type:DataTypes.STRING,
        allowNull:false
    },
},{
    sequelize,
    timestamps:true
});

sequelize.sync()
.then(()=>{
    console.log("Comment table created sucessfully...");
}).catch(err =>{
    console.log("error while create Comment table: "+err)
})
export default Comment;