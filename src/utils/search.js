export function leftJoin(arr1, arr2, key1, key2, arrFields = []) {
  // console.log(
  //   "Left join",
  //   "arr1",
  //   arr1,
  //   "arr2",
  //   arr2,
  //   "key1",
  //   key1,
  //   "key2",
  //   key2,
  //   "fields",
  //   arrFields
  // );
  if (typeof arr2 === "undefined") return arr1;
  const res = arr1.map(a1 => {
    const filtered = arr2.filter(a2 => {
      return a1[key1] === a2[key2] || parseInt(a1[key1]) === parseInt(a2[key2]);
    });
    if (filtered.length > 0) {
      // console.log("found ", a1[key1]);
      if (arrFields.length > 0) {
        // copy only fields from desired fields list
        let obj = {};
        arrFields.map(f => {
          obj[f] = filtered[0][f];
        });
        return Object.assign({}, a1, obj);
      } else {
        // join all fields
        return Object.assign({}, a1, filtered[0]);
      }
    }
    // return original if no join has been found
    return a1;
  });
  return res;
}

export function findWithAttr(array, attr, value) {
  // console.log("findWithAttr", array, attr, value);
  for (var i = 0; i < array.length; i += 1) {
    if (array[i][attr] === value) {
      return i;
    }
  }
  return -1;
}
