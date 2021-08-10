function getSlicedLastArray(arr, noOfElementsRequired) {
  return arr.slice(arr.length - noOfElementsRequired, arr.length);
}

module.exports = getSlicedLastArray;