import { DataTypes } from "sequelize";
import sequelize from "../database/dbConfig.js";

const Message = sequelize.define("message",{
    msg_id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    sender_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    reciever_id:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    content:{
        type:DataTypes.TEXT,
        allowNull:false,
},
    media_url:{
       type:DataTypes.STRING
    }
},{
    sequelize,
timestamps: true
})
sequelize.sync()
.then(()=>{
    console.log("Message table created successfully...")
}).catch(err=>{
    console.log("error while create Post table: "+err)
})
export default Message;