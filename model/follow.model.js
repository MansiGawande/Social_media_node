import { DataTypes } from "sequelize";
import sequelize from "../database/dbConfig.js";

const Follow = sequelize.define("follow", {
    follower_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1  // follow
    }
}, {
    sequelize,
    timestamps: true
});
sequelize.sync()
    .then(() => {
        console.log("Follow table created...")
    }).catch((err) => {
        console.log("Error in Follow table...", err);
    })

export default Follow;