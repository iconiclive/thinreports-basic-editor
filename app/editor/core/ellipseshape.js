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

goog.provide('thin.core.EllipseShape');

goog.require('goog.math.Rect');
goog.require('goog.math.Coordinate');
goog.require('thin.core.Ellipse');
goog.require('thin.core.ModuleShape');


/**
 * @param {Element} element
 * @param {thin.core.Layout} layout
 * @param {goog.graphics.Stroke?} stroke
 * @param {goog.graphics.Fill?} fill
 * @constructor
 * @extends {thin.core.Ellipse}
 */
thin.core.EllipseShape = function(element, layout, stroke, fill) {
  thin.core.Ellipse.call(this, element, layout, stroke, fill);
  this.setCss(thin.core.EllipseShape.CLASSID);
};
goog.inherits(thin.core.EllipseShape, thin.core.Ellipse);
goog.mixin(thin.core.EllipseShape.prototype, thin.core.ModuleShape.prototype);


/**
 * @type {string}
 */
thin.core.EllipseShape.CLASSID = 's-ellipse';


/**
 * @type {goog.graphics.SolidFill}
 */
thin.core.EllipseShape.DEFAULT_FILL = new goog.graphics.SolidFill('#FFFFFF');


/**
 * @type {goog.graphics.Stroke}
 */
thin.core.EllipseShape.DEFAULT_STROKE = new goog.graphics.Stroke(1, '#000000');


/**
 * @return {string}
 */
thin.core.EllipseShape.prototype.getClassId = function() {
  return thin.core.EllipseShape.CLASSID;
};


thin.core.EllipseShape.prototype.setDefaultOutline = function() {
  this.setTargetOutline(this.getLayout().getHelpers().getEllipseOutline());
};


/**
 * @param {thin.core.Helpers} helpers
 * @param {thin.core.MultiOutlineHelper} multiOutlineHelper
 */
thin.core.EllipseShape.prototype.toOutline = function(helpers, multiOutlineHelper) {
  multiOutlineHelper.toEllipseOutline(this, helpers);
};


/**
 * @return {Function}
 */
thin.core.EllipseShape.prototype.getCloneCreator = function() {

  var sourceCoordinate = new goog.math.Coordinate(this.getLeft(), this.getTop());
  var deltaCoordinateForList = this.getDeltaCoordinateForList().clone();
  var deltaCoordinateForGuide = this.getDeltaCoordinateForGuide().clone();
  var width = this.getWidth();
  var height = this.getHeight();
  var strokeDashType = this.getStrokeDashType();
  var stroke = this.getStroke();
  var strokeWidth = this.getStrokeWidth();
  var fill = this.getFill();
  var display = this.getDisplay();
  var isAffiliationListShape = this.isAffiliationListShape();

  /**
   * @param {thin.core.Layout} layout
   * @param {boolean=} opt_isAdaptDeltaForList
   * @param {goog.graphics.SvgGroupElement=} opt_renderTo
   * @param {goog.math.Coordinate=} opt_basisCoordinate
   * @return {thin.core.EllipseShape}
   */
  return function(layout, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate) {

    var shape = layout.createEllipseShape();
    layout.appendChild(shape, opt_renderTo);
    var pasteCoordinate = layout.calculatePasteCoordinate(
                            isAffiliationListShape, deltaCoordinateForList, deltaCoordinateForGuide,
                            sourceCoordinate, opt_isAdaptDeltaForList, opt_renderTo, opt_basisCoordinate);
    shape.setBounds(new goog.math.Rect(pasteCoordinate.x, pasteCoordinate.y, width, height).clone());

    shape.setStrokeDashFromType(strokeDashType);
    shape.setStroke(stroke);
    shape.setStrokeWidth(strokeWidth);
    shape.setFill(fill);
    shape.setDisplay(display);
    return shape;
  };
};


/**
 * @private
 */
