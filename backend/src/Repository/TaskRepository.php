<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Task>
 */
class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    public function save(Task $task, bool $flush = false): void
    {
        $this->getEntityManager()->persist($task);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Task $task, bool $flush = false): void
    {
        $this->getEntityManager()->remove($task);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Custom search and filter for tasks
     */
    public function findByProjectWithFilters(int $projectId, array $filters = []): array
    {
        $qb = $this->createQueryBuilder('t')
            ->where('t.project = :projectId')
            ->setParameter('projectId', $projectId)
            ->leftJoin('t.status', 's')
            ->leftJoin('t.priority', 'p')
            ->addSelect('s', 'p');

        if (array_key_exists('status', $filters) && !empty($filters['status'])) {
            $qb->andWhere('s.id = :statusId')
               ->setParameter('statusId', $filters['status']);
        }

        if (array_key_exists('q', $filters) && !empty($filters['q'])) {
            $qb->andWhere('t.title LIKE :query OR t.description LIKE :query')
               ->setParameter('query', '%' . $filters['q'] . '%');
        }

        $qb->orderBy('t.createdAt', 'DESC');

        return $qb->getQuery()->getResult();
    }
}
