import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Transaction } from '../../common/typescript-type/transaction'


type Props = {
  transactions: Transaction[];
};

export default function TransactionChart({ transactions }: Props) {
  // Step 1: Calculate totals
  const categoryTotals = transactions.reduce(
    (acc, tx) => {
      acc[tx.category] = (acc[tx.category] || 0) + Number(tx.amount);
      return acc;
    },
    { Expense: 0, Investment: 0, Savings: 0 }
  );


                                                                                                                                                                                                                                                                                                                               

  const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);



  // Step 2: Define color mapping
  const categoryColors = {
    Expense: '#AD0C10',      // Red
    Investment: '#EC9B20',   // Yellow
    Savings: '#054939',      // Green
  };

  // Step 3: Create chart data
  const chartData = Object.entries(categoryTotals).map(([name, y]) => ({
    name,
    y,
    color: categoryColors[name as keyof typeof categoryColors] || '#ccc', // fallback color
  }));

  const options = {
    chart: {
      type: 'pie',
      height: 390,
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
    },
    title: {
      text: '',
    },
    tooltip: {
      pointFormat: '{series.name}<strong>₹{point.y}</strong>',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        innerSize: '40%', // for donut effect
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: false,
        },
        showInLegend: true,
      },
    },
    legend: {
      labelFormatter: function (this: Highcharts.Point): string {
        return `${this.name}: (${this.percentage?.toFixed(1)}%)`;
      },
    },
    subtitle: {
      text: `₹${total}`,
      align: 'center',
      verticalAlign: 'middle',
      style: {
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    series: [
      {
        name: '',
        colorByPoint: true,
        data: chartData,
      },
    ],
  };

  return (
    <div className="mt-6">
      {chartData.length === 0 ? (
        <p className="text-gray-500">No transactions to show in chart.</p>
      ) : (
        <HighchartsReact highcharts={Highcharts} options={options} />
      )}
    </div>
  );
}
