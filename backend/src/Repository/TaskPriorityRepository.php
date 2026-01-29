<?php

namespace App\Repository;

use App\Entity\TaskPriority;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TaskPriority>
 */
class TaskPriorityRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TaskPriority::class);
    }

    public function findOneByName(string $name): ?TaskPriority
    {
        return $this->findOneBy(['name' => $name]);
    }
}


