//
// smoozy.js
//
// LICENSE: {{{
//   Copyright (c) 2009 snaka<snaka.gml@gmail.com>
//   Copyright (c) 2011 yuttie<yuta.taniguchi.y.t@gmail.com>
//
//     distributable under the terms of an MIT-style license.
//     http://www.opensource.jp/licenses/mit-license.html
// }}}
//
// PLUGIN INFO: {{{
var PLUGIN_INFO =
<VimperatorPlugin>
  <name>smoozy</name>
  <description>At j,k key scrolling to be smooth.</description>
  <description lang="ja">j,kキーでのスクロールをスムースに</description>
  <minVersion>2.3pre</minVersion>
  <maxVersion>3.2</maxVersion>
  <updateURL>https://github.com/yuttie/smoozy.js</updateURL>
  <author mail="snaka.gml@gmail.com" homepage="http://vimperator.g.hatena.ne.jp/snaka72/">snaka</author>
  <author mail="yuta.taniguchi.y.t@gmail.com" homepage="http://d.hatena.ne.jp/yuttie/">yuttie</author>
  <license>MIT style license</license>
  <version>0.11.1</version>
  <detail><![CDATA[
    == Subject ==
    j,k key scrolling to be smoothly.

    == Global variables ==
    You can configure following variable as you like.
    :smoozy_scroll_amount: Scrolling amount(unit: px). Default value is 100px.
    :smoozy_scroll_interval: Scrolling interval(unit: ms). Default value is 10ms.
    :smoozy_scroll_duration: Scrolling duration(unit: ms). Default value is 30ms.

    === Excample ===
    Set scroll amount is 300px and interval is 20ms.
    >||
    let g:smoozy_scroll_amount="300"
    let g:smoozy_scroll_interval="20"
    ||<

    == API ==
    >||
    smoozy.smoothScrollBy(amount);
    ||<
    Example.
    >||
    :js liberator.plugins.smoozy.smoothScrollBy(600)
    :js liberator.plugins.smoozy.smoothScrollBy(-600)
    ||<

    == ToDo ==

  ]]></detail>

  <detail lang="ja"><![CDATA[
    == 概要 ==
    普段のj,kキーのスクロールをLDRizeライクにスムースにします。

    == グローバル変数 ==
    以下の変数を.vimperatorrcなどで設定することで動作を調整することができます。
    :smoozy_scroll_amount:
      1回にスクロールする幅です（単位：ピクセル）。デフォルトは"100"です。
    :smoozy_scroll_interval:
      スクロール時のアニメーションのインターバルです（単位：ミリ秒）。
      "1"以上の値を設定します。デフォルトは"10"です。
    :smoozy_scroll_duration:
      スクロール時のアニメーションの継続時間です（単位：ミリ秒）。
      "1"以上の値を設定します。デフォルトは"300"です。
    === 設定例 ===
    スクロール量を300pxに、インターバルを20msに設定します。
    >||
    let g:smoozy_scroll_amount="300"
    let g:smoozy_scroll_interval="20"
    ||<

    == API ==
    他のキーにマップする場合やスクリプトから呼び出せるようAPIを用意してます。
    >||
    smoozy.smoothScrollBy(amount);
    ||<
    amountにはスクロール量(ピクセル)を指定してください。正の値で下方向へ負の値で上方向へスクロールします。

    Example.
    >||
    :js liberator.plugins.smoozy.smoothScrollBy(600)
    :js liberator.plugins.smoozy.smoothScrollBy(-600)
    ||<

    == ToDo ==
    - 読み込みの順番によっては他のプラグインと競合する可能性があるのをなんとかしたい。

  ]]></detail>
</VimperatorPlugin>;
// }}}

let self = liberator.plugins.smoozy = (function() {
  // Mappings  {{{
  mappings.addUserMap(
    [modes.NORMAL],
    ["j"],
    "Smooth scroll down",
    function(count) {
      count = count || 1
      const amount = window.eval(liberator.globalVariables.smoozy_scroll_amount || '100');
      self.smoothScrollBy(count * amount);
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
      const amount = window.eval(liberator.globalVariables.smoozy_scroll_amount || '100');
      self.smoothScrollBy(count * -amount);
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
    smoothScrollBy: function(amount) {
      const win = Buffer.findScrollableWindow();
      const interval = window.eval(liberator.globalVariables.smoozy_scroll_interval || '10');
      const duration = window.eval(liberator.globalVariables.smoozy_scroll_duration || '300');
      smoothScroll(win, interval, amount, duration, 0);
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

  function smoothScroll(win, interval, amount, duration, remainder) {
    if (duration > 0) {
      const a = interval * amount / duration + remainder;
      const p = truncate(a);
      const new_remainder = a - p;

      win.scrollBy(0, p);

      setTimeout(function() {
        smoothScroll(win, interval, amount - p, duration - interval, new_remainder);
      }, interval);
    }
  }
  // }}}

  return PUBLICS;
})();
// vim: sw=2 ts=2 et si fdm=marker:
