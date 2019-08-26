export default (data, prop, reverse) => {
  data.sort((a, b) => {
    const val = a[prop];
    const _val = b[prop];

    if (!reverse) {
      if (val > _val) return 1;
      if (val < _val) return -1;
    } else {
      if (val < _val) return 1;
      if (val > _val) return -1;
    }
    return 0;
  });
}