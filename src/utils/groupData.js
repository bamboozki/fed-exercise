export const groupByKey = (data, key) => {
    return data.reduce((acc, item) => {
      const group = item[key] || 'Unknown';
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {});
  };
  