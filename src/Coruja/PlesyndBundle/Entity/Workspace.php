<?php
namespace Coruja\PlesyndBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

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
     * @ORM\Column(type="string", length=100)
     */
    protected $slug;

    /**
     * @ORM\OneToMany(targetEntity="Widget", mappedBy="workspace")
     **/
    private $widgets;


    public function __construct() {
        $this->widgets = new \Doctrine\Common\Collections\ArrayCollection();
    }

    public function getId() {
        return $this->id;
    }

    public function setTitle($title) {
        $this->slug = strtolower(str_replace(' ', '_', $title));
        $this->title = $title;
    }

    public function getTitle() {
        return $this->title;
    }

    public function addWidget(Widget $widget)
    {
        $this->widgets->add($widget);
    }

    public function getWidgets()
    {
        return $this->widgets;
    }

    public function getSlug()
    {
        return $this->slug;
    }
}