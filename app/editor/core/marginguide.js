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

goog.provide('thin.core.MarginGuide');

goog.require('thin.core.Line');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @constructor
 * @extends {thin.core.Line}
 */
thin.core.MarginGuide = function(element, layout) {
  thin.core.Line.call(this, element, layout, new goog.graphics.Stroke('0.5px', '#BBBBBB'));
  this.calculateDirection(this.y1_, this.y2_);
};
goog.inherits(thin.core.MarginGuide, thin.core.Line);