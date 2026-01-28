<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260127171945 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Initialize database with project, task, status, priority and workflow tables';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE project (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description VARCHAR(1000) DEFAULT NULL, created_at DATETIME NOT NULL)');
        $this->addSql('CREATE INDEX idx_project_name ON project (name)');
        $this->addSql('CREATE TABLE task (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description VARCHAR(1000) DEFAULT NULL, created_at DATETIME NOT NULL, transition_comment VARCHAR(255) DEFAULT NULL, project_id INTEGER NOT NULL, status_id INTEGER NOT NULL, priority_id INTEGER NOT NULL, CONSTRAINT fk_task_project_id FOREIGN KEY (project_id) REFERENCES project (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT fk_task_status_id FOREIGN KEY (status_id) REFERENCES task_status (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT fk_task_priority_id FOREIGN KEY (priority_id) REFERENCES task_priority (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX idx_task_project_id ON task (project_id)');
        $this->addSql('CREATE INDEX idx_task_status_id ON task (status_id)');
        $this->addSql('CREATE INDEX idx_task_priority_id ON task (priority_id)');
        $this->addSql('CREATE INDEX idx_task_title ON task (title)');
        $this->addSql('CREATE TABLE task_priority (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(20) NOT NULL, label VARCHAR(50) DEFAULT NULL)');
        $this->addSql('CREATE UNIQUE INDEX idx_task_priority_name ON task_priority (name)');
        $this->addSql('CREATE TABLE task_status (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(20) NOT NULL, label VARCHAR(50) DEFAULT NULL)');
        $this->addSql('CREATE UNIQUE INDEX idx_task_status_name ON task_status (name)');
        $this->addSql('CREATE TABLE task_workflow_rule (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, default_comment VARCHAR(255) DEFAULT NULL, from_status_id INTEGER NOT NULL, to_status_id INTEGER NOT NULL, CONSTRAINT fk_rule_from_status_id FOREIGN KEY (from_status_id) REFERENCES task_status (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT fk_rule_to_status_id FOREIGN KEY (to_status_id) REFERENCES task_status (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX idx_task_workflow_rule_from_status_id ON task_workflow_rule (from_status_id)');
        $this->addSql('CREATE INDEX idx_task_workflow_rule_to_status_id ON task_workflow_rule (to_status_id)');

        // Seed task_status
        $this->addSql("INSERT INTO task_status (name, label) VALUES ('todo', 'To Do'), ('in_progress', 'In Progress'), ('done', 'Done')");
        
        // Seed task_priority
        $this->addSql("INSERT INTO task_priority (name, label) VALUES ('low', 'Low'), ('medium', 'Medium'), ('high', 'High')");

        // Seed task_workflow_rule (Allowed transitions)
        // todo -> in_progress
        $this->addSql("INSERT INTO task_workflow_rule (from_status_id, to_status_id) VALUES ((SELECT id FROM task_status WHERE name = 'todo'), (SELECT id FROM task_status WHERE name = 'in_progress'))");
        // in_progress -> done
        $this->addSql("INSERT INTO task_workflow_rule (from_status_id, to_status_id) VALUES ((SELECT id FROM task_status WHERE name = 'in_progress'), (SELECT id FROM task_status WHERE name = 'done'))");
        // todo -> done (fast-tracked)
        $this->addSql("INSERT INTO task_workflow_rule (from_status_id, to_status_id, default_comment) VALUES ((SELECT id FROM task_status WHERE name = 'todo'), (SELECT id FROM task_status WHERE name = 'done'), 'fast-tracked')");
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE project');
        $this->addSql('DROP TABLE task');
        $this->addSql('DROP TABLE task_priority');
        $this->addSql('DROP TABLE task_status');
        $this->addSql('DROP TABLE task_workflow_rule');
    }
}
