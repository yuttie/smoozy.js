//
// smoozy.js
//
// LICENSE: {{{
//   Copyright (c) 2009 snaka<snaka.gml@gmail.com>
//   Copyright (c) 2011 yuttie<yuta.taniguchi.y.t@gmail.com>
//
//     distributable under the terms of an MIT-style license.
//     http://opensource.org/licenses/mit-license.php
// }}}
//
// INFO: {{{
var INFO =
<plugin name="smoozy" version="0.11.1"
        href="https://github.com/yuttie/smoozy.js"
        summary="Smooth scrolling"
        xmlns={NS}>
  <author email="snaka.gml@gmail.com" homepage="http://vimperator.g.hatena.ne.jp/snaka72/">snaka</author>
  <author email="yuta.taniguchi.y.t@gmail.com" homepage="http://d.hatena.ne.jp/yuttie/">yuttie</author>
  <license href="http://opensource.org/licenses/mit-license.php">MIT style license</license>
  <item>
    <tags>g:smoozy_scroll_amount</tags>
    <spec>g:smoozy_scroll_amount</spec>
    <default>"100"</default>
    <description>
      <p>
        Scrolling amount in pixels.
      </p>
    </description>
  </item>
  <item>
    <tags>g:smoozy_scroll_interval</tags>
    <spec>g:smoozy_scroll_interval</spec>
    <default>"10"</default>
    <description>
      <p>
        Scrolling interval in milliseconds.
      </p>
    </description>
  </item>
  <item>
    <tags>g:smoozy_scroll_duration</tags>
    <spec>g:smoozy_scroll_duration</spec>
    <default>"300"</default>
    <description>
      <p>
        Scrolling duration in milliseconds.
      </p>
    </description>
  </item>
  <p>
    <example>
      Set scroll amount to 300 px and interval to 20 ms.
      <ex>let g:smoozy_scroll_amount="300"</ex>
      <ex>let g:smoozy_scroll_interval="20"</ex>
    </example>
  </p>
  <item>
    <tags>smoothScroll</tags>
    <spec>smoothScroll(<a>window</a>, <a>interval</a>, <a>amount</a>, <a>duration</a>)</spec>
    <description>
      <p>
        Smoothly scroll the specified window according to the specified
        animation setting. Specify the amount of scroll in pixels, interval and
        duration in milliseconds.
      </p>
    </description>
  </item>
  <item>
    <tags>userSmoothScrollCurrentWindow</tags>
    <spec>userSmoothScrollCurrentWindow(<a>count</a>)</spec>
    <description>
      <p>
        Smoothly scroll the current window count times according to the user
        configuration (or the default configuration) read from global
        variables described above.
      </p>
    </description>
  </item>
</plugin>;
// }}}

let self = liberator.plugins.smoozy = (function() {
  // Mappings  {{{
  mappings.addUserMap(
    [modes.NORMAL],
    ["j"],
    "Smooth scroll down",
    function(count) {
      count = count || 1
      self.userSmoothScrollCurrentWindow(+count);
    },
    {
      count: true,
      rhs: "smoozy: Smooth scroll down",
      noremap: true
    }
  );
  mappings.addUserMap(
    [modes.NORMAL],
    ["k"],
    "Smooth scroll up",
    function(count) {
      count = count || 1
      self.userSmoothScrollCurrentWindow(-count);
    },
    {
      count: true,
      rhs: "smoozy: Smooth scroll up",
      noremap: true
    }
  );
  // }}}

  // PUBLIC {{{
  var PUBLICS = {
    smoothScroll: function(win, interval, amount, duration) {
      smoothScrollImpl(win, interval, amount, duration, 0);
    },
    userSmoothScrollCurrentWindow: function(count) {
      const win = Buffer.findScrollableWindow();
      const interval = window.eval(liberator.globalVariables.smoozy_scroll_interval || '10');
      const amount = window.eval(liberator.globalVariables.smoozy_scroll_amount || '100');
      const duration = window.eval(liberator.globalVariables.smoozy_scroll_duration || '300');
      smoothScrollImpl(win, interval, count * amount, duration, 0);
    }
  };
  // }}}

  // PRIVATE {{{
  function truncate(x) {
    if (x > 0) {
      return Math.floor(x);
    }
    else {
      return Math.ceil(x);
    }
  }

  function smoothScrollImpl(win, interval, amount, duration, remainder) {
    if (duration > 0) {
      const a = interval * amount / duration + remainder;
      const p = truncate(a);
      const new_remainder = a - p;

      win.scrollBy(0, p);

      setTimeout(function() {
        smoothScrollImpl(win, interval, amount - p, duration - interval, new_remainder);
      }, interval);
    }
  }
  // }}}

  return PUBLICS;
})();
// vim: sw=2 ts=2 et si fdm=marker:
