<?php

namespace App\Service;

use App\Entity\Project;
use App\Repository\ProjectRepository;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class ProjectService
{
    public function __construct(
        private ProjectRepository $projectRepository,
        private ValidatorInterface $validator
    ) {}

    public function getAllProjects(): array
    {
        return $this->projectRepository->findBy([], ['createdAt' => 'DESC']);
    }

    public function createProject(array $data): Project
    {
        $project = new Project();
        $project->setName($data['name'] ?? '');
        $project->setDescription($data['description'] ?? null);

        $errors = $this->validator->validate($project);
        if (count($errors) > 0) {
            throw new UnprocessableEntityHttpException("Invalid Data Submitted");
        }

        $this->projectRepository->save($project, true);

        return $project;
    }
}
