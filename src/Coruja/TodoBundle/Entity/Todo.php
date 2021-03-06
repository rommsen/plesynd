<?php
namespace Coruja\TodoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="Todo")
 */
class Todo
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @ORM\Column(type="string", length=100)
     */
    protected $title;

    /**
     * @ORM\Column(type="boolean")
     */
    protected $completed;

    /**
     * @var TodoList
     * @ORM\ManyToOne(targetEntity="TodoList", inversedBy="todos")
     * @ORM\JoinColumn(name="todo_list_id", referencedColumnName="id")
     */
    protected $todoList;

    public function getId() {
        return $this->id;
    }

    public function setCompleted($completed) {
        $this->completed = $completed;
    }

    public function setTitle($title) {
        $this->title = $title;
    }

    public function setTodoList(TodoList $todoList) {
        $this->todoList = $todoList;
        $this->todoList->addTodo($this);
    }

    /**
     * @return TodoList
     */
    public function getTodoList() {
        return $this->todoList;
    }
}