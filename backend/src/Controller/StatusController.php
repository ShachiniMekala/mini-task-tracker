<?php

namespace App\Controller;

use App\Service\ConfigService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;

class StatusController extends AbstractController
{
    public function __construct(
        private ConfigService $configService
    ) {}

    public function index(): JsonResponse
    {
        $statuses = $this->configService->getAllStatuses();
        return $this->json($statuses, 200, [], ['groups' => 'task:read']);
    }
}
