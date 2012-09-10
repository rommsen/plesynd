<?php

namespace Coruja\WookieConnectorBundle\Connector;

interface WidgetInterface {

    /**
     * Get a unique identifier for this widget type.
     *
     * @return String widget identifier (guid)
     */
    public function getIdentifier();

    /**
     * Get the human readable title of this widget.
     * @return String widget title
     */
    public function getTitle();

    /**
     * Get the location of a logo for this widget.
     * @return String widget icon url
     */
    public function getIcon();

    /**
     * Get the description of the widget.
     *
     * @return String widget description
     */
    public function getDescription();
}