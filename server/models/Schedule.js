module.exports = (sequelize, DataTypes) => {
    const Schedule = sequelize.define("Schedule", {
        patientname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        nursename: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        doctorname: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        datetime: {
            type: DataTypes.DATE,
            allowNull: false
        },
        service: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status: {
            type: DataTypes.STRING(100),
            allowNull: false
        },        
        remindersent: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: "No"
        }
    }, {
        tableName: 'schedules'
    });

    Schedule.associate = (models) => {
        Schedule.belongsTo(models.User, {
            foreignKey: "userId",
            as: 'user'
        });
    };

    return Schedule;
}