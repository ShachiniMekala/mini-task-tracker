import { Priority, Status, Task } from "@/utility/types";
import { useConfig } from "../../../context/ConfigContext";
import { TrashIcon } from "../../common/Icons";
import "./TaskRow.css";

interface TaskRowProps {
  task: Task;
  onUpdate: (id: number, data: any) => void;
  onDelete: (id: number) => void;
}

const TaskRow = ({ task, onUpdate, onDelete }: TaskRowProps) => {
  const { statuses, priorities } = useConfig()!;

  return (
    <div className="task-row">
      <div className="task-info">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <h3 className="task-title">{task.title}</h3>
        </div>
        <p className="task-desc">
          {task.description || "No description provided."}
        </p>
      </div>

      <div className="task-status-col">
        <select
          value={task.status.id}
          onChange={(e) => onUpdate(task.id, { statusId: e.target.value })}
          className="task-select"
        >
          {statuses.map((s: Status) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="task-priority-col">
        <select
          value={String(task.priority.id)}
          onChange={(e) => onUpdate(task.id, { priorityId: e.target.value })}
          className="task-select"
        >
          {priorities?.map((p: Priority) => (
            <option key={p.id} value={String(p.id)}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="task-date">
        {new Date(task.createdAt).toLocaleDateString()}
      </div>

      <div className="task-actions">
        <button
          onClick={() => onDelete(task.id)}
          className="task-delete-btn"
          title="Delete Task"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default TaskRow;
