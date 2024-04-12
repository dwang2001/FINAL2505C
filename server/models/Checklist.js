module.exports = (sequelize, DataTypes) => {
    const Checklist = sequelize.define("Checklist", {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      checklist: {
        type: DataTypes.JSON,
        allowNull: false
      }
    }, {
      tableName: 'Checklists'
    });
  
    Checklist.associate = (models) => {
      Checklist.belongsTo(models.User, {
        foreignKey: "userId",
        as: 'user'
      });
    };
  
    return Checklist;
  };
