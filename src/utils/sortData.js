import _ from 'lodash';

const sortData = (data, sortColumn) => {
  if(sortColumn.path === "pair"){
    return data.sort((a, b) => {
      let pairA = a.pair.props.children[0].props.children + a.pair.props.children[2];
      let pairB = b.pair.props.children[0].props.children + b.pair.props.children[2];
      return sortColumn.order==="asc"? pairA.localeCompare(pairB) : pairB.localeCompare(pairA);
    })
  }

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
