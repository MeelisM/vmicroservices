const defineOrder = (sequelize, Sequelize) => {
  const Order = sequelize.define("order", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    number_of_items: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    total_amount: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return Order;
};

export default defineOrder;
