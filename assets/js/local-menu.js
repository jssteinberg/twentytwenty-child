/**
 * Local menu.js. (Should be called book menu).
 *
 * Turns local navigation in to a 'smart' book menu.
 */

(function() {
	var _menuWrapper;
	var _currentLink;
	var _hasEntryContentMenu = false;

	/*
	 * Return element reference for <nav id="local-navigation"> from DOM.
	 */
	function menuWrapper() {
		if (typeof _menuWrapper === 'undefined') {
			_menuWrapper = document.getElementById('local-navigation');
		}

		return _menuWrapper;
	}

	function currentLink() {
		if (typeof _currentLink === 'undefined') {
			// Find current page link
			_currentLink = menuWrapper().querySelector('[aria-current="page"]');
		}

		return _currentLink;
	}

	/*
	 * Only show menu under current parent.
	 *
	 * Run on DOM-load.
	 */
	function showCurrentSubmenu() {
		var notCurrentLis = menuWrapper().querySelectorAll('ul.local-menu > li:not(.current-menu-item):not(.current-menu-ancestor)');

		// Check if all menu items will be hidden
		if ( notCurrentLis.length === menuWrapper().querySelectorAll('ul.local-menu > li').length && !_hasEntryContentMenu ) {
			menuWrapper().parentNode.removeChild( document.getElementById('local-navigation') );
		} else {

			Array.prototype.forEach.call(notCurrentLis, function(el) {
				el.setAttribute('hidden', '');
			});

			/*
			 * Variant for hidding submenus of notCurrentLis (for when an
			 * expand-submenu function is implemented.)
			 */
			// Array.prototype.forEach.call(notCurrentLis, function(el) {
			// 	el = el.querySelectorAll('.sub-menu');
      //
			// 	Array.prototype.forEach.call(el, function(elSub) {
			// 		elSub.setAttribute('hidden', '');
			// 	});
			// });

			// After menu shows 'correct' content, show it:
			menuWrapper().removeAttribute('hidden');
		}
	}

	// Add prev/next link after main content
	function createNextPrevPageLink() {
		var allLinks = menuWrapper().querySelectorAll('a');
		var prevLink = false;
		var nextLink = false;

		Array.prototype.forEach.call(allLinks, function(el, index) {
			// Find current page link
			if (el.getAttribute('aria-current') !== 'undefined' && el.getAttribute('aria-current') === 'page') {

				// If there is a next link
				if (typeof allLinks[index + 1] !== 'undefined') {
					nextLink = document.getElementById('next-page-link');

					nextLink.setAttribute('href', allLinks[index + 1].getAttribute('href'));
					document.getElementById('next-page-text').textContent = allLinks[index + 1].textContent;

					// Show
					nextLink.removeAttribute('hidden');
				}

				// If there is a prev link
				if (typeof allLinks[index - 1] !== 'undefined') {
					prevLink = document.getElementById('prev-page-link');

					prevLink.setAttribute('href', allLinks[index - 1].getAttribute('href'));

					// Show
					prevLink.removeAttribute('hidden');
				}

				// When current page link is found, break loop
				return;
			}
		});

		// If prev or next link is set, append to after main content
		if (prevLink || nextLink) {
			document.getElementById('page-next-prev-navigation').removeAttribute('hidden');
		}
	}

	/*
	 * Create entry content menu.
	 */
	function createEntryContentMenu() {
		var a = document.createElement('a');
		var li = document.createElement('li');
		var menuContainer = document.createElement('div');
		var contentH2Element = document.querySelectorAll('#main .entry-content h2');
		var menuUlElement = document.createElement('ul')

		menuUlElement.setAttribute('id', 'entry-content-menu');

		// Add top of page link (but titled after entry content h1)
		a.setAttribute('href', '#');
		a.innerHTML = document.querySelector('h1.entry-title').innerHTML;
		li.appendChild(a);
		menuUlElement.appendChild(li);

		Array.prototype.forEach.call(contentH2Element, function(el, index) {
			li = document.createElement('li');
			a = document.createElement('a');

			el.setAttribute('id', 'entry-content-h2-' + index);
			a.setAttribute('href', '#entry-content-h2-' + index);
			a.innerHTML = el.innerHTML;

			li.appendChild(a);
			menuUlElement.appendChild(li);
			menuContainer.appendChild(menuUlElement);
		});

		if (contentH2Element.length) {
			menuWrapper().insertBefore(menuContainer, menuWrapper().firstChild);
			_hasEntryContentMenu = true;
		}
	}

	// Run on DOM-load
	if (menuWrapper() != null) {
		// If local menu should be on page
		createEntryContentMenu();
		createNextPrevPageLink();
		showCurrentSubmenu();
	}

})();
