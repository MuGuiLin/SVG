(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('d3-collection'), require('d3-selection')) :
  typeof define === 'function' && define.amd ? define(['d3-collection', 'd3-selection'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.d3 = global.d3 || {}, global.d3.tip = factory(global.d3, global.d3)));
}(this, (function (d3Collection, d3Selection) { 'use strict';

  /**
   * d3.tip
   * Copyright (c) 2013-2017 Justin Palmer
   * rootElement fixes by Samih Munshi 2021
   *
   * Tooltips for d3.js SVG visualizations
   */
  // Public - constructs a new tooltip
  //
  // Returns a tip
  function index() {
    var direction   = d3TipDirection,
        offset      = d3TipOffset,
        html        = d3TipHTML,
        rootElement = document.body,
        node        = initNode(),
        svg         = null;

    function tip(vis) {
      svg = getSVGNode(vis);
      if (!svg) return
      svg.createSVGPoint();
      rootElement.appendChild(node);
    }

    // Public - show the tooltip on the screen
    //
    // Returns a tip
    tip.show = function() {
      var args = Array.prototype.slice.call(arguments);
      if (args[args.length - 1] instanceof SVGElement) args.pop();

      var content = html.apply(this, args),
          poffset = offset.apply(this, args),
          dir     = direction.apply(this, args),
          nodel   = getNodeEl(),
          i       = directions.length,
          coords,
          scrollTop  = document.documentElement.scrollTop ||
        rootElement.scrollTop,
          scrollLeft = document.documentElement.scrollLeft ||
        rootElement.scrollLeft;

      nodel.html(content)
        .style('opacity', 1).style('pointer-events', 'all');

      while (i--) nodel.classed(directions[i], false);
      coords = directionCallbacks.get(dir).apply(this);
      nodel.classed(dir, true)
        .style('top', (coords.top + poffset[0]) + scrollTop + 'px')
        .style('left', (coords.left + poffset[1]) + scrollLeft + 'px');

      return tip
    };

    // Public - hide the tooltip
    //
    // Returns a tip
    tip.hide = function() {
      var nodel = getNodeEl();
      nodel.style('opacity', 0).style('pointer-events', 'none');
      return tip
    };

    // Public: Proxy attr calls to the d3 tip container.
    // Sets or gets attribute value.
    //
    // n - name of the attribute
    // v - value of the attribute
    //
    // Returns tip or attribute value
    // eslint-disable-next-line no-unused-vars
    tip.attr = function(n, v) {
      if (arguments.length < 2 && typeof n === 'string') {
        return getNodeEl().attr(n)
      }

      var args =  Array.prototype.slice.call(arguments);
      d3Selection.selection.prototype.attr.apply(getNodeEl(), args);
      return tip
    };

    // Public: Proxy style calls to the d3 tip container.
    // Sets or gets a style value.
    //
    // n - name of the property
    // v - value of the property
    //
    // Returns tip or style property value
    // eslint-disable-next-line no-unused-vars
    tip.style = function(n, v) {
      if (arguments.length < 2 && typeof n === 'string') {
        return getNodeEl().style(n)
      }

      var args = Array.prototype.slice.call(arguments);
      d3Selection.selection.prototype.style.apply(getNodeEl(), args);
      return tip
    };

    // Public: Set or get the direction of the tooltip
    //
    // v - One of n(north), s(south), e(east), or w(west), nw(northwest),
    //     sw(southwest), ne(northeast) or se(southeast)
    //
    // Returns tip or direction
    tip.direction = function(v) {
      if (!arguments.length) return direction
      direction = v == null ? v : functor(v);

      return tip
    };

    // Public: Sets or gets the offset of the tip
    //
    // v - Array of [x, y] offset
    //
    // Returns offset or
    tip.offset = function(v) {
      if (!arguments.length) return offset
      offset = v == null ? v : functor(v);

      return tip
    };

    // Public: sets or gets the html value of the tooltip
    //
    // v - String value of the tip
    //
    // Returns html value or tip
    tip.html = function(v) {
      if (!arguments.length) return html
      html = v == null ? v : functor(v);

      return tip
    };

    // Public: sets or gets the root element anchor of the tooltip
    //
    // v - root element of the tooltip
    //
    // Returns root node of tip
    tip.rootElement = function(v) {
      if (!arguments.length) return rootElement
      rootElement = v ? v : document.body;

      return tip
    };

    // Public: destroys the tooltip and removes it from the DOM
    //
    // Returns a tip
    tip.destroy = function() {
      if (node) {
        getNodeEl().remove();
        node = null;
      }
      return tip
    };

    function d3TipDirection() { return 'n' }
    function d3TipOffset() { return [0, 0] }
    function d3TipHTML() { return ' ' }

    var directionCallbacks = d3Collection.map({
          n:  directionNorth,
          s:  directionSouth,
          e:  directionEast,
          w:  directionWest,
          nw: directionNorthWest,
          ne: directionNorthEast,
          sw: directionSouthWest,
          se: directionSouthEast
        }),
        directions = directionCallbacks.keys();

    function directionNorth() {
      const bcRect = this.getBoundingClientRect();
      return {
        top:  bcRect.y - node.offsetHeight,
        left: bcRect.x - getScrollLeft(this) + bcRect.width / 2 - node.offsetWidth / 2
      }
    }

    function directionSouth() {
      const bcRect = this.getBoundingClientRect();
      return {
        top:  bcRect.y + bcRect.height,
        left: bcRect.x - getScrollLeft(this) + bcRect.width / 2 - node.offsetWidth / 2
      }
    }

    function directionEast() {
      const bcRect = this.getBoundingClientRect();
      return {
        top:  bcRect.y + bcRect.height / 2 - node.offsetHeight / 2,
        left: bcRect.x - getScrollLeft(this) + bcRect.width
      }
    }

    function directionWest() {
      const bcRect = this.getBoundingClientRect();
      return {
        top:  bcRect.y + bcRect.height / 2 - node.offsetHeight / 2,
        left: bcRect.x - getScrollLeft(this) - node.offsetWidth
      }
    }

    function directionNorthWest() {
      const bcRect = this.getBoundingClientRect();
      return {
        top:  bcRect.y - node.offsetHeight,
        left: bcRect.x - getScrollLeft(this) - node.offsetWidth
      }
    }

    function directionNorthEast() {
      const bcRect = this.getBoundingClientRect();
      return {
        top:  bcRect.y - node.offsetHeight,
        left: bcRect.x - getScrollLeft(this) + bcRect.width
      }
    }

    function directionSouthWest() {
      const bcRect = this.getBoundingClientRect();
      return {
        top:  bcRect.y + bcRect.height,
        left: bcRect.x - getScrollLeft(this) - node.offsetWidth
      }
    }

    function directionSouthEast() {
      const bcRect = this.getBoundingClientRect();
      return {
        top:  bcRect.y + bcRect.height,
        left: bcRect.x - getScrollLeft(this) + bcRect.width
      }
    }

    function initNode() {
      var div = d3Selection.select(document.createElement('div'));
      div
        .style('position', 'fixed')
        .style('top', 0)
        .style('opacity', 0)
        .style('pointer-events', 'none')
        .style('box-sizing', 'border-box');

      return div.node()
    }

    function getSVGNode(element) {
      var svgNode = element.node();
      if (!svgNode) return null
      if (svgNode.tagName.toLowerCase() === 'svg') return svgNode
      return svgNode.ownerSVGElement
    }

    function getNodeEl() {
      if (node == null) {
        node = initNode();
        // re-add node to DOM
        rootElement.appendChild(node);
      }
      return d3Selection.select(node)
    }

    // Private: Walks the DOM from the target element up to document looking for elements with an x scroll value > 0.
    // Return the sum left value in px of all the scrolled elements.
    function getScrollLeft(targetShape) {
      let parent = targetShape.parentNode;
      let scrollLeft = 0;
      while (parent !== document) {
        scrollLeft += parent.scrollLeft;
        parent = parent.parentNode;
      }

      return scrollLeft;
    }

    // Private - replace D3JS 3.X d3.functor() function
    function functor(v) {
      return typeof v === 'function' ? v : function() {
        return v
      }
    }

    return tip
  }

  return index;

})));
