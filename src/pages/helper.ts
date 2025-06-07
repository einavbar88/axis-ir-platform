import { chartsBgColors } from '../constants/common';

export const groupByTimeScale = (
  data: any[],
  dateField: string,
  timeScale: string,
) => {
  const timeCounts: { [key: string]: number } = {};

  data?.forEach((item) => {
    const date = new Date(item[dateField]);
    let key = '';

    switch (timeScale) {
      case 'day':
        key = date.toISOString().split('T')[0];
        break;

      case 'month':
        key = `${date.getFullYear()}-${date.toLocaleString('default', { month: 'short' })}`;
        break;

      case 'year':
        key = `${date.getFullYear()}`;
        break;

      default:
        key = date.toISOString().split('T')[0];
    }

    timeCounts[key] = (timeCounts[key] || 0) + 1;
  });

  return timeCounts;
};

export const prepareChartData = (
  data: { [key: string]: number },
  label: string,
  theme: number,
) => {
  const labels = Object.keys(data);
  const counts = Object.values(data);

  const sortedData = labels.map((label, index) => ({
    label,
    count: counts[index],
  }));

  sortedData.sort(
    (a, b) => new Date(a.label).getTime() - new Date(b.label).getTime(),
  );

  return {
    labels: sortedData.map((item) => item.label),
    datasets: [
      {
        label,
        data: sortedData.map((item) => item.count),
        backgroundColor: chartsBgColors[theme],
        borderColor: chartsBgColors[theme].replace('0.6', '1'),
        borderWidth: 1,
      },
    ],
  };
};

export const prepareChartDataMultiDataSets = (
  data: { [key: string]: number }[],
  labels: string[],
  themes: number[],
) => {
  const unifiedLabels = Array.from(
    new Set(
      data
        .flatMap((dataset) => Object.keys(dataset))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime()),
    ),
  );

  const dataSets = data.map((dataset, index) => {
    const sortedData = unifiedLabels.map((label) => {
      return {
        label: label,
        count: dataset[label] || 0,
      };
    });

    return {
      label: labels[index],
      data: sortedData.map((item) => item.count),
      backgroundColor: chartsBgColors[themes[index]],
      borderColor: chartsBgColors[themes[index]].replace('0.6', '1'),
      borderWidth: 1,
    };
  });

  return {
    labels: unifiedLabels,
    datasets: dataSets,
  };
};

export const getVisibleString = (str: string) => {
  return str.charAt(0) + str.slice(1).toLowerCase();
};
