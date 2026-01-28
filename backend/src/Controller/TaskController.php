<?php

namespace App\Controller;

use App\Service\TaskService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends AbstractController
{
    public function __construct(
        private TaskService $taskService
    ) {}

    public function index(int $projectId, Request $request): JsonResponse
    {
        $filters = $request->query->all('filter');

        $tasks = $this->taskService->getTasksForProject($projectId, $filters);
        
        return $this->json($tasks, Response::HTTP_OK, [], ['groups' => 'task:read']);
    }

    public function create(int $projectId, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $task = $this->taskService->createTask($projectId, $data);

        return $this->json($task, Response::HTTP_CREATED, [], ['groups' => 'task:read']);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $task = $this->taskService->updateTask($id, $data);

        return $this->json($task, Response::HTTP_OK, [], ['groups' => 'task:read']);
    }

    public function delete(int $id): JsonResponse
    {
        $this->taskService->deleteTask($id);
        return $this->json([], Response::HTTP_NO_CONTENT);
    }
}
