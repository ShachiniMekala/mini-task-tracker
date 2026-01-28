<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ORM\Table(name: 'project')]
#[ORM\Index(columns: ['name'], name: 'idx_project_name')]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['project:read', 'task:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Project name cannot be empty')]
    #[Assert\Length(max: 255, maxMessage: 'Project name cannot be longer than {{ limit }} characters')]
    #[Groups(['project:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 1000, nullable: true)]
    #[Assert\Length(max: 1000, maxMessage: 'Description cannot be longer than {{ limit }} characters')]
    #[Groups(['project:read'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['project:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: Task::class, orphanRemoval: true)]
    private Collection $tasks;

    public function __construct()
    {
        $this->tasks = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getName(): ?string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self { $this->description = $description; return $this; }
    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    
    /** @return Collection<int, Task> */
    public function getTasks(): Collection { return $this->tasks; }
}

