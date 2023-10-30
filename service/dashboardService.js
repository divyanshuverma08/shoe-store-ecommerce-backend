const orderModel = require("../model/orderModel");
const productModel = require("../model/productModel")

module.exports.getDashboardDetails = async () => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  console.log(month);

  const firstDayOfCurrentMonth = new Date(year, month, 1);

  const firstDayOfPreviousMonth = new Date(year, month - 1, 1);

  const currentMonthQuery = {
    $gte: firstDayOfCurrentMonth,
    $lt: new Date(year, month + 1, 1),
  };

  const previousMonthQuery = {
    $gte: firstDayOfPreviousMonth,
    $lt: firstDayOfCurrentMonth,
  };

  const [
    totalOrdersCurrentMonth,
    totalOrdersPreviousMonth,
    pendingOrdersCurrentMonth,
    pendingOrdersPreviousMonth,
    shippedOrdersCurrentMonth,
    shippedOrdersPreviousMonth
  ] = await Promise.all([
    orderModel.find({createdAt: currentMonthQuery,}).count(),
    orderModel.find({createdAt: previousMonthQuery}).count(),
    orderModel.find({
        status: "Processing",
        createdAt: currentMonthQuery,
      }).count(),
    orderModel.find({
        status: "Processing",
        createdAt: previousMonthQuery,
      }).count(),
    orderModel.find({
        status: "Delivered",
        createdAt: currentMonthQuery,
      }).count(),
    orderModel.find({
        status: "Delivered",
        createdAt: previousMonthQuery,
      }).count()
  ]);

  let percentageIncrease = 0;

  if (totalOrdersPreviousMonth > 0 && totalOrdersCurrentMonth > 0) {
    percentageIncrease =
      ((totalOrdersCurrentMonth - totalOrdersPreviousMonth) /
        totalOrdersPreviousMonth) *
      100;
  }

  let percentageIncreasePending = 0;

  if(pendingOrdersCurrentMonth > 0 && pendingOrdersPreviousMonth > 0){
    percentageIncreasePending =
    ((pendingOrdersCurrentMonth - pendingOrdersPreviousMonth) /
    pendingOrdersPreviousMonth) *
    100;
  }

  let percentageIncreaseShipped = 0;

  if(shippedOrdersCurrentMonth > 0 && shippedOrdersPreviousMonth > 0){
    percentageIncreaseShipped =
    ((shippedOrdersCurrentMonth - shippedOrdersPreviousMonth) /
    shippedOrdersPreviousMonth) *
    100;
  }

  return {
    totalOrders: {
      amount: totalOrdersCurrentMonth,
      percentage: percentageIncrease,
    },
    pendingOrders:{
        amount: pendingOrdersCurrentMonth,
        percentage: percentageIncreasePending
    },
    shippedOrders: {
        amount: shippedOrdersCurrentMonth,
        percentage: percentageIncreaseShipped
    }
  };
};

module.exports.getOrdersByYear = async () => {
    const year = new Date().getFullYear();
  
    const ordersInEveryMonth = orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.month': 1,
        },
      },
      {
          $project: {
            month: '$_id',
            totalOrders: 1,
            _id: 0, // Exclude the _id field
          },
      }
    ]);  
  
    const data = await ordersInEveryMonth;
  
    const monthsWithOrders = [];
  
    monthsWithOrders.push(...data);
    
    const allMonths = Array.from({ length: 12 }, (_, i) => i + 1);
    const filledResults = allMonths.map((month) => {
      const found = monthsWithOrders.find((entry) => entry.month === month);
      return {
        month,
        totalOrders: found ? found.totalOrders : 0,
      };
    });
  
    return {...filledResults};
};

module.exports.getOrdersByMonth = async () => {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
  
    const ordersInEveryDayInMonth = orderModel.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(year, month, 1),
              $lt: new Date(year, month + 1, 1),
            },
          },
        },
        {
          $group: {
            _id: { $dayOfMonth: '$createdAt' },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            day: '$_id',
            totalOrders: 1,
            _id: 0,
          },
        },
        {
          $sort: {
            day: 1,
          },
        },
    ]);  
  
    const data = await ordersInEveryDayInMonth;
  
    const dayWithOrders = [];
  
    dayWithOrders.push(...data);

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const allDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const filledResults = allDays.map((day) => {
      const found = dayWithOrders.find((entry) => entry.day === day);
      return {
        day,
        totalOrders: found ? found.totalOrders : 0,
      };
    });
  
    return filledResults;
};

module.exports.getBestSellers = async () => {

    let data = await productModel.find().sort({totalSold: -1}).limit(5);
    return data;
}