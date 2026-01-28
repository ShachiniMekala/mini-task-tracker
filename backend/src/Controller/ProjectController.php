<?php

namespace App\Controller;

use App\Service\ProjectService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class ProjectController extends AbstractController
{
    public function __construct(
        private ProjectService $projectService
    ) {}

    public function index(): JsonResponse
    {
        $projects = $this->projectService->getAllProjects();
        return $this->json($projects, Response::HTTP_OK, [], ['groups' => 'project:read']);
    }

    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $project = $this->projectService->createProject($data);
        
        return $this->json($project, Response::HTTP_CREATED, [], ['groups' => 'project:read']);
    }
}
