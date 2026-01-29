<?php

namespace App\Tests\Service;

use App\Entity\Task;
use App\Entity\TaskPriority;
use App\Entity\TaskStatus;
use App\Entity\TaskWorkflowRule;
use App\Repository\ProjectRepository;
use App\Repository\TaskPriorityRepository;
use App\Repository\TaskRepository;
use App\Repository\TaskStatusRepository;
use App\Repository\TaskWorkflowRuleRepository;
use App\Service\TaskService;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Validator\ConstraintViolationList;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class TaskServiceTest extends TestCase
{
    private $taskRepository;
    private $projectRepository;
    private $statusRepository;
    private $priorityRepository;
    private $workflowRuleRepository;
    private $validator;
    private $taskService;

    protected function setUp(): void
    {
        $this->taskRepository = $this->createMock(TaskRepository::class);
        $this->projectRepository = $this->createMock(ProjectRepository::class);
        $this->statusRepository = $this->createMock(TaskStatusRepository::class);
        $this->priorityRepository = $this->createMock(TaskPriorityRepository::class);
        $this->workflowRuleRepository = $this->createMock(TaskWorkflowRuleRepository::class);
        $this->validator = $this->createMock(ValidatorInterface::class);

        $this->taskService = new TaskService(
            $this->taskRepository,
            $this->projectRepository,
            $this->statusRepository,
            $this->priorityRepository,
            $this->workflowRuleRepository,
            $this->validator
        );
    }

    public function testUpdateTaskStatusSuccess(): void
    {
        // 1. Setup entities
        $currentStatus = $this->createMockTaskStatus('todo', 'To Do', 1);
        $newStatus = $this->createMockTaskStatus('in_progress', 'In Progress', 2);

        $task = $this->createMockTask('Test Task', null, $currentStatus);

        $rule = $this->createMockTaskWorkflowRule($currentStatus, $newStatus, 'Moving to in progress');

        // 2. Mock repository calls
        $this->taskRepository->expects($this->once())->method('find')->willReturn($task);
        $this->statusRepository->expects($this->once())->method('find')->with(2)->willReturn($newStatus);
        $this->workflowRuleRepository->expects($this->once())->method('getRule')->with(1, 2)->willReturn($rule);
        $this->validator->method('validate')->willReturn(new ConstraintViolationList());

        // 3. Execute
        $updatedTask = $this->taskService->updateTask(1, ['status_id' => 2]);

        // 4. Assert
        $this->assertSame($newStatus, $updatedTask->getStatus());
        $this->assertEquals('Moving to in progress', $updatedTask->getTransitionComment());
    }

    public function testUpdateTaskStatusForbiddenTransition(): void
    {
        // 1. Setup entities
        $currentStatus = $this->createMockTaskStatus('done', 'Done', 3);
        $newStatus = $this->createMockTaskStatus('todo', 'To Do', 1);

        $task = $this->createMockTask('Test Task', null, $currentStatus);

        // 2. Mock repository calls
        $this->taskRepository->expects($this->once())->method('find')->willReturn($task);
        $this->statusRepository->expects($this->once())->method('find')->with(1)->willReturn($newStatus);
        
        // Return null to simulate no rule found for this transition
        $this->workflowRuleRepository->expects($this->once())->method('getRule')->with(3, 1)->willReturn(null);

        // 3. Expect exception
        $this->expectException(UnprocessableEntityHttpException::class);
        $this->expectExceptionMessage('Invalid transition from Done to To Do');

        // 4. Execute
        $this->taskService->updateTask(1, ['status_id' => 1]);
    }

    private function createMockTaskStatus(string $name, string $label, ?int $id = null): TaskStatus
    {
        $taskStatus = new TaskStatus();
        $taskStatus->setName($name);
        $taskStatus->setLabel($label);
        if ($id !== null) {
            $this->setEntityId($taskStatus, $id);
        }
        return $taskStatus;
    }

    private function createMockTaskPriority(string $name, string $label, ?int $id = null): TaskPriority
    {
        $taskPriority = new TaskPriority();
        $taskPriority->setName($name);
        $taskPriority->setLabel($label);
        if ($id !== null) {
            $this->setEntityId($taskPriority, $id);
        }
        return $taskPriority;
    }

    private function createMockTaskWorkflowRule(TaskStatus $fromStatus, TaskStatus $toStatus, ?string $defaultComment = null): TaskWorkflowRule
    {
        $taskWorkflowRule = new TaskWorkflowRule();
        $taskWorkflowRule->setFromStatus($fromStatus);
        $taskWorkflowRule->setToStatus($toStatus);
        $taskWorkflowRule->setDefaultComment($defaultComment);
        return $taskWorkflowRule;
    }

    private function createMockTask(string $title, ?string $description = null, ?TaskStatus $status = null, ?TaskPriority $priority = null): Task
    {
        $task = new Task();
        $task->setTitle($title);
        $task->setDescription($description);
        $task->setStatus($status);
        $task->setPriority($priority);
        return $task;
    }

    private function setEntityId(object $entity, int $id): void
    {
        $reflection = new \ReflectionClass($entity);
        $property = $reflection->getProperty('id');
        $property->setAccessible(true);
        $property->setValue($entity, $id);
    }
}
