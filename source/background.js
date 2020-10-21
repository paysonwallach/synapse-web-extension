/*
 * Copyright (c) 2020 Payson Wallach
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

"use strict";

(function () {
  var browser = require("webextension-polyfill");

  var port;

  const Constants = {
    HOST_CONNECTOR: "com.paysonwallach.synapse.plugins.web.bridge",
  };

  const connectToHost = () => {
    port = browser.runtime.connectNative(Constants.HOST_CONNECTOR);

    port.postMessage(); // start host bridge
  };

  connectToHost();

  port.onDisconnect.addListener(() => {
    port = connectToHost();
  });

  port.onMessage.addListener((message) => {
    var tabsResults = browser.tabs.query({ url: message.body });
    var current_window = browser.windows.getCurrent();

    tabsResults.then(
      (results) => {
        if (results.length != 0) {
          browser.tabs.update(results[0].id, { active: true });

          browser.windows.update(results[0].windowId, { focused: true });
        } else {
          browser.tabs.create({
            active: true,
            url: message.body,
          });

          current_window.then((result) => {
            browser.windows.update(result.id, { focused: true });
          });
        }
      },
      (error) => {
        console.log(
          `error retrieving tab with url '${message.body}': ${error}`
        );
      }
    );
  });
})();
