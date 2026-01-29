<?php

namespace App\Service;

use App\Repository\TaskPriorityRepository;
use App\Repository\TaskStatusRepository;

class ConfigService
{
    public function __construct(
        private TaskStatusRepository $statusRepository,
        private TaskPriorityRepository $priorityRepository
    ) {}

    public function getAllStatuses(): array
    {
        return $this->statusRepository->findAll();
    }

    public function getAllPriorities(): array
    {
        return $this->priorityRepository->findAll();
    }
}



