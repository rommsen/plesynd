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
 * A connection to a Wookie server. This maintains the necessary data for
 * connecting to the server and provides utility methods for making common calls
 * via the Wookie REST API.
 * @package org.wookie.php
 */


class WookieServerConnection {
	private $url;
	private $apiKey = "TEST";
	private $sharedDataKey = "mysharedkey";

	/**
	 * Create a connection to a Wookie server at a given URL.
	 * @param String the URL of the wookie server
	 * @param String the API key for the server
	 * @param String the sharedDataKey for the server connection
	 */
	function __construct($url, $apiKey, $sharedDataKey) {
		$this->setURL($url);
		$this->setApiKey($apiKey);
		$this->setSharedDataKey($sharedDataKey);
	}

	/**
	 * Get the URL of the wookie server.
	 *
	 * @return String current Wookie connection URL
	 */
	public function getURL() {
		return $this->url;
	}

	/**
	 * Set the URL of the wookie server.
	 *
	 * @param String new Wookie server URL
	 */
	
	public function setURL($newUrl) {
		//parse url, if host == localhost, replace it with 127.0.0.1
		// Bug causes Apache crash, while using file_get_contents function
		// with 'localhost'
		$urlParts = @parse_url($newUrl);
		if($urlParts['host'] == 'localhost') {
			$newUrl = str_replace('localhost', '127.0.0.1', $newUrl);
		}
		$this->url = strrchr($newUrl, '/') != '/'?$newUrl.'/':$newUrl;
	}

	/**
	 * Get the API key for this server.
	 *
	 * @return String current Wookie connection API key
	 * @throws WookieConnectorException
	 */
	
	public function getApiKey() {
		if(empty($this->apiKey)) {
			throw new Exception\WookieConnectorException("API key not set");
		}
		return $this->apiKey;
	}

	/**
	 * Set the API key for this server.
	 *
	 *@param String new API key for connection
	 */

	public function setApiKey($newApiKey) {
		$this->apiKey = (string) $newApiKey;
	}

	/**
	 * Get the shared data key for this server.
	 *
	 * @return String current Wookie connection shareddatakey
	 * @throws WookieConnectorException
	 */

	public function getSharedDataKey() {
		if(empty($this->sharedDataKey)) {
			throw new Exception\WookieConnectorException("No shareddatakey set");
		}
		return $this->sharedDataKey;
	}

	/**
	 * Set the shared data key for this server.
	 * @param String new shareddatakey for connection
	 */
	public function setSharedDataKey($newKey) {
		$this->sharedDataKey = $newKey;
	}
	
	/** Output connection information as string
	 * @return String current connection information (url, apikey, shareddatakey)
	 */

	public function toString() {
		$str = "Wookie Server Connection - ";
		$str .= "URL: ".$this->getURL();
		$str .= "API Key: ".$this->getApiKey();
		$str .= "Shared Data Key: ".$this->getSharedDataKey();
		return $str;
	}

	/** Test Wookie server connection
	 *  @return boolean true if success, otherwise false
	 */

	public function Test() {
		$ctx = @stream_context_create(array('http' => array('timeout' => 15)));
		$url = $this->getURL();
		if(!empty($url)) {
		  $response = new HttpResponse(@file_get_contents($url.'advertise?all=true', false, $ctx), $http_response_header);
		  if($response->getStatusCode() == 200) {
			  $xmlDoc = @simplexml_load_string($response->getResponseText());
			  if(is_object($xmlDoc) && $xmlDoc->getName() == 'widgets') {
				  return true;
			  }
		  }
		}
		return false;
	}
}


?>
