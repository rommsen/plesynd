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
 * An instance of a widget for use on the client.
 * @package org.wookie.php
 */
 
class WidgetInstance {
  private $url;
  private $guid;
  private $title;
  private $height;
  private $width;
  
  /** Init new WidgetInstance
   * @param String url of widget
   * @param String guid of widget
   * @param String title of widget
   * @param String height of widget
   * @param String width of widget
   * @deprecated Maximize value is deprecated and should not be used. It's going to be removed in future.
   */

  function __construct($url, $guid, $title, $height, $width) {
    $this->setIdentifier($guid);
    $this->setUrl($url);
    $this->setTitle($title);
    $this->setHeight($height);
    $this->setWidth($width);
  }
  
  /** Get Widget instance url
   * @return String widget instance url
   */
  
  public function getUrl() {
    return $this->url;
  }

  /** Set widget instance url
   * 
   * @param String new url for instance
   */
  
  private function setUrl($url) {
    $this->url = $url;
  }

  /** Get widget guid value
   * @return String guid of widget
   */
  
  public function getIdentifier() {
    return $this->guid;
  }

  /** Set widget guid value
   * 
   * @param String guid value
   */
  
  private function setIdentifier($guid) {
    $this->guid = $guid;
  }

  /** Get widget title
   * @return String widget title
   */
  
  public function getTitle() {
    return $this->title;
  }

  /** Set widget title
   * 
   * @param String new widget title
   */
  
  public function setTitle($title) {
    $this->title = $title;
  }

  /** Get widget height
   * @return Integer widget height
   */
  
  public function getHeight() {
    return (int) $this->height;
  }

  /** Set widget height
   * @param Integer new widget height
   */
  
  public function setHeight($height) {
    $this->height = (int) $height;
  }
  
  /** Get wiget width
   * @return Integer widget width
   */

  public function getWidth() {
    return (int) $this->width;
  }
  
  /** Set widget width
   * 
   * @param Integer new widget width
   */

  public function setWidth($width) {
    $this->width = (int) $width;
  }
}

?>