thin.core.EllipseShape.prototype.createPropertyComponent_ = function() {
  var scope = this;
  var propEventType = thin.ui.PropertyPane.Property.EventType;
  var proppane = thin.ui.getComponent('proppane');

  var baseGroup = proppane.addGroup(thin.t('property_group_basis'));


  var leftInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_left_position'));
  var leftInput = leftInputProperty.getValueControl();
  leftInput.getNumberValidator().setAllowDecimal(true, 1);

  leftInputProperty.addEventListener(propEventType.CHANGE,
      this.setLeftForPropertyUpdate, false, this);

  proppane.addProperty(leftInputProperty, baseGroup, 'left');


  var topInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_top_position'));
  var topInput = topInputProperty.getValueControl();
  topInput.getNumberValidator().setAllowDecimal(true, 1);

  topInputProperty.addEventListener(propEventType.CHANGE,
      this.setTopForPropertyUpdate, false, this);

  proppane.addProperty(topInputProperty, baseGroup, 'top');


  var widthInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_width'));
  var widthInput = widthInputProperty.getValueControl();
  widthInput.getNumberValidator().setAllowDecimal(true, 1);

  widthInputProperty.addEventListener(propEventType.CHANGE,
      this.setWidthForPropertyUpdate, false, this);

  proppane.addProperty(widthInputProperty, baseGroup, 'width');


  var heightInputProperty = new thin.ui.PropertyPane.NumberInputProperty(thin.t('field_height'));
  var heightInput = heightInputProperty.getValueControl();
  heightInput.getNumberValidator().setAllowDecimal(true, 1);

  heightInputProperty.addEventListener(propEventType.CHANGE,
      this.setHeightForPropertyUpdate, false, this);

  proppane.addProperty(heightInputProperty, baseGroup, 'height');


  var displayCheckProperty = new thin.ui.PropertyPane.CheckboxProperty(thin.t('field_display'));
  displayCheckProperty.addEventListener(propEventType.CHANGE,
      this.setDisplayForPropertyUpdate, false, this);

  proppane.addProperty(displayCheckProperty, baseGroup, 'display');


  var shapeGroup = proppane.addGroup(thin.t('property_group_shape'));


  var fillInputProperty = new thin.ui.PropertyPane.ColorProperty(thin.t('field_fill_color'));
  fillInputProperty.getValueControl().getInput().setLabel('none');
  fillInputProperty.addEventListener(propEventType.CHANGE,
      this.setFillForPropertyUpdate, false, this);

  proppane.addProperty(fillInputProperty , shapeGroup, 'fill');


  var strokeInputProperty = new thin.ui.PropertyPane.ColorProperty(thin.t('field_stroke_color'));
  strokeInputProperty.getValueControl().getInput().setLabel('none');
  strokeInputProperty.addEventListener(propEventType.CHANGE,
      this.setStrokeForPropertyUpdate, false, this);

  proppane.addProperty(strokeInputProperty , shapeGroup, 'stroke');


  var strokeWidthCombProperty = new thin.ui.PropertyPane.ComboBoxProperty(thin.t('field_stroke_width'));
  var strokeWidthComb = strokeWidthCombProperty.getValueControl();
  var strokeWidthInput = strokeWidthComb.getInput();
  strokeWidthInput.setLabel('none');
  var strokeWidthInputValidation = new thin.ui.Input.NumberValidator(this);
  strokeWidthInputValidation.setAllowBlank(true);
  strokeWidthInputValidation.setAllowDecimal(true, 1);
  strokeWidthInput.setValidator(strokeWidthInputValidation);

  var strokeWidthList = ['1', '2', '3', '4', '8', '12', '16', '24'];
  var strokeWidthItem;
  goog.array.forEach(strokeWidthList, function(strokeWidthValue) {
    strokeWidthItem = new thin.ui.ComboBoxItem(strokeWidthValue);
    strokeWidthItem.setSticky(true);
    strokeWidthComb.addItem(strokeWidthItem);
  });
  strokeWidthCombProperty.addEventListener(propEventType.CHANGE,
      this.setStrokeWidthForPropertyUpdate, false, this);

  proppane.addProperty(strokeWidthCombProperty , shapeGroup, 'stroke-width');

  var strokeType = thin.core.ModuleElement.StrokeType;
  var strokeDashSelectProperty = new thin.ui.PropertyPane.SelectProperty(thin.t('field_stroke_type'));
  var strokeDashSelect = strokeDashSelectProperty.getValueControl();

  strokeDashSelect.setTextAlignLeft();

  strokeDashSelect.addItem(
      new thin.ui.Option(thin.core.ModuleElement.getStrokeName(strokeType.SOLID), strokeType.SOLID));
  strokeDashSelect.addItem(
      new thin.ui.Option(thin.core.ModuleElement.getStrokeName(strokeType.DASHED), strokeType.DASHED));
  strokeDashSelect.addItem(
      new thin.ui.Option(thin.core.ModuleElement.getStrokeName(strokeType.DOTTED), strokeType.DOTTED));

  strokeDashSelectProperty.addEventListener(propEventType.CHANGE,
      this.setStrokeDashTypeForPropertyUpdate, false, this);

  proppane.addProperty(strokeDashSelectProperty , shapeGroup, 'stroke-dash-type');


  var cooperationGroup = proppane.addGroup(thin.t('property_group_association'));

  var idInputProperty = new thin.ui.PropertyPane.IdInputProperty(this, 'ID');
  idInputProperty.addEventListener(propEventType.CHANGE,
      this.setShapeIdForPropertyUpdate, false, this);

  proppane.addProperty(idInputProperty, cooperationGroup, 'shape-id');

  var descProperty = new thin.ui.PropertyPane.InputProperty(thin.t('field_description'));
  descProperty.addEventListener(propEventType.CHANGE,
      this.setDescPropertyUpdate, false, this);

  proppane.addProperty(descProperty, cooperationGroup, 'desc');
};


