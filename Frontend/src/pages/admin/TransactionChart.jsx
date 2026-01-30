import { useEffect, useRef } from 'react';
import './TransactionChart.css';

function TransactionChart({ transactions }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current && transactions.length > 0) {
      drawChart();
    }
  }, [transactions]);

  const processChartData = () => {
    // Group transactions by date
    const dateMap = {};

    transactions.forEach(trans => {
      const date = new Date(trans.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      });

      if (!dateMap[date]) {
        dateMap[date] = { in: 0, out: 0 };
      }

      if (trans.type === 'IN') {
        dateMap[date].in += trans.quantity;
      } else {
        dateMap[date].out += trans.quantity;
      }
    });

    // Convert to array and sort by date
    const dates = Object.keys(dateMap).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateA - dateB;
    });

    return dates.slice(-14).map(date => ({
      date,
      in: dateMap[date].in,
      out: dateMap[date].out
    }));
  };

  const drawChart = () => {
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const data = processChartData();

    if (data.length === 0) return;

    // Canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 40, right: 40, bottom: 80, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Find max value for scaling
    const maxValue = Math.max(...data.map(d => Math.max(d.in, d.out)));
    const yScale = chartHeight / (maxValue * 1.2); // 20% padding at top

    // Draw background
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const value = Math.round((maxValue * 1.2) * (1 - i / 5));
      ctx.fillStyle = '#666';
      ctx.font = '12px Arial';
      ctx.textAlign = 'right';
      ctx.fillText(value.toString(), padding.left - 10, y + 4);
    }

    // Calculate bar width
    const barWidth = chartWidth / (data.length * 2.5);
    const barSpacing = barWidth * 0.5;

    // Draw bars
    data.forEach((item, index) => {
      const x = padding.left + (index * (barWidth * 2 + barSpacing));
      
      // Stock IN bar (green)
      const inHeight = item.in * yScale;
      const inY = padding.top + chartHeight - inHeight;
      
      // Gradient for IN bars
      const inGradient = ctx.createLinearGradient(x, inY, x, inY + inHeight);
      inGradient.addColorStop(0, '#4caf50');
      inGradient.addColorStop(1, '#66bb6a');
      
      ctx.fillStyle = inGradient;
      ctx.fillRect(x, inY, barWidth, inHeight);
      
      // Add value label on top of IN bar
      if (item.in > 0) {
        ctx.fillStyle = '#2e7d32';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.in.toString(), x + barWidth / 2, inY - 5);
      }

      // Stock OUT bar (orange)
      const outHeight = item.out * yScale;
      const outY = padding.top + chartHeight - outHeight;
      
      // Gradient for OUT bars
      const outGradient = ctx.createLinearGradient(x + barWidth + 5, outY, x + barWidth + 5, outY + outHeight);
      outGradient.addColorStop(0, '#ff9800');
      outGradient.addColorStop(1, '#ffb74d');
      
      ctx.fillStyle = outGradient;
      ctx.fillRect(x + barWidth + 5, outY, barWidth, outHeight);
      
      // Add value label on top of OUT bar
      if (item.out > 0) {
        ctx.fillStyle = '#e65100';
        ctx.font = 'bold 11px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(item.out.toString(), x + barWidth + 5 + barWidth / 2, outY - 5);
      }

      // Date label
      ctx.fillStyle = '#333';
      ctx.font = '11px Arial';
      ctx.textAlign = 'center';
      ctx.save();
      ctx.translate(x + barWidth, padding.top + chartHeight + 15);
      ctx.rotate(-Math.PI / 4);
      ctx.fillText(item.date, 0, 0);
      ctx.restore();
    });

    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();

    // Chart title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Stock Movement Trend (Last 14 Days)', width / 2, 25);

    // Legend
    const legendY = height - padding.bottom + 60;
    
    // IN legend
    ctx.fillStyle = '#4caf50';
    ctx.fillRect(width / 2 - 100, legendY, 20, 15);
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Stock IN', width / 2 - 75, legendY + 12);
    
    // OUT legend
    ctx.fillStyle = '#ff9800';
    ctx.fillRect(width / 2 + 20, legendY, 20, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Stock OUT', width / 2 + 45, legendY + 12);
  };

  if (transactions.length === 0) {
    return (
      <div className="chart-container">
        <div className="chart-empty">
          <div className="empty-icon">📊</div>
          <h3>No data to display</h3>
          <p>Transaction data will appear here once available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <canvas 
        ref={chartRef} 
        width={1200} 
        height={500}
        className="transaction-chart"
      />
      
      <div className="chart-stats">
        <div className="chart-stat-item">
          <span className="stat-label">Total IN:</span>
          <span className="stat-value in">
            {transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.quantity, 0)} units
          </span>
        </div>
        <div className="chart-stat-item">
          <span className="stat-label">Total OUT:</span>
          <span className="stat-value out">
            {transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.quantity, 0)} units
          </span>
        </div>
        <div className="chart-stat-item">
          <span className="stat-label">Net Change:</span>
          <span className={`stat-value ${
            transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.quantity, 0) -
            transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.quantity, 0) >= 0 
            ? 'in' : 'out'
          }`}>
            {transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + t.quantity, 0) -
             transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + t.quantity, 0)} units
          </span>
        </div>
      </div>
    </div>
  );
}

export default TransactionChart;
