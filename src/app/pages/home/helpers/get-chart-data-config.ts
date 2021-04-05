export const DATA_CONFIG = [
  {
    name: 'OVC HIV Status reported',
    series: [
      { id: 'apuD7SIZMYs', color: '#1177A5', name: 'OVC HIV status reported' },
    ],
  },
  {
    name: 'Uknown',
    series: [
      { id: 'PKqhZwWz7YS', color: '#FDCB0B', name: 'At risk' },
      { id: 'swODbc3PXIu', color: '#D2A929', name: 'Not at Risk' },
      { id: 'onw7yDC8PFO', color: '#ED7D31', name: 'Undisclosed' },
      { id: '', color: '#FCF6D4', name: 'Not screened' },
    ],
  },
  {
    name: 'HIV status type',
    series: [
      { id: 'p3fKUkL8Har', color: '#E39824', name: 'Not on TX' },
      { id: 'cDtUveNmDeB', color: '#E08725', name: 'On TX' },
      { id: 'U0NGzwq3KCP', color: '#ED7D31', name: 'HIV positive' },
      { id: 'uwIYNrfOBj7', color: '#1177A5', name: 'HIV Negative' },
    ],
  },
];

export const DEFAULT_CHART_OBJECT = {
  chart: {
    renderTo: 'chart-data',
    type: 'column',
  },
  title: {
    text: 'OVC_HIVSTAT',
  },
  xAxis: {
    categories: [],
  },
  yAxis: {
    min: 0,
    title: {
      text: '',
    },
    stackLabels: {
      enabled: true,
      style: {
        fontWeight: 'bold',
        color: 'gray',
      },
    },
  },
  tooltip: {
    headerFormat: '<b>{point.x}</b><br/>',
    pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}',
  },
  plotOptions: {
    column: {
      stacking: 'normal',
      dataLabels: {
        enabled: true,
      },
      dataSorting: {
        enabled: false,
      },
    },
  },
  series: [],
};
