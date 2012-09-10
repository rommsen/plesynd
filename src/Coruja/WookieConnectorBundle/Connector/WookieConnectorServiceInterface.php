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

/** Description: Interface for WookieConnectorService 
 * @package org.wookie.php
 */

interface WookieConnectorServiceInterface {
	
	/** Get all available widgets 
	 * @return array[Widget]|false array of widgets, otherwise false
	 */
	
	public function getAvailableWidgets();
	
	/** Set Logger path
	 * @param String path for writeable folder, example: /var/log/myWriteableFolder/
	 */
	
	public function setLogPath($path);
	
	/** Get current connection 
	 * @return WookieServerConnection instance of WookieServerConnection
	 */
	
	public function getConnection();

	/** Set new user
	 * @param String username for Wookie connection
	 * @param String screenName for Wookie connection
	 */
	
	public function setUser($loginName, $screenName = null);
	
	/** Get current user
	 * @return User instance of User
	 */
	
	public function getUser();
	
	/** Get or create new widget instance
	 * @param Widget|String new Widget or String guid of widget
	 * @return WidgetInstance|false WidgetInstace if successuful, otherwise false
	 */
	
	public function getOrCreateInstance($Widget_or_GUID);
	
	/** Add new participant
	 * @param WidgetInstance instance of WidgetInstance
	 * @param User instance of User
	 * @return boolean true if successful, otherwise false
	 */
	
	public function addParticipant($widgetInstance, $User);
	
	/** Delete participant
	 * @param WidgetInstance instance of WidgetInstance
	 * @param User instance of User
	 * @return boolean true if successful, otherwise false
	 */
	
	public function deleteParticipant($widgetInstance, $User);
	
	/** Get all participants of current widget
	 *  @param WidgetInstance instance of WidgetInstance
	 *  @return array[User] array of User instances
	 */
	
	public function getUsers($widgetInstance);
	
	/** Set new property 
	 * @param WidgetInstance instance of WidgetInstance
	 * @param Property instance of Property
	 * @return Property|false Property if successful, otherwise false
	 */
	
	public function setProperty($widgetInstance, $propertyInstance);
	
	/** Get property
	 * @param WidgetInstance instance of WidgetInstance
	 * @param Property instance of Property
	 * @return Property|false Property if successful, otherwise false
	 */
	
	public function getProperty($widgetInstance, $propertyInstance);
	
	/** Delete property
	 * @param WidgetInstance instance of WidgetInstance
	 * @param Property instance of Property
	 * @return boolean true if successful, otherwise false
	 */
	
	public function deleteProperty($widgetInstance, $propertyInstance );
	
	/**
	 * Set locale
	 * @param String locale
	 */
	
	public function setLocale($locale);
	
	/** Get current locale setting
	 * @return String current locale
	 */
	
	public function getLocale();
}
?>