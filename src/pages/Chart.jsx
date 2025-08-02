// components/DepartmentChart.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Responsive, WidthProvider } from 'react-grid-layout';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, LineChart, Line, Cell,
  Legend, Label
} from 'recharts';
import {
  BookOpen, User, BarChart2, PieChart as PieChartIcon,
  LineChart as LineChartIcon, Loader2, Grip
} from 'lucide-react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);
const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#06b6d4'];

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const [courseData, setCourseData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [layouts, setLayouts] = useState({
    lg: [
      { i: "department", x: 0, y: 0, w: 4, h: 8 },
      { i: "course", x: 4, y: 0, w: 4, h: 8 },
      { i: "age", x: 8, y: 0, w: 4, h: 8 }
    ],
    md: [
      { i: "department", x: 0, y: 0, w: 6, h: 8 },
      { i: "course", x: 6, y: 0, w: 6, h: 8 },
      { i: "age", x: 0, y: 8, w: 6, h: 8 }
    ],
    sm: [
      { i: "department", x: 0, y: 0, w: 12, h: 8 },
      { i: "course", x: 0, y: 8, w: 12, h: 8 },
      { i: "age", x: 0, y: 16, w: 12, h: 8 }
    ]
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [chartRes, courseRes, ageRes] = await Promise.all([
          axios.get('http://localhost:5000/charts/chart-data'),
          axios.get('http://localhost:5000/charts/courseChart'),
          axios.get('http://localhost:5000/charts/ageChart')
        ]);

        setChartData(chartRes.data);
        setCourseData(courseRes.data);
        setAgeData(ageRes.data);
      } catch (err) {
        console.error('Error fetching chart data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLayoutChange = (layout, allLayouts) => {
    setLayouts(allLayouts);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
          <p className="font-semibold">{label}</p>
          <p className="text-sm text-gray-600">
            {payload[0].name === 'count' ? 'Students: ' : ''}
            <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight={600}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-2xl p-8">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-600">Loading chart data...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 rounded-2xl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Analytics Dashboard</h1>
            <p className="text-gray-600">Visual insights into student demographics and enrollment</p>
          </div>
        </div>

        <div className="mt-8 mb-4 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Data Summary</h2>
              <p className="text-gray-600">Key metrics from student enrollment data</p>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-medium">
                  {chartData.reduce((acc, curr) => acc + curr.count, 0)} Total Students
                </span>
              </div>
              <div className="bg-purple-50 px-4 py-2 rounded-lg flex items-center">
                <BookOpen className="w-5 h-5 text-purple-600 mr-2" />
                <span className="font-medium">{courseData.length} Courses</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h3 className="text-sm font-medium text-gray-500">Most Popular Department</h3>
              <p className="text-lg font-semibold">
                {chartData.length > 0
                  ? chartData.reduce((max, curr) => curr.count > max.count ? curr : max).department
                  : 'N/A'}
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h3 className="text-sm font-medium text-gray-500">Most Popular Course</h3>
              <p className="text-lg font-semibold">
                {courseData.length > 0
                  ? courseData.reduce((max, curr) => curr.count > max.count ? curr : max).course
                  : 'N/A'}
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h3 className="text-sm font-medium text-gray-500">Most Common Age</h3>
              <p className="text-lg font-semibold">
                {ageData.length > 0
                  ? ageData.reduce((max, curr) => curr.count > max.count ? curr : max).age
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1024, md: 768, sm: 640, xs: 480 }}
          cols={{ lg: 12, md: 12, sm: 12, xs: 12 }}
          rowHeight={32}
          margin={[24, 24]}
          onLayoutChange={handleLayoutChange}
          isDraggable
          isResizable
          draggableHandle=".drag-handle"
        >
          {/* Department Chart */}
          <div key="department" className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="absolute top-3 right-3 cursor-move drag-handle text-gray-400 hover:text-gray-600">
              <Grip className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Students by Department</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="department"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={40}
                  />
                  <YAxis>
                    <Label
                      value="Number of Students"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: 'middle', fontSize: 12 }}
                    />
                  </YAxis>
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
              {chartData.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span className="text-xs text-gray-600">{entry.department}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Course Chart */}
          <div key="course" className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="absolute top-3 right-3 cursor-move drag-handle text-gray-400 hover:text-gray-600">
              <Grip className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <PieChartIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Students by Courses</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomTooltip />} />
                  <Pie
                    data={courseData}
                    dataKey="count"
                    nameKey="course"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    label={renderCustomizedLabel}
                    labelLine={false}
                  >
                    {courseData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[(index + 3) % COLORS.length]}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ fontSize: '12px', paddingLeft: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              Hover over sections for course details
            </div>
          </div>

          {/* Age Chart */}
          <div key="age" className="relative bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="absolute top-3 right-3 cursor-move drag-handle text-gray-400 hover:text-gray-600">
              <Grip className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <LineChartIcon className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Students by Age</h2>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ageData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="age"
                    tick={{ fontSize: 12 }}
                  >
                    <Label
                      value="Age"
                      position="insideBottom"
                      offset={-5}
                      style={{ textAnchor: 'middle', fontSize: 12 }}
                    />
                  </XAxis>
                  <YAxis>
                    <Label
                      value="Number of Students"
                      angle={-90}
                      position="insideLeft"
                      style={{ textAnchor: 'middle', fontSize: 12 }}
                    />
                  </YAxis>
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    dot={{ stroke: '#4f46e5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2 bg-indigo-600"></div>
                <span className="text-xs text-gray-600">Student count per age group</span>
              </div>
            </div>
          </div>
        </ResponsiveGridLayout>
      </div>
    </div>
  );
};

export default Chart;