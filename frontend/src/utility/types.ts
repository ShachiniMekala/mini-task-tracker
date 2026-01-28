export type Project = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
};

export type ProjectModel = {
  name: string;
  description: string;
};

export type Task = {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  priority: Priority;
  status: Status;
};

export type TaskModel = {
  title: string;
  description: string;
  priorityId: number | null | string;
};

export type Priority = {
  id: number;
  name: string;
  label: string;
};

export type Status = {
  id: number;
  name: string;
  label: string;
};
