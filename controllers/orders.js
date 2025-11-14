

let orders = [];
let lastOrderId = 1;

module.exports.createOrder = function (userId, details) {
  const newOrder = {
    id: lastOrderId++,
    userId,
    details,
    status: "قيد المراجعة",
    created: new Date(),
  };
  orders.push(newOrder);
  return newOrder;
};

module.exports.getOrder = function (id) {
  return orders.find((o) => o.id == id);
};
