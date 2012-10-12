<?php

namespace Coruja\WookieConnectorBundle\Connector;

/** @package org.wookie.php */

/*
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
/**
 * A client side representation of a widget. 
 * @package org.wookie.php
 */

class Widget implements WidgetInterface {
  private $identifier;
  private $title;
  private $description;
  private $icon;

  private $is_offline_compatible;

  /** Init new Widget
   * 
   * @param String widget identifier/guid
   * @param String widget title
   * @param String widget description
   * @param String widgeticon url
   */
  function __construct($identifier, $title, $description, $icon) {
    $this->identifier = $identifier;
    $this->title = $title;
    $this->description = $description;
    $this->icon = $icon;
  }
  
  /**
   * Get a unique identifier for this widget type.
   * 
   * @return String widget identifier (guid)
   */
  public function getIdentifier() {
    return $this->identifier;
  }

  /**
   * Get the human readable title of this widget.
   * @return String widget title
   */
  public function getTitle() {
    return $this->title;
  }

  /**
   * Get the location of a logo for this widget.
   * @return String widget icon url
   */
  public function getIcon() {
    return $this->icon;
  }
  
  /**
   * Get the description of the widget.
   * 
   * @return String widget description
   */
  public function getDescription() {
    return $this->description;
  }

    public function setOffline($bool) {
        $this->is_offline_compatible = $bool;
    }

}


?>