// ========== src/components/Analytics/PerformanceChart.js (FIXED) ==========
import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';

function PerformanceChart() {
  const [projects, setProjects] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState('all');
  const [chartType, setChartType] = useState('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, sprintsRes, tasksRes, usersRes] = await Promise.all([
        api.get('/projects/'),
        api.get('/sprints/'),
        api.get('/tasks/'),
        api.get('/auth/users/'),
      ]);

      setProjects(projectsRes.data);
      setSprints(sprintsRes.data);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Filter data based on selected project
  const filteredTasks = selectedProject === 'all' 
    ? tasks 
    : tasks.filter(t => t.project === parseInt(selectedProject));

  const filteredSprints = selectedProject === 'all'
    ? sprints
    : sprints.filter(s => s.project === parseInt(selectedProject));

  // Task Status Distribution
  const getTaskStatusData = () => {
    const statusCount = {
      todo: 0,
      in_progress: 0,
      in_review: 0,
      done: 0,
    };

    filteredTasks.forEach(task => {
      statusCount[task.status]++;
    });

    return [
      { name: 'To Do', value: statusCount.todo, color: '#3498db' },
      { name: 'In Progress', value: statusCount.in_progress, color: '#f39c12' },
      { name: 'In Review', value: statusCount.in_review, color: '#9b59b6' },
      { name: 'Done', value: statusCount.done, color: '#2ecc71' },
    ].filter(item => item.value > 0); // Only show non-zero values
  };

  // Task Priority Distribution
  const getPriorityData = () => {
    const priorityCount = {
      low: 0,
      medium: 0,
      high: 0,
      critical: 0,
    };

    filteredTasks.forEach(task => {
      priorityCount[task.priority]++;
    });

    return [
      { name: 'Low', value: priorityCount.low, color: '#3498db' },
      { name: 'Medium', value: priorityCount.medium, color: '#f39c12' },
      { name: 'High', value: priorityCount.high, color: '#e67e22' },
      { name: 'Critical', value: priorityCount.critical, color: '#e74c3c' },
    ].filter(item => item.value > 0); // Only show non-zero values
  };

  // Custom label renderer for pie charts - prevents overlapping
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent < 0.05) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25; // Position label outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#333"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="13px"
        fontWeight="500"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Sprint Progress Data
  const getSprintProgressData = () => {
    return filteredSprints.map(sprint => {
      const sprintTasks = tasks.filter(t => t.sprint === sprint.id);
      const completedTasks = sprintTasks.filter(t => t.status === 'done').length;
      const totalTasks = sprintTasks.length;
      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      return {
        name: sprint.name.substring(0, 15) + (sprint.name.length > 15 ? '...' : ''),
        completed: completedTasks,
        total: totalTasks,
        completionRate: completionRate.toFixed(1),
      };
    }).slice(0, 6);
  };

  // Team Performance Data
  const getTeamPerformanceData = () => {
    return users.map(user => {
      const userTasks = filteredTasks.filter(t => t.assigned_to?.id === user.id);
      const completedTasks = userTasks.filter(t => t.status === 'done').length;
      const totalStoryPoints = userTasks.reduce((sum, t) => sum + (t.story_points || 0), 0);
      const completedStoryPoints = userTasks
        .filter(t => t.status === 'done')
        .reduce((sum, t) => sum + (t.story_points || 0), 0);

      return {
        name: user.username,
        assigned: userTasks.length,
        completed: completedTasks,
        storyPoints: totalStoryPoints,
        completedPoints: completedStoryPoints,
      };
    }).filter(u => u.assigned > 0);
  };

  // Project Overview Data
  const getProjectOverviewData = () => {
    return projects.map(project => {
      const projectTasks = tasks.filter(t => t.project === project.id);
      const completedTasks = projectTasks.filter(t => t.status === 'done').length;
      const projectSprints = sprints.filter(s => s.project === project.id);

      return {
        name: project.name.substring(0, 15) + (project.name.length > 15 ? '...' : ''),
        tasks: projectTasks.length,
        completed: completedTasks,
        sprints: projectSprints.length,
      };
    });
  };

  // Summary Statistics
  const getSummaryStats = () => {
    const completedTasks = filteredTasks.filter(t => t.status === 'done').length;
    const completionRate = filteredTasks.length > 0 
      ? ((completedTasks / filteredTasks.length) * 100).toFixed(1) 
      : 0;

    const assignedTasks = filteredTasks.filter(t => t.assigned_to).length;
    const assignmentRate = filteredTasks.length > 0 
      ? ((assignedTasks / filteredTasks.length) * 100).toFixed(1) 
      : 0;

    return [
      {
        icon: CheckCircle,
        label: 'Completion Rate',
        value: `${completionRate}%`,
        color: '#2ecc71',
        subtext: `${completedTasks} of ${filteredTasks.length} tasks`,
      },
      {
        icon: Users,
        label: 'Assignment Rate',
        value: `${assignmentRate}%`,
        color: '#3498db',
        subtext: `${assignedTasks} tasks assigned`,
      },
      {
        icon: TrendingUp,
        label: 'Active Sprints',
        value: filteredSprints.filter(s => s.status === 'active').length,
        color: '#f39c12',
        subtext: `${filteredSprints.length} total sprints`,
      },
      {
        icon: Clock,
        label: 'In Progress',
        value: filteredTasks.filter(t => t.status === 'in_progress').length,
        color: '#e67e22',
        subtext: 'tasks being worked on',
      },
    ];
  };

  const taskStatusData = getTaskStatusData();
  const priorityData = getPriorityData();
  const sprintProgressData = getSprintProgressData();
  const teamPerformanceData = getTeamPerformanceData();
  const projectOverviewData = getProjectOverviewData();
  const summaryStats = getSummaryStats();

  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>Performance Analytics</h1>
      </div>

      <div style={styles.filters}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Project:</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={styles.select}
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>View:</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            style={styles.select}
          >
            <option value="overview">Overview</option>
            <option value="sprints">Sprint Progress</option>
            <option value="team">Team Performance</option>
            <option value="projects">Project Comparison</option>
          </select>
        </div>
      </div>

      {/* Summary Statistics */}
      <div style={styles.statsGrid}>
        {summaryStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} style={styles.statCard}>
              <div style={{...styles.statIcon, background: stat.color}}>
                <Icon size={24} color="white" />
              </div>
              <div style={styles.statContent}>
                <div style={styles.statLabel}>{stat.label}</div>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statSubtext}>{stat.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts based on selected view */}
      {chartType === 'overview' && (
        <div style={styles.chartsGrid}>
          {/* Task Status Pie Chart - FIXED */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Task Status Distribution</h3>
            {taskStatusData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {taskStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend below chart */}
                <div style={styles.legend}>
                  {taskStatusData.map((item, index) => (
                    <div key={index} style={styles.legendItem}>
                      <div style={{...styles.legendColor, background: item.color}} />
                      <span style={styles.legendText}>{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={styles.noData}>No task data available</div>
            )}
          </div>

          {/* Priority Distribution Pie Chart - FIXED */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Priority Distribution</h3>
            {priorityData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Legend below chart */}
                <div style={styles.legend}>
                  {priorityData.map((item, index) => (
                    <div key={index} style={styles.legendItem}>
                      <div style={{...styles.legendColor, background: item.color}} />
                      <span style={styles.legendText}>{item.name}: {item.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={styles.noData}>No priority data available</div>
            )}
          </div>
        </div>
      )}

      {chartType === 'sprints' && (
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Sprint Progress</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={sprintProgressData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#2ecc71" name="Completed Tasks" />
              <Bar dataKey="total" fill="#3498db" name="Total Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'team' && (
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Team Performance</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={teamPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#3498db" name="Assigned Tasks" />
              <Bar dataKey="completed" fill="#2ecc71" name="Completed Tasks" />
              <Bar dataKey="completedPoints" fill="#f39c12" name="Story Points" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {chartType === 'projects' && (
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Project Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={projectOverviewData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#3498db" name="Total Tasks" />
              <Bar dataKey="completed" fill="#2ecc71" name="Completed Tasks" />
              <Bar dataKey="sprints" fill="#9b59b6" name="Sprints" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Task Details Table */}
      <div style={styles.tableCard}>
        <h3 style={styles.chartTitle}>Recent Tasks</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.tableHeader}>Task</th>
                <th style={styles.tableHeader}>Project</th>
                <th style={styles.tableHeader}>Assigned To</th>
                <th style={styles.tableHeader}>Status</th>
                <th style={styles.tableHeader}>Priority</th>
                <th style={styles.tableHeader}>Story Points</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.slice(0, 10).map((task) => (
                <tr key={task.id} style={styles.tableRow}>
                  <td style={styles.tableCell}>{task.title}</td>
                  <td style={styles.tableCell}>{task.project_name}</td>
                  <td style={styles.tableCell}>
                    {task.assigned_to?.username || 'Unassigned'}
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.statusBadge,
                      background: getStatusColor(task.status)
                    }}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={styles.tableCell}>
                    <span style={{
                      ...styles.priorityBadge,
                      background: getPriorityColor(task.priority)
                    }}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={styles.tableCell}>{task.story_points || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const getStatusColor = (status) => {
  const colors = {
    todo: '#3498db',
    in_progress: '#f39c12',
    in_review: '#9b59b6',
    done: '#2ecc71',
  };
  return colors[status] || '#95a5a6';
};

const getPriorityColor = (priority) => {
  const colors = {
    low: '#3498db',
    medium: '#f39c12',
    high: '#e67e22',
    critical: '#e74c3c',
  };
  return colors[priority] || '#95a5a6';
};

const styles = {
  header: {
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
  },
  filters: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap',
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  filterLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
  },
  select: {
    padding: '10px 15px',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
    minWidth: '200px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  statCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  statIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '5px',
  },
  statValue: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '3px',
  },
  statSubtext: {
    fontSize: '12px',
    color: '#999',
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  chartCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    marginBottom: '20px',
  },
  chartTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginTop: '15px',
    justifyContent: 'center',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  legendColor: {
    width: '16px',
    height: '16px',
    borderRadius: '4px',
  },
  legendText: {
    fontSize: '13px',
    color: '#666',
  },
  noData: {
    textAlign: 'center',
    padding: '40px',
    color: '#999',
    fontSize: '14px',
  },
  tableCard: {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeaderRow: {
    borderBottom: '2px solid #e0e0e0',
  },
  tableHeader: {
    padding: '12px',
    textAlign: 'left',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#666',
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
  },
  tableCell: {
    padding: '12px',
    fontSize: '14px',
    color: '#333',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
    textTransform: 'capitalize',
    display: 'inline-block',
  },
  priorityBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    color: 'white',
    fontWeight: '500',
    textTransform: 'capitalize',
    display: 'inline-block',
  },
};

export default PerformanceChart;