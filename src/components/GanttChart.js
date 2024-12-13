import React, { useEffect } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import axios from "axios";
import "date-format-lite";

const GanttChart = ({ projectId }) => {
  useEffect(() => {
    gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
    gantt.config.date_format = "%Y-%m-%d %H:%i:%s";

    const formatDateForGantt = (date) => {
      if (!date) return null; // Handle null or undefined dates
      const d = new Date(date);
      if (isNaN(d.getTime())) return null; // Handle invalid date
      return gantt.date.date_to_str("%Y-%m-%d %H:%i:%s")(d);
    };

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/projects/${projectId}/tasks`
        );
        gantt.clearAll();
        console.log(response.data);

        // Format start_date and end_date
        response.data.data.forEach((task) => {
          task.start_date = formatDateForGantt(task.start_date);
          task.end_date = formatDateForGantt(task.end_date);
        });

        gantt.parse(response.data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    };

    const formatDate = (date) => {
      const d = new Date(date);
      if (isNaN(d.getTime())) return null;
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      const seconds = String(d.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const createTask = async (task) => {
      console.log("Creating task:", task);
      const formattedTask = {
        ...task,
        start_date: formatDate(task.start_date),
        end_date: task.end_date ? formatDate(task.end_date) : null,
        duration: parseInt(task.duration, 10),
      };
      try {
        const response = await axios.post(
          `http://localhost:5000/api/projects/${projectId}/tasks`,
          formattedTask
        );
        console.log("Task creation response:", response.data);
        return response.data || null; // Ensure the backend returns the new task id or null
      } catch (error) {
        console.error(
          "Failed to create task:",
          error.response ? error.response.data : error.message
        );
        throw error;
      }
    };

    const updateTask = async (id, task) => {
      console.log("Updating task:", id, task);
      const formattedTask = {
        ...task,
        start_date: task.start_date ? formatDate(task.start_date) : null,
        end_date: task.end_date ? formatDate(task.end_date) : null,
        duration: parseInt(task.duration, 10),
      };

      try {
        await axios.put(
          `http://localhost:5000/api/projects/${projectId}/tasks/${id}`,
          formattedTask
        );
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    };

    const deleteTask = async (id) => {
      console.log("Deleting task:", id);
      try {
        await axios.delete(
          `http://localhost:5000/api/projects/${projectId}/tasks/${id}`
        );
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    };

    fetchData();

    gantt.init("gantt_here");

    // Handle CRUD operations
    gantt.attachEvent("onTaskCreated", async (item) => {
      // Retrieve task if item is undefined
      if (!item) {
        item = {
          id: gantt.uid(),
          text: "New task",
          start_date: new Date(),
          duration: 1,
        };
        console.log("Created minimal task:", item);
      }

      // Ensure dates are formatted correctly
      if (item.start_date) {
        item.start_date = gantt.date.date_to_str("%Y-%m-%d %H:%i:%s")(
          new Date(item.start_date)
        );
      }

      if (item.end_date) {
        item.end_date = gantt.date.date_to_str("%Y-%m-%d %H:%i:%s")(
          new Date(item.end_date)
        );
      }

      try {
        console.log(item);
        const newTask = await createTask(item);
        console.log(newTask, "add");
        // if (newTask) {
        //   gantt.changeTaskId(item.id, newTask.id);
        //   gantt.updateTask(newTask.id, {s
        //     id: newTask.id,
        //     text: item.text,
        //     start_date: new Date(newTask.start_date),
        //     duration: item.duration,
        //   });
        //   console.log("Task updated with server data:", newTask);
        // } else {
        //   throw new Error("Failed to get new task data from server");
        // }
      } catch (error) {
        console.error("Error creating task:", error);
        // gantt.deleteTask(item.id);s
      }
    });

    gantt.attachEvent("onAfterTaskUpdate", (id) => {
      console.log(id, "update");
      const item = gantt.getTask(id);
      console.log("Task updated with ID:", id, "and item:", item);

      if (!item) {
        console.error("Task update failed: item is undefined");
        return;
      }

      if (item.start_date) {
        item.start_date = new Date(item.start_date);
      }

      if (item.end_date) {
        item.end_date = new Date(item.end_date);
        console.log("masuk");
        console.log(item.end_date);
      }

      console.log(item);
      updateTask(id, item);
    });

    gantt.attachEvent("onAfterTaskDelete", (id) => {
      console.log("Task deleted with ID:", id);
      deleteTask(id);
    });

    return () => {
      gantt.clearAll();
    };
  }, [projectId]);

  return <div id="gantt_here" style={{ width: "100%", height: "500px" }}></div>;
};

export default GanttChart;