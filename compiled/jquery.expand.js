(function() {
  var $, KEY_SYNTAX, expandTemplateInPlace, isNoop;
  var __hasProp = Object.prototype.hasOwnProperty;
  $ = jQuery;
  $.fn.expand = function(directive) {
    var $this, element, node;
    element = this[0].nodeName === "SCRIPT" ? ($this = $(this), node = $this.data("expand-node"), !node ? (node = $(this.html()), $this.data("expand-node", node)) : void 0, $(node[0].cloneNode(true))) : $(this[0].cloneNode(true)).removeAttr("id");
    expandTemplateInPlace(element, directive);
    return element;
  };
  isNoop = function(directive) {
    return directive === null || directive === void 0 || directive === true;
  };
  expandTemplateInPlace = function(element, directive) {
    var childTemplate, fragment, jq, matchDirective, node, property, propertyName, result, rule, _i, _j, _len, _len2, _ref;
    if (isNoop(directive)) {
      return element[0];
    }
    if (directive === false) {
      element.remove();
    } else if (((_ref = typeof directive) === "number" || _ref === "string") || directive instanceof jQuery) {
      element.html(directive);
    } else if ($.isFunction(directive)) {
      return expandTemplateInPlace(element, directive.call(element, element));
    } else if (directive.constructor === Array) {
      childTemplate = element.children()[0];
      fragment = document.createDocumentFragment();
      jq = $([1]);
      if (childTemplate) {
        for (_i = 0, _len = directive.length; _i < _len; _i++) {
          matchDirective = directive[_i];
          node = childTemplate.cloneNode(true);
          fragment.appendChild(node);
          jq[0] = node;
          expandTemplateInPlace(jq, matchDirective);
        }
      }
      element.html(fragment);
    } else if (typeof directive === 'object') {
      jq = $([1]);
      for (propertyName in directive) {
        if (!__hasProp.call(directive, propertyName)) continue;
        property = directive[propertyName];
        for (_j = 0, _len2 = KEY_SYNTAX.length; _j < _len2; _j++) {
          rule = KEY_SYNTAX[_j];
          result = rule.call(element, propertyName, property, jq);
          if (result !== false) {
            break;
          }
        }
      }
    }
    return element[0];
  };
  KEY_SYNTAX = [
    function(propertyName, analog) {
      var match;
      match = /^@([\w-]+)$/.exec(propertyName);
      if (!match) {
        return false;
      }
      this.attr(match[1], analog);
      return null;
    }, function(propertyName, analog) {
      var match;
      match = /^:([\w-]+)$/.exec(propertyName);
      if (!match) {
        return false;
      }
      this.prop(match[1], analog);
      return null;
    }, function(propertyName, analog) {
      var match;
      match = /^(\w+)\(\)$/.exec(propertyName);
      if (!match) {
        return false;
      }
      this[match[1]].call(this, analog);
      return null;
    }, function(propertyName, analog) {
      if (propertyName === ".") {
        expandTemplateInPlace(this, analog);
        return null;
      } else {
        return false;
      }
    }, function(propertyName, analog, jq) {
      var directive, match, matches, _i, _len;
      if (isNoop(analog)) {
        return null;
      }
      directive = propertyName.charAt(0) === "$" ? propertyName.slice(1) : "." + propertyName;
      matches = this.find(directive);
      for (_i = 0, _len = matches.length; _i < _len; _i++) {
        match = matches[_i];
        jq[0] = match;
        expandTemplateInPlace(jq, analog);
      }
      return null;
    }
  ];
  $.expand = {
    compose: function() {
      var directives;
      directives = arguments;
      return function(element) {
        var directive, _i, _len;
        for (_i = 0, _len = directives.length; _i < _len; _i++) {
          directive = directives[_i];
          expandTemplateInPlace(element, directive);
          if (directive === false) {
            break;
          }
        }
        return null;
      };
    }
  };
  $.fn.expandInPlace = function(directive) {
    var element, _i, _len;
    for (_i = 0, _len = this.length; _i < _len; _i++) {
      element = this[_i];
      expandTemplateInPlace($(element), directive);
    }
    return this;
  };
}).call(this);
