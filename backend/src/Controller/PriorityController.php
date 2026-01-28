<?php

namespace App\Controller;

use App\Service\ConfigService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class PriorityController extends AbstractController
{
    public function __construct(
        private ConfigService $configService
    ) {}

    public function index(): JsonResponse
    {
        $priorities = $this->configService->getAllPriorities();
        return $this->json($priorities, 200, [], ['groups' => 'task:read']);
    }
}
