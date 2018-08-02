/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'icomoon\'">' + entity + '</span>' + html;
	}
	var icons = {
		'kimicon-chevron-left': '&#xe900;',
		'kimicon-chevron-right': '&#xe901;',
		'kimicon-chevron-thin-left': '&#xe902;',
		'kimicon-chevron-thin-right': '&#xe903;',
		'kimicon-chevron-with-circle-left': '&#xe904;',
		'kimicon-chevron-with-circle-right': '&#xe905;',
		'kimicon-check': '&#xe906;',
		'kimicon-circle-with-cross': '&#xe907;',
		'kimicon-check-circle': '&#xe908;',
		'kimicon-chevron-left2': '&#xe909;',
		'kimicon-chevron-right2': '&#xe90a;',
		'kimicon-skip-back': '&#xe90b;',
		'kimicon-skip-forward': '&#xe90c;',
		'kimicon-x-circle': '&#xe90d;',
		'kimicon-x-square': '&#xe90e;',
		'kimicon-x': '&#xe90f;',
		'kimicon-check2': '&#xf03a;',
		'kimicon-chevron-left3': '&#xf0a4;',
		'kimicon-chevron-right3': '&#xf078;',
		'kimicon-x2': '&#xf081;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/kimicon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
