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
 * A user represents a possible user of a widget. This class provides a standard way
 * of representing users in plugins for host environments.
 * @package org.wookie.php
 */ 

class User {
  private $loginName = "UNKNOWN";
  private $screenName = "UNKNOWN";
  private $thumbnailURL = "";
  
  /**
   * Create a new user.
   * 
   * @param String user login name
   * @param String user display name
   */
  function __construct($loginName, $screenName, $thumbnail_url = null) {
    $this->setLoginName($loginName);
    $this->setScreenName($screenName);
    $this->setThumbnailURL($thumbnail_url);
  }

  /**
   * Get the login name for this user.
   * @return String user login name
   */
  public function getLoginName() {
    return $this->loginName;
  }

  /**
   * Get the screen name for this user. This is the name that is intended to be displayed on
   * screen. In many cases it will be the same as the login name.
   * @return String user display name
   */
  public function getScreenName() {
    return $this->screenName;
  }

  /**
   * Set the login name for this user. This is the value that is used by the user to register on the
   * system, it is guaranteed to be unique.
   * 
   * @param String new login name
   */
  public function setLoginName($loginName) {
    $this->loginName = (string) trim($loginName);
  }

  /**
   * Set the screen name for this user. this is the value that should be displayed on screen.
   * In many cases it will be the same as the login name.
   * 
   * @param String new screen name
   */
  public function setScreenName($screenName) {
    $this->screenName = (string) trim($screenName);
  }
  
  /**
   * Get the URL for a thumbnail representing this user.
   * @return String user thumbnail icon url
   */
  public function getThumbnailUrl() {
    return $this->thumbnailURL;
  }  

  /**
   * Set the URL for a thumbnail representing this user.
   * @param String new thumbnail url
   */
  public function setThumbnailUrl($thumbnail_url) {
    $this->thumbnailURL = $thumbnail_url;
  }    
}

?>