/**
 * @return {Object}
 */
thin.core.EllipseShape.prototype.getProperties = function() {

  return {
    'left': this.getLeft(),
    'top': this.getTop(),
    'width': this.getWidth(),
    'height': this.getHeight(),
    'display': this.getDisplay(),
    'fill': this.getFill().getColor(),
    'stroke': this.getStroke().getColor(),
    'stroke-width': this.getStrokeWidth(),
    'stroke-dash-type': this.getStrokeDashType(),
    'shape-id': this.getShapeId(),
    'desc': this.getDesc()
  };
};


thin.core.EllipseShape.prototype.updateProperties = function() {
  var proppane = thin.ui.getComponent('proppane');
  if (!proppane.isTarget(this)) {
    this.getLayout().updatePropertiesForEmpty();
    proppane.setTarget(this);
    this.createPropertyComponent_();
  }

  var properties = this.getProperties();
  var proppaneBlank = thin.core.ModuleShape.PROPPANE_SHOW_BLANK;
  var noneColor = thin.core.ModuleShape.NONE;

  proppane.getPropertyControl('left').setValue(properties['left']);
  proppane.getPropertyControl('top').setValue(properties['top']);
  proppane.getPropertyControl('width').setValue(properties['width']);
  proppane.getPropertyControl('height').setValue(properties['height']);
  proppane.getPropertyControl('display').setChecked(properties['display']);
  var fill = properties['fill'];
  if (thin.isExactlyEqual(fill, noneColor)) {
    fill = proppaneBlank
  }
  proppane.getPropertyControl('fill').setValue(fill);
  var stroke = properties['stroke'];
  if (thin.isExactlyEqual(stroke, noneColor)) {
    stroke = proppaneBlank
  }
  proppane.getPropertyControl('stroke').setValue(stroke);
  var strokeWidth = properties['stroke-width'];
  if (thin.isExactlyEqual(strokeWidth, thin.core.ModuleElement.DEFAULT_STROKEWIDTH_OF_PROPPANE)) {
    strokeWidth = proppaneBlank;
  }
  proppane.getPropertyControl('stroke-width').setInternalValue(strokeWidth);

  proppane.getPropertyControl('stroke-dash-type').setValue(properties['stroke-dash-type']);
  proppane.getPropertyControl('shape-id').setValue(properties['shape-id']);
  proppane.getPropertyControl('desc').setValue(properties['desc']);
};


/**
 * @param {Object} properties
 */
thin.core.EllipseShape.prototype.setInitShapeProperties = function(properties) {
  var radius = properties.RADIUS;
  var center = properties.CENTER;
  this.setRadius(radius.x, radius.y);
  this.setCenter(center.x, center.y);
  this.setBounds(properties.BOUNDS);
};


/** @inheritDoc */
thin.core.EllipseShape.prototype.disposeInternal = function() {
  thin.core.EllipseShape.superClass_.disposeInternal.call(this);
  this.disposeInternalForShape();
};


/**
 * @return {Object}
 */
thin.core.EllipseShape.prototype.asJSON = function() {
  var object = this.asJSON_();

  goog.object.extend(object, {
    'cx': this.cx_,
    'cy': this.cy_,
    'rx': this.rx_,
    'ry': this.ry_
  });

  goog.object.remove(object, 'x');
  goog.object.remove(object, 'y');
  goog.object.remove(object, 'width');
  goog.object.remove(object, 'height');

  return object;
};


/**
 * @param {Object} attrs
 */
thin.core.EllipseShape.prototype.update = function(attrs) {
  goog.object.forEach(attrs, function(value, attr) {
    switch (attr) {
      case 'rx':
        this.setRx(value);
        this.resetLeft();
        this.resetWidth();

        break;
      case 'ry':
        this.setRy(value);
        this.resetTop();
        this.resetHeight();

        break;
      case 'cx':
        this.setCx(value);
        this.resetLeft();

        break;
      case 'cy':
        this.setCy(value);
        this.resetTop();

        break;
      default:
        break;
      }
  }, this);

  this.update_(attrs);
};
