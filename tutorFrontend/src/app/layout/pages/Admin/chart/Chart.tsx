import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, ArcElement, Legend } from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, ArcElement, Legend
);

// Type definitions
interface MonthlyRecord {
  views: number;
  users: number;
  subscriptions: number;
}

interface LineChartProps {
  perYearRecord: MonthlyRecord[];
}

interface DoughnutChartProps {
  subscribedCount: number;
  notSubscribedCount: number;
}

// Utility function to get month labels
const getMonths = (): string[] => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const currentMonth = new Date().getMonth();
  const labels: string[] = [];
  
  // Add months from current month backwards to January
  for (let i = currentMonth; i >= 0; i--) {
    labels.unshift(months[i]);
  }
  
  // Add remaining months from December backwards
  for (let i = 11; i > currentMonth; i--) {
    labels.unshift(months[i]);
  }
  
  return labels;
};

export const LineChart: React.FC<LineChartProps> = ({ perYearRecord }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Yearly Views",
      }
    }
  };

  const data = {
    labels: getMonths(),
    datasets: [
      {
        label: "Views",
        data: perYearRecord.map((item) => item.views),
        borderColor: "rgba(27, 235, 165, 0.5)",
        backgroundColor: "#6633dd",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "rgba(107, 70, 193, 0.5)",
        pointHoverBorderColor: "rgba(107, 70, 193, 0.5)",
        pointHoverBorderWidth: 2,
        pointHitRadius: 10,
        pointStyle: "circle",
        
        tension: 0.4, // Smooth line
        fill: false
      }
    ]
  };

  return <Line options={options} data={data} />;
};

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ 
  subscribedCount, 
  notSubscribedCount 
}) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Subscription Status",
      }
    }
  };

  const data = {
    labels: ["Subscribed", "Not Subscribed"],
    datasets: [
      {
        label: 'Users',
        data: [subscribedCount, notSubscribedCount],
        backgroundColor: ["#6b46c1", "rgba(214, 43, 129, 0.3)"],
        borderColor: ["#6b46c1", "rgba(214, 43, 129, 0.5)"],
        borderWidth: 1,
        hoverOffset: 4
      }
    ]
  };

  return <Doughnut data={data} options={options} />;
};