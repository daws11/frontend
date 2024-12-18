import React, { useEffect, useState } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import axios from "axios";

const GanttChart = ({ projectId }) => {
  const [timelineView, setTimelineView] = useState("quarters");
  useEffect(() => {
    gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
    gantt.config.show_progress = true;
    gantt.templates.progress_text = function (start, end, task) {
      return `<span style="position: absolute; left: 5px; color: white; font-weight: bold;">${Math.round(task.progress * 100)}%</span>`;
    };
    gantt.templates.task_text = function (start, end, task) {
      return ""; // Menghilangkan text pada task
    };
    gantt.plugins({ 
      tooltip: true 
  });
  gantt.skin = "dark";

    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${
        String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
    };

    const fetchData = async () => {
      try {
        const [tasksResponse, linksResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/projects/${projectId}/tasks`),
          axios.get(`http://localhost:5000/api/projects/${projectId}/links`),
        ]);

        if (!Array.isArray(tasksResponse.data.data) || !Array.isArray(linksResponse.data)) {
          throw new Error("Invalid data format from server");
        }

        gantt.clearAll();
        console.log("Tasks Data:", tasksResponse.data.data);
        console.log("Links Data:", linksResponse.data);
        gantt.parse({
          data: tasksResponse.data.data,
          links: linksResponse.data,
        });
      } catch (error) {
        console.error("Failed to fetch data:", error.message);
      }
    };

    const createTask = async (task) => {
      try {
        const formattedTask = {
          text: task.text || "New task",
          start_date: formatDate(task.start_date),
          end_date: task.end_date ? formatDate(task.end_date) : null,
          duration: task.duration || 1,
          progress: task.progress || 0.0, // Mengirim nilai progress
          parent_id: task.parent || null,
        };

        const response = await axios.post(
          `http://localhost:5000/api/projects/${projectId}/tasks`,
          formattedTask
        );

        if (!response.data || !response.data.id) {
          throw new Error("Invalid response from server for task creation");
        }

        gantt.changeTaskId(task.id, response.data.id);
        gantt.updateTask(response.data.id);
      } catch (error) {
        console.error("Failed to create task:", error.message);
      }
    };

    const updateTask = async (id, task) => {
      try {
        const formattedTask = {
          text: task.text,
          start_date: formatDate(task.start_date),
          end_date: task.end_date ? formatDate(task.end_date) : null,
          duration: task.duration,
          progress: task.progress || 0.0, // Mengirim nilai progress
        };

        await axios.put(
          `http://localhost:5000/api/projects/${projectId}/tasks/${id}`,
          formattedTask
        );
      } catch (error) {
        console.error("Failed to update task:", error.message);
      }
    };
    const deleteTask = async (id) => {
      try {
        await axios.delete(
          `http://localhost:5000/api/projects/${projectId}/tasks/${id}`
        );
      } catch (error) {
        console.error("Failed to delete task:", error.message);
      }
    };

    const createLink = async (link) => {
      try {
        const formattedLink = {
          source: link.source,
          target: link.target,
          type: link.type, // DHTMLX mengharapkan string angka ("0", "1", "2", "3")
        };

        const response = await axios.post(
          `http://localhost:5000/api/projects/${projectId}/links`,
          formattedLink
        );

        gantt.changeLinkId(link.id, response.data.id);
        gantt.getLink(response.data.id).type = response.data.type;
        gantt.updateLink(response.data.id);
      } catch (error) {
        console.error("Failed to create link:", error.message);
        gantt.deleteLink(link.id);
      }
    };

    const deleteLink = async (id) => {
      try {
        await axios.delete(`http://localhost:5000/api/projects/${projectId}/links/${id}`);
      } catch (error) {
        console.error("Failed to delete link:", error.message);
      }
    };

    gantt.attachEvent("onBeforeLinkAdd", (id, link) => {
      const validTypes = ["0", "1", "2", "3"]; // String angka yang valid
      if (!validTypes.includes(link.type)) {
        console.warn(`Invalid link type: ${link.type}`);
        return false; // Batalkan jika type tidak valid
      }
      return true;
    });

    gantt.attachEvent("onAfterLinkAdd", (id, link) => {
      createLink(link);
    });

    gantt.attachEvent("onAfterLinkDelete", (id) => {
      deleteLink(id);
    });

    gantt.attachEvent("onAfterTaskAdd", (id, task) => createTask(task));
    gantt.attachEvent("onAfterTaskUpdate", (id, task) => updateTask(id, task));
    gantt.attachEvent("onAfterTaskDelete", (id) => deleteTask(id));

    const setTimelineScale = (scale) => {
      switch (scale) {
        case "years":
          gantt.config.scale_unit = "year";
          gantt.config.date_scale = "%Y";
          gantt.config.subscales = [{ unit: "month", step: 1, date: "%M" }];
          break;
        case "quarters":
          gantt.config.scale_unit = "quarter";
          gantt.config.date_scale = "Q%q %Y";
          gantt.config.subscales = [{ unit: "month", step: 1, date: "%M" }];
          break;
        case "months":
          gantt.config.scale_unit = "month";
          gantt.config.date_scale = "%F %Y";
          gantt.config.subscales = [{ unit: "week", step: 1, date: "Week #%W" }];
          break;
        case "weeks":
          gantt.config.scale_unit = "week";
          gantt.config.date_scale = "Week #%W";
          gantt.config.subscales = [{ unit: "day", step: 1, date: "%d %M" }];
          break;
        case "days":
          gantt.config.scale_unit = "day";
          gantt.config.date_scale = "%d %M";
          gantt.config.subscales = [{ unit: "hour", step: 1, date: "%H:%i" }];
          break;
        case "hours":
          gantt.config.scale_unit = "hour";
          gantt.config.date_scale = "%H:%i";
          gantt.config.subscales = [{ unit: "day", step: 1, date: "%d %M" }];
          break;
        default:
          break;
      }
      gantt.render();
    };
    // Inisialisasi awal dengan tampilan hari
    setTimelineScale(timelineView);

    fetchData();
    gantt.init("gantt_here");

    return () => gantt.clearAll();
  }, [projectId,timelineView]);

  return (
    <div>
      {/* Timeline Switcher */}
      {/* Dropdown Timeline Switcher */}
      <div style={{ marginBottom: "10px" }}>
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Zoom to:
        </label>
        <select
          value={timelineView}
          onChange={(e) => setTimelineView(e.target.value)}
          style={{ padding: "5px", fontSize: "14px" }}
        >
          <option value="years">Years</option>
          <option value="quarters">Quarters</option>
          <option value="months">Months</option>
          <option value="weeks">Weeks</option>
          <option value="days">Days</option>
          <option value="hours">Hours</option>
        </select>
      </div>

      {/* Gantt Chart */}
      <div id="gantt_here" style={{ width: "100%", height: "500px" }}></div>
    </div>
  );
};

export default GanttChart;
