<?php
namespace Coruja\PlesyndBundle\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/**
 * @ORM\Entity
 * @ORM\Table(name="Workspace")
 */
class Workspace
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
     * @ORM\OneToMany(targetEntity="Widget", mappedBy="workspace", cascade={"all"})
     **/
    protected $widgets;


    public function __construct() {
        $this->widgets = new ArrayCollection();
    }

    public function getId() {
        return $this->id;
    }

    public function setTitle($title) {
        $this->title = $title;
    }

    public function getTitle() {
        return $this->title;
    }

    public function addWidget(Widget $widget) {
        $widget->setPosition($this->widgets->count()+1);
        $this->widgets->add($widget);
    }

    public function getWidgets()  {
        return $this->widgets;
    }
}