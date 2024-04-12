module.exports = (sequelize, DataTypes) => {
    const Images = sequelize.define("Records", {

        icnumber: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
       
        uploadDate: {
            type: DataTypes.DATE,
            allowNull: true
        },      
        fileName: {
            type: DataTypes.STRING,
            allowNull: true
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true
        },
        comments: {
            type: DataTypes.STRING(100),
            allowNull: true
        }
    }, {
        tableName: 'Records'
    });

    Images.associate = (models) => {
        Images.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Images;
}