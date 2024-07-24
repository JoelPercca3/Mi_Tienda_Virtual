import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const OrderItem = db.define('OrderItem', {
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: false,
  tableName: 'order_items'
});

export default OrderItem;
