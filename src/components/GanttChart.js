import React, { useEffect, useState } from "react";
import gantt from "dhtmlx-gantt";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import axios from "axios";

const GanttChart = ({ projectId, teamMembers }) => {
  const [timelineView, setTimelineView] = useState("months");

  useEffect(() => {
    gantt.config.xml_date = "%Y-%m-%d %H:%i:%s";
    gantt.config.show_progress = true;
    gantt.config.drag_progress = true;

    // Progress text inside task bar
    gantt.templates.progress_text = function (start, end, task) {
      return `${Math.round(task.progress * 100)}%`;
    };

    // User name on right side
    gantt.templates.rightside_text = function (start, end, task) {
      const assignedTo = teamMembers.find(member => member.id === task.assigned_to);
      return assignedTo ? assignedTo.name : "Unassigned";
    };

    // Clear main task text since we're using rightside_text
    gantt.templates.task_text = function (start, end, task) {
      return "";
    };
    gantt.plugins({ tooltip: true });

    gantt.form_blocks["assigned_select"] = {
      render: function(sns) {
        const options = [
          "<option value=''>Unassigned</option>",
          ...teamMembers.map(member => 
            `<option value='${member.id}'>${member.name}</option>`
          )
        ].join("");
        return "<div class='gantt_cal_ltext'><select>" + options + "</select></div>";
      },
      set_value: function(node, value, task) {
        node.querySelector("select").value = value || "";
      },
      get_value: function(node, task) {
        return node.querySelector("select").value || null;
      }
    };

    gantt.form_blocks["priority_select"] = {
      render: function(sns) {
        const options = [
          "<option value='1'>High</option>",
          "<option value='2'>Normal</option>",
          "<option value='3'>Low</option>"
        ].join("");
        return "<div class='gantt_cal_ltext'><select>" + options + "</select></div>";
      },
      set_value: function(node, value, task) {
        node.querySelector("select").value = value || "2";
      },
      get_value: function(node, task) {
        return node.querySelector("select").value;
      }
    };

    gantt.config.lightbox.sections = [
      { name: "description", height: 34, map_to: "text", type: "textarea", focus: true },
      { 
        name: "priority", 
        height: 30, 
        map_to: "priority", 
        type: "priority_select"
      },
      { 
        name: "assigned_to", 
        height: 30, 
        map_to: "assigned_to", 
        type: "assigned_select"
      },
      { name: "time", height: 72, type: "duration", map_to: "auto" }
    ];

    gantt.locale.labels.section_assigned_to = "Assigned To";
    gantt.locale.labels.section_priority = "Priority";

    gantt.templates.task_class = function(start, end, task) {
      switch (parseInt(task.priority)) {
        case 1: return "high-priority";
        case 3: return "low-priority";
        default: return "normal-priority";
      }
    };

    const taskStyles = document.createElement('style');
taskStyles.innerHTML = `
  /* Priority colors with hover effects */
  .high-priority .gantt_task_content,
  .high-priority .gantt_task_progress {
    background: #ff5252;
  }

  .normal-priority .gantt_task_content,
  .normal-priority .gantt_task_progress {
    background: #2196F3;
  }

  .low-priority .gantt_task_content,
  .low-priority .gantt_task_progress {
    background: #4CAF50;
  }


  /* Progress bar styling */
  .gantt_task_progress {
    text-align: center;
    z-index: 2;
    opacity: 0.8;
  }

  /* Progress text styling */
  .gantt_task_progress_text {
    position: absolute;
    z-index: 3;
    color: #fff;
    font-weight: bold;
    font-size: 12px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-shadow: 1px 1px 1px rgba(0,0,0,0.2);
    pointer-events: none;
    white-space: nowrap;
  }

  /* Task content styling */
  .gantt_task_content {
    opacity: 0.4;
  }

`;
document.head.appendChild(taskStyles);

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

        const transformedTasks = tasksResponse.data.data.map(task => ({
          ...task,
          start_date: new Date(task.start_date),
          end_date: task.end_date ? new Date(task.end_date) : null,
          assigned_to: task.assigned_to || null, // Ensure assigned_to is explicitly set
          priority: task.priority || "2" // Default to Normal priority
        }));

        gantt.clearAll();
        console.log("Tasks Data:", transformedTasks);
        console.log("Links Data:", linksResponse.data);
        gantt.parse({
          data: transformedTasks,
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
          progress: task.progress || 0.0,
          assigned_to: task.assigned_to, // Ensure this field is included
          priority: task.priority || "2", // Default to Normal priority
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
          progress: task.progress || 0.0,
          assigned_to: task.assigned_to, // Ensure this field is included
          priority: task.priority
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
          type: link.type, // DHTMLX expects string numbers ("0", "1", "2", "3")
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
      const validTypes = ["0", "1", "2", "3"]; // Valid string numbers
      if (!validTypes.includes(link.type)) {
        console.warn(`Invalid link type: ${link.type}`);
        return false; // Cancel if type is invalid
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
    // Initial setup with the default timeline view
    setTimelineScale(timelineView);

    fetchData();
    gantt.init("gantt_here");

    return () => gantt.clearAll();
  }, [projectId, timelineView, teamMembers]);

  return (
    <div>
      {/* Timeline Switcher */}
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