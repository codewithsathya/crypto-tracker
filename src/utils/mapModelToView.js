function mapModelToView(data) {
  let mappedData = data.map((coinData, index) => {
    if (!coinData) return {};
    let obj = {};
    obj._id = index.toString();
    obj.pair = <p><b>{coinData.base}</b>/{coinData.quote}</p>
    // console.log(obj.pair);
    obj.presentPrice = coinData.presentPrice;
    obj["ath %"] = coinData.athDifference;
    coinData.percentDifferences.forEach((item) => {
      obj[`${item.timeDifference}min %`] = item.percentDifference;
    });
    coinData.priceDifferences.forEach((item) => {
      obj[`${item.timeDifference}min $`] = item.priceDifference;
    });
    return obj;
  });
  return mappedData;
}

export default mapModelToView;
