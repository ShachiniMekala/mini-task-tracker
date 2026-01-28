<?php

namespace App\Repository;

use App\Entity\TaskWorkflowRule;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<TaskWorkflowRule>
 */
class TaskWorkflowRuleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, TaskWorkflowRule::class);
    }

    /**
     * Get rule for a transition
     */
    public function getRule(int $fromStatusId, int $toStatusId): ?TaskWorkflowRule
    {
        return $this->findOneBy([
            'fromStatus' => $fromStatusId,
            'toStatus' => $toStatusId
        ]);
    }
}

