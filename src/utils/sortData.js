import _ from 'lodash';

const sortData = (data, sortColumn) => {
  if (data.length !== 0 && typeof data[0][sortColumn.path] === "number") {
    if (sortColumn.order === "asc") {
      return data.sort((a, b) => a[sortColumn.path] - b[sortColumn.path]);
    } else {
      return data.sort((a, b) => b[sortColumn.path] - a[sortColumn.path]);
    }
  } else {
    return _.orderBy(data, [sortColumn.path], [sortColumn.order]);
  }
};



export default sortData;
