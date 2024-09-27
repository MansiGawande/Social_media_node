import { DataTypes } from "sequelize";
import sequelize from "../database/dbConfig.js";
import User from "./user.model.js";

const Post = sequelize.define("post",{
post_id:{
    type:DataTypes.INTEGER,
    allowNull:false,
    primaryKey:true,
    autoIncrement:true
},
mediaType:{
    type:DataTypes.STRING(50),
    allowNull:false
},
media_url:{
    type:DataTypes.STRING(255),
    allowNull:false,
},
description:{
    type:DataTypes.STRING(200),
    allowNull:false
},
profile_id:{
  type:DataTypes.INTEGER,
  allowNull:false  
},
customCreatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
},
customUpdatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
}
}, 
{sequelize,
timestamps: false});

sequelize.sync()
.then(()=>{
    console.log("Post table created successfully...")
}).catch(err=>{
    console.log("error while create Post table: "+err)
})
export default Post;