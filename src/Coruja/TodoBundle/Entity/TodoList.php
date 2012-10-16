<?php
namespace Coruja\TodoBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Entity
 * @ORM\Table(name="TodoList")
 */
class TodoList
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
     * @ORM\OneToMany(targetEntity="Todo", mappedBy="todoList", cascade={"all"})
     **/
    protected $todos;

    public function __construct() {
        $this->todos = new ArrayCollection;
    }

    public function getId() {
        return $this->id;
    }

    public function setTitle($title) {
        $this->title = $title;
    }

    public function addTodo(Todo $todo) {
        $this->todos->add($todo);
    }

    public function getTodos()  {
        return $this->todos;
    }



}