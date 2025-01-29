import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    ComposedChart,
    CartesianGrid,
    Line,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    BarChart
} from 'recharts';

const ChartSection = ({ tasks }) => {
    // State untuk menyimpan data kemajuan keseluruhan tugas
    const [overallTask, setOverallTask] = useState([
        { name: 'Completed', value: 0 },
        { name: 'Remaining', value: 100 },
    ]);

    // State untuk menyimpan data kemajuan tugas individu
    const [taskProgress, setTaskProgress] = useState([]);

    // State untuk menyimpan jumlah tugas per anggota tim
    const [teamTaskCount, setTeamTaskCount] = useState([]);

    // Menggunakan useEffect untuk memproses data setiap kali tasks berubah
    useEffect(() => {
        console.log('Tasks:', tasks); // Log data tasks

        if (tasks.length > 0) {
            // Memisahkan tugas utama dan subtugas
            const mainTasks = tasks.filter(task => task.parent_id === null);
            const subTasks = tasks.filter(task => task.parent_id !== null);

            // Menghitung persentase tugas yang telah diselesaikan dan yang tersisa
            const overallCompleted = mainTasks.length > 0 
                ? mainTasks.reduce((acc, task) => acc + (task.progress * 100), 0) / mainTasks.length 
                : 0;
            const overallRemaining = 100 - overallCompleted;

            // Mengupdate state overallTask dengan data yang baru
            setOverallTask([
                { name: 'Completed', value: parseFloat(overallCompleted.toFixed(1)) },
                { name: 'Remaining', value: parseFloat(overallRemaining.toFixed(1)) },
            ]);

            // Membuat data untuk grafik kemajuan tugas individu
            const taskProgressData = mainTasks.map(task => ({
                name: task.text,
                subtask: subTasks.filter(subtask => subtask.parent_id === task.id).length,
                progress: parseFloat((task.progress * 100).toFixed(1)),
                remaining: parseFloat((100 - (task.progress * 100)).toFixed(1)),
            }));

            console.log('Task Progress Data:', taskProgressData); // Log data task progress

            // Mengupdate state taskProgress dengan data yang baru
            setTaskProgress(taskProgressData);

            // Menghitung jumlah tugas per anggota tim
            const teamTaskCountData = tasks.reduce((acc, task) => {
                const assignee = task.assigned_to_name || 'Unassigned';
                if (!acc[assignee]) {
                    acc[assignee] = 0;
                }
                acc[assignee]++;
                return acc;
            }, {});

            // Mengubah objek teamTaskCountData menjadi array untuk digunakan dalam grafik
            const teamTaskCountArray = Object.keys(teamTaskCountData).map(assignee => ({
                name: assignee,
                taskCount: teamTaskCountData[assignee],
            }));

            console.log('Team Task Count Data:', teamTaskCountArray); // Log data to check

            // Mengupdate state teamTaskCount dengan data yang baru
            setTeamTaskCount(teamTaskCountArray);
        }
    }, [tasks]);

    // Warna untuk grafik Pie
    const COLORS = ['#0088FE', '#FF8042'];

    // Formatter untuk tooltip
    const tooltipFormatter = (value, name) => {
        if (name === 'progress' || name === 'remaining') {
            return `${parseFloat(value.toFixed(1))}%`;
        }
        return value;
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Overall Progress Pie Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Overall Progress</h2>
                </div>
                <div className="h-80 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={overallTask}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {overallTask.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Centered percentage label */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <span className="text-2xl font-bold">{Math.round(overallTask[0].value)}%</span>
                    </div>
                </div>
            </div>

            {/* Team Task Count Bar Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Team Task Count</h2>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={teamTaskCount}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                            layout="vertical"
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis type="category" dataKey="name" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="taskCount" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Task Progress Composed Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6 col-span-2">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Task Progress</h2>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            layout="vertical" // Change to vertical layout
                            width={500}
                            height={400}
                            data={taskProgress}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 200, // Increase left margin for long task names
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" />
                            <XAxis type="number" domain={[0, 100]} /> 
                            <YAxis dataKey="name" type="category" width={150} />
                            <Tooltip formatter={tooltipFormatter} />
                            <Legend />
                            <Bar dataKey="progress" barSize={20} fill="#413ea0" stackId="a" />
                            <Bar dataKey="remaining" barSize={20} fill="#8884d8" stackId="a" opacity={0.4} />
                            <Line dataKey="subtask" stroke="#ff7300" />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ChartSection;