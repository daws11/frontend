import React, { useEffect } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import axios from "axios";

const GanttChart = ({ projectId }) => {
  useEffect(() => {
    // Konfigurasi format tanggal di Gantt
    gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";

    // Helper: Format Date ke String
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${
        String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };

    // Fetch data dari server untuk tasks dan links
    const fetchData = async () => {
      try {
        const [tasksResponse, linksResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/projects/${projectId}/tasks`),
          axios.get(`http://localhost:5000/api/projects/${projectId}/links`),
        ]);
    
        if (!Array.isArray(tasksResponse.data.data)) {
          throw new Error("Invalid tasks data format");
        }
    
        console.log("Parsed Data:", {
          data: tasksResponse.data.data,
          links: linksResponse.data,
        });
    
        gantt.clearAll();
        gantt.parse({
          data: tasksResponse.data.data,
          links: linksResponse.data,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
      }
    };
    

    // Create Task
    const createTask = async (task) => {
      try {
        const formattedTask = {
          text: task.text || "New task", // Default text jika kosong
          start_date: formatDate(task.start_date),
          end_date: task.end_date ? formatDate(task.end_date) : null,
          duration: task.duration || 1, // Default duration jika kosong
          parent_id: task.parent || null, // Default parent_id NULL untuk task utama
        };

        // Kirim task ke backend
        const response = await axios.post(
          `http://localhost:5000/api/projects/${projectId}/tasks`,
          formattedTask
        );

        // Validasi respons
        if (!response.data || !response.data.id) {
          throw new Error("Invalid response from server for task creation");
        }

        gantt.changeTaskId(task.id, response.data.id); // Update ID di Gantt
        gantt.updateTask(response.data.id); // Refresh task setelah ID diperbarui
      } catch (error) {
        console.error("Failed to create task:", error.message);
      }
    };

    // Update Task
    const updateTask = async (id, task) => {
      try {
        const formattedTask = {
          text: task.text,
          start_date: formatDate(task.start_date),
          end_date: task.end_date ? formatDate(task.end_date) : null,
          duration: task.duration,
        };

        await axios.put(
          `http://localhost:5000/api/projects/${projectId}/tasks/${id}`,
          formattedTask
        );
      } catch (error) {
        console.error("Failed to update task:", error.message);
      }
    };

    // Delete Task
    const deleteTask = async (id) => {
      try {
        await axios.delete(
          `http://localhost:5000/api/projects/${projectId}/tasks/${id}`
        );
      } catch (error) {
        console.error("Failed to delete task:", error.message);
      }
    };

// Event Handler: Create Link
const createLink = async (link) => {
  try {
    console.log("Creating Link:", link); // Debug log untuk memastikan 'type' tersedia

    const formattedLink = {
      source: link.source,
      target: link.target,
      type: link.type || "FS", // Default ke 'FS' jika type tidak diberikan
    };

    const response = await axios.post(
      `http://localhost:5000/api/projects/${projectId}/links`,
      formattedLink
    );

    gantt.changeLinkId(link.id, response.data.id); // Update ID di Gantt
  } catch (error) {
    console.error("Failed to create link:", error.message);
    gantt.deleteLink(link.id); // Hapus link dari Gantt jika gagal
  }
};

// Event Handler: Delete Link
const deleteLink = async (id) => {
  try {
    await axios.delete(`http://localhost:5000/api/projects/${projectId}/links/${id}`);
  } catch (error) {
    console.error("Failed to delete link:", error.message);
  }
};

// Konfigurasi Event Gantt untuk Link
gantt.attachEvent("onAfterLinkAdd", (id, link) => {
  createLink(link);
});

gantt.attachEvent("onAfterLinkDelete", (id) => {
  deleteLink(id);
});

    gantt.attachEvent("onAfterTaskAdd", (id, task) => createTask(task));
    gantt.attachEvent("onAfterTaskUpdate", (id, task) => updateTask(id, task));
    gantt.attachEvent("onAfterTaskDelete", (id) => deleteTask(id));


    // Inisialisasi Gantt dan Fetch Data
    fetchData();
    gantt.init("gantt_here");

    // Cleanup on Unmount
    return () => gantt.clearAll();
  }, [projectId]);

  return <div id="gantt_here" style={{ width: "100%", height: "500px" }}></div>;
};

export default GanttChart;
