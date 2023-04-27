export const mergeStocks = (stocks: any[]) => {
  const mergedStocks: any[] = [];
  stocks.forEach((stock) => {
    const index = mergedStocks.findIndex(
      (mergedStock) => mergedStock.stock_name === stock.stock_name
    );
    if (index === -1) {
      stock.total_price = stock.price;
      stock.total_count = 1;
      mergedStocks.push(stock);
    } else {
      mergedStocks[index].quantity += stock.quantity;
      mergedStocks[index].total_price += stock.price;
      mergedStocks[index].total_count += 1;
    }
  });

  mergedStocks.forEach((stock) => {
    stock.average_price = Number(
      (stock.total_price / stock.total_count).toFixed(2)
    );
  });

  return mergedStocks;
};
