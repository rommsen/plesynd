<?php
namespace Coruja\PlesyndBundle\Entity;

use Coruja\WookieConnectorBundle\Connector\WidgetInterface;
use Coruja\WookieConnectorBundle\Connector\WidgetInstance;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity
 * @ORM\Table(name="Widget")
 */
class Widget implements WidgetInterface
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * Wookie Instance Identifier
     * Used to get always the same instance from Wookie
     * @ORM\Column(type="string", length=255)
     */
    protected $instance_identifier;

    /**
     * Wookie Identifier (URI)
     * @ORM\Column(type="string", length=255)
     */
    protected $identifier_uri;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $title;

    /**
     * @ORM\Column(type="string", length=255)
     */
    protected $icon;

    /**
     * @ORM\Column(type="text")
     */
    protected $description;

    /**
     * @var Workspace
     * @ORM\ManyToOne(targetEntity="Workspace", inversedBy="widgets")
     * @ORM\JoinColumn(name="workspace_id", referencedColumnName="id")
     */
    protected $workspace;

    /**
     * @ORM\Column(type="smallint")
     */
    protected $position;

    /**
     * @var \Coruja\WookieConnectorBundle\Connector\WidgetInstance
     */
    protected $instance;

    // TODO currently only used for json, maybe use serialize filter
    protected $workspace_id;


    public function __construct($identifier, $title, $description, $icon)
    {
        $this->instance_identifier = uniqid();
        $this->identifier_uri = $identifier;
        $this->title = $title;
        $this->description = $description;
        $this->icon = $icon;
    }

    public function getId()
    {
        return $this->id;
    }

    public function getInstanceIdentifier()
    {
        return $this->instance_identifier;
    }

    /**
     * Get a unique identifier for this widget type.
     *
     * @return String widget identifier (guid)
     */
    public function getIdentifier()
    {
        return $this->identifier_uri;
    }

    /**
     * Get the human readable title of this widget.
     * @return String widget title
     */
    public function getTitle()
    {
        return $this->title;
    }


    /**
     * Get the location of a logo for this widget.
     * @return String widget icon url
     */
    public function getIcon()
    {
        return $this->icon;
    }

    /**
     * Get the description of the widget.
     *
     * @return String widget description
     */
    public function getDescription()
    {
        return $this->description;
    }

    public function setPosition($position)
    {
        $this->position = $position;
    }

    public function setWorkspace(Workspace $workspace) {
        $this->workspace = $workspace;
        $this->workspace->addWidget($this);
    }

    /**
     * @return Workspace
     */
    public function getWorkspace() {
        return $this->workspace;
    }

    public function setInstance($instance)
    {
        $this->instance = $instance;
    }

    public function setWorkspaceId($workspace_id) {
        $this->workspace_id = $workspace_id;
    }


}