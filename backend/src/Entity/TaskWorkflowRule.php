<?php

namespace App\Entity;

use App\Repository\TaskWorkflowRuleRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TaskWorkflowRuleRepository::class)]
#[ORM\Table(name: 'task_workflow_rule')]
class TaskWorkflowRule
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?TaskStatus $fromStatus = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?TaskStatus $toStatus = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $defaultComment = null;

    public function getId(): ?int { return $this->id; }

    public function getFromStatus(): ?TaskStatus { return $this->fromStatus; }
    public function setFromStatus(?TaskStatus $fromStatus): self { $this->fromStatus = $fromStatus; return $this; }

    public function getToStatus(): ?TaskStatus { return $this->toStatus; }
    public function setToStatus(?TaskStatus $toStatus): self { $this->toStatus = $toStatus; return $this; }

    public function getDefaultComment(): ?string { return $this->defaultComment; }
    public function setDefaultComment(?string $defaultComment): self { $this->defaultComment = $defaultComment; return $this; }
}

