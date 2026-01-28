<?php

namespace App\Service;

use App\Entity\Project;
use App\Entity\Task;
use App\Entity\TaskStatus;
use App\Entity\TaskPriority;
use App\Entity\TaskWorkflowRule;
use App\Repository\ProjectRepository;
use App\Repository\TaskPriorityRepository;
use App\Repository\TaskRepository;
use App\Repository\TaskStatusRepository;
use App\Repository\TaskWorkflowRuleRepository;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TaskService
{
    public function __construct(
        private TaskRepository $taskRepository,
        private ProjectRepository $projectRepository,
        private TaskStatusRepository $statusRepository,
        private TaskPriorityRepository $priorityRepository,
        private TaskWorkflowRuleRepository $workflowRuleRepository,
        private ValidatorInterface $validator
    ) {}

    public function getTasksForProject(int $projectId, array $filters = []): array
    {
        $project = $this->projectRepository->find($projectId);
        if (!$project) {
            throw new NotFoundHttpException('Project not found');
        }

        return $this->taskRepository->findByProjectWithFilters($projectId, $filters);
    }

    public function createTask(int $projectId, array $data): Task
    {
        $project = $this->projectRepository->find($projectId);
        if (!$project instanceof Project) {
            throw new NotFoundHttpException('Project not found');
        }

        $task = new Task();
        $task->setTitle($data['title'] ?? '');
        $task->setDescription($data['description'] ?? null);
        $task->setProject($project);

        $statusId = $data['status_id'] ?? null;
        $priorityId = $data['priority_id'] ?? null;

        // Handle status - use provided ID or fallback to todo
        $status = $statusId ? $this->statusRepository->find($statusId) : $this->statusRepository->findOneByName('todo');
        
        // Handle priority - use provided ID or fallback to low
        $priority = $priorityId ? $this->priorityRepository->find($priorityId) : $this->priorityRepository->findOneByName('low');

        if (!$status instanceof TaskStatus || !$priority instanceof TaskPriority) {
            throw new UnprocessableEntityHttpException('Invalid status or priority configuration in the system');
        }

        $task->setStatus($status);
        $task->setPriority($priority);

        $errors = $this->validator->validate($task);
        if (count($errors) > 0) {
            throw new UnprocessableEntityHttpException("Invalid Data Submitted");
        }

        $this->taskRepository->save($task, true);

        return $task;
    }

    public function updateTask(int $taskId, array $data): Task
    {
        $task = $this->taskRepository->find($taskId);
        if (!$task instanceof Task) {
            throw new NotFoundHttpException('Task not found');
        }

        if (array_key_exists('status_id', $data) && !empty($data['status_id'])) {
            $newStatusID = $data['status_id'];
            $newStatus = $this->statusRepository->find($newStatusID);
            if (!$newStatus instanceof TaskStatus) {
                throw new UnprocessableEntityHttpException('Invalid status ID');
            }

            if ($task->getStatus()->getId() !== $newStatus->getId()) {
                $rule = $this->workflowRuleRepository->getRule($task->getStatus()->getId(), $newStatus->getId());
                if (!$rule instanceof TaskWorkflowRule) {
                    throw new UnprocessableEntityHttpException('Invalid transition from ' . $task->getStatus()->getLabel() . ' to ' . $newStatus->getLabel());
                }
                $task->setStatus($newStatus);
                $task->setTransitionComment($rule->getDefaultComment());
            }
        }

        if (isset($data['priority_id'])) {
            $newPriorityID = $data['priority_id'];
            $newPriority = $this->priorityRepository->find($newPriorityID);
            if (!$newPriority instanceof TaskPriority) {
                throw new UnprocessableEntityHttpException('Invalid priority ID');
            }
            $task->setPriority($newPriority);
        }

        $errors = $this->validator->validate($task);
        if (count($errors) > 0) {
            throw new UnprocessableEntityHttpException("Invalid Data Submitted");
        }

        $this->taskRepository->save($task, true);
        return $task;
    }

    public function deleteTask(int $taskId): void
    {
        $task = $this->taskRepository->find($taskId);
        if (!$task instanceof Task) {
            throw new NotFoundHttpException('Task not found');
        }

        $this->taskRepository->remove($task, true);
    }
}
