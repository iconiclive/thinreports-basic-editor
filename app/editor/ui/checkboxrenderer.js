//  Copyright (C) 2011 Matsukei Co.,Ltd.
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <http://www.gnu.org/licenses/>.

goog.provide('thin.ui.CheckboxRenderer');

goog.require('thin.ui');
goog.require('goog.ui.CheckboxRenderer');


/**
 * @constructor
 * @extends {goog.ui.CheckboxRenderer}
 */
thin.ui.CheckboxRenderer = function() {
  goog.base(this);
};
goog.inherits(thin.ui.CheckboxRenderer, goog.ui.CheckboxRenderer);
goog.addSingletonGetter(thin.ui.CheckboxRenderer);


/**
 * @type {string}
 */
thin.ui.CheckboxRenderer.CSS_CLASS = thin.ui.getCssName('thin-checkbox');


/** @inheritDoc */
thin.ui.CheckboxRenderer.prototype.createDom = function(ctrl) {
  var cssClass = this.getCssClass();
  var dom = ctrl.getDomHelper();
  return dom.createDom('div', this.getClassNames(ctrl).join(' '),
      dom.createDom('span', thin.ui.getCssName(cssClass, 'box')),
      dom.createDom('span', thin.ui.getCssName(cssClass, 'label'),
          ctrl.getLabel()));
};


/** @inheritDoc */
thin.ui.CheckboxRenderer.prototype.getCssClass = function() {
  return thin.ui.CheckboxRenderer.CSS_CLASS;
};


/** @inheritDoc */
thin.ui.CheckboxRenderer.prototype.getContentElement = function(element) {
  return element;
};


/**
 * @param {Element} element
 * @param {number|string} width
 */
thin.ui.CheckboxRenderer.prototype.setWidth = function(element, width) {
  goog.style.setStyle(element, 'width',
      goog.isNumber(width) ? width + 'px' : width);
};


/**
 * @param {Element} element
 * @param {string} label
 */
thin.ui.CheckboxRenderer.prototype.setLabel = function(element, label) {
  goog.dom.setTextContent(/** @type {Element} */ (element.lastChild), label);
};
