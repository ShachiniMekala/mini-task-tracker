<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
#[ORM\Table(name: 'task')]
#[ORM\Index(columns: ['title'], name: 'idx_task_title')]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['task:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'tasks')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['task:read'])]
    private ?Project $project = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Task title cannot be empty')]
    #[Groups(['task:read'])]
    private ?string $title = null;

    #[ORM\Column(length: 1000, nullable: true)]
    #[Groups(['task:read'])]
    private ?string $description = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, name: 'status_id', referencedColumnName: 'id')]
    #[Groups(['task:read'])]
    private ?TaskStatus $status = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, name: 'priority_id', referencedColumnName: 'id')]
    #[Groups(['task:read'])]
    private ?TaskPriority $priority = null;

    #[ORM\Column]
    #[Groups(['task:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['task:read'])]
    private ?string $transitionComment = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getProject(): ?Project { return $this->project; }
    public function setProject(?Project $project): self { $this->project = $project; return $this; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self { $this->description = $description; return $this; }
    public function getStatus(): ?TaskStatus { return $this->status; }
    public function setStatus(?TaskStatus $status): self { $this->status = $status; return $this; }
    public function getPriority(): ?TaskPriority { return $this->priority; }
    public function setPriority(?TaskPriority $priority): self { $this->priority = $priority; return $this; }
    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }

    public function getTransitionComment(): ?string { return $this->transitionComment; }
    public function setTransitionComment(?string $transitionComment): self { $this->transitionComment = $transitionComment; return $this; }
}
