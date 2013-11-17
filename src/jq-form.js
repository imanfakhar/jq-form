/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Mickael Jeanroy
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

(function(factory) {
  'use strict';

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else {
    // Browser globals
    factory(jQuery);
  }

}(function($) {

  'use strict';

  var noop = function() {
  };

  var returnTrue = function() {
    return true;
  };

  /**
   * Plugin name stored in data cache.
   * @type {string}
   * @const
   */
  var PLUGIN_NAME = 'jqForm';

  /**
   * Name of field in form.
   * @type {string}
   * @const
   */
  var DATA_NAME = 'data-name';

  /**
   * Selector for submit button.
   * @type {string}
   * @const
   */
  var SUBMIT_BTNS = 'button[type="submit"], input[type="submit"]';

  /**
   * Css class added on dirty elements of form.
   * @type {string}
   * @const
   */
  var CSS_DIRTY = 'dirty';

  /**
   * Css class added on elements with errors.
   * @type {string}
   * @const
   */
  var CSS_ERROR = 'error';

  /**
   * Css class added on elements with a 'required error'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_REQUIRED = 'error-required';

  /**
   * Css class added on elements with a 'min-length error'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_MIN_LENGTH = 'error-min-length';

  /**
   * Css class added on elements with a 'max-length error'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_MAX_LENGTH = 'error-max-length';

  /**
   * Css class added on elements with a 'pattern error'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_PATTERN = 'error-pattern';

  /**
   * Css class added on elements with a 'same-as error'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_SAME_AS = 'error-same-as';

  /**
   * Css class added on elements with a 'min error'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_MIN = 'error-min';

  /**
   * Css class added on elements with a 'min error'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_MAX = 'error-max';

  /**
   * Css class added on email inputs with a 'non valid email'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_EMAIL_PATTERN = 'error-email-pattern';

  /**
   * Css class added on email inputs with a 'non valid email'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_URL_PATTERN = 'error-url-pattern';

  /**
   * Css class added on email inputs with a 'multiple emails'.
   * @type {string}
   * @const
   */
  var CSS_ERROR_EMAIL_MULTIPLE = 'error-email-multiple';

  /**
   * Css class added on date inputs with an invalid pattern.
   * @type {string}
   * @const
   */
  var CSS_ERROR_DATE_PATTERN = 'error-date-pattern';

  /**
   * Css class added on date inputs with an valid pattern but an invalid value.
   * @type {string}
   * @const
   */
  var CSS_ERROR_DATE_INVALID = 'error-date-invalid';

  /**
   * Css class added on time inputs with an invalid pattern.
   * @type {string}
   * @const
   */
  var CSS_ERROR_TIME_PATTERN = 'error-time-pattern';

  /**
   * Css class added on toime inputs with an valid pattern but an invalid value.
   * @type {string}
   * @const
   */
  var CSS_ERROR_TIME_INVALID = 'error-time-invalid';

  /**
   * Pattern used to validate emails.
   * @type {RegExp}
   * @const
   */
  var PATTERN_EMAIL = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  /**
   * Pattern used to validate url.
   * @type {RegExp}
   * @const
   */
  var PATTERN_URL = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/i;

  /**
   * Pattern used to validate year.
   * @type {string}
   * @const
   */
  var FULL_YEAR = '[0-9]{4}';

  /**
   * Pattern used to validate month and day.
   * @type {string}
   * @const
   */
  var MONTH_DAY = '[0-9]{2}';

  /**
   * Pattern used to validate full date.
   * @type {RegExp}
   * @const
   */
  var PATTERN_FULL_DATE = new RegExp('^' + FULL_YEAR + '-' + MONTH_DAY + '-' + MONTH_DAY + '$');

  /**
   * Pattern used to validate month value.
   * @type {RegExp}
   * @const
   */
  var PATTERN_FULL_MONTH = new RegExp('^' + FULL_YEAR + '-' + MONTH_DAY + '$');

  /**
   * Pattern used to validate hour/minute/second.
   * @type {string}
   * @const
   */
  var TIME_UNIT = '[0-9]{2}';

  /**
   * Pattern used to validate time (sec. frag, see w3c rfc 3339).
   * @type {string}
   * @const
   */
  var TIME_SECFRAG = '[0-9]+';

  /**
   * Pattern used to validate time.
   * @type {RegExp}
   * @const
   */
  var PATTERN_TIME = new RegExp('^' + TIME_UNIT + ':' + TIME_UNIT + '(:' + TIME_UNIT + ')?(\\.' + TIME_SECFRAG + ')?$');

  var attr = function($item, name, value) {
    return arguments.length === 3 ?
      $item.attr(name, value) :
      $item.attr(name);
  };

  /**
   * Check if an element is required.
   * @param {jQuery...} $item Elements to check.
   * @returns {boolean} True if element is required, false otherwise.
   */
  var isRequired = function($items) {
    if (!$.isArray($items)) {
      $items = [$items];
    }

    for (var i = 0, ln = $items.length; i < ln; ++i) {
      if (attr($items[i], 'required') !== undefined) {
        return true;
      }
    }

    return false;
  };

  /** Check if a value is empty (null, undefined or empty string) */
  var isEmpty = function(val) {
    return val === null || val === undefined || val === '';
  };

  /** Parse given value to an integer */
  var toInt = function(val) {
    return parseInt(val, 10);
  };

  /**
   * Get min-length value of element.
   * @param {jQuery} $item Element.
   * @returns {number} Min length value.
   */
  var minLength = function($item) {
    return toInt(attr($item, 'data-min-length')) || 0;
  };

  /**
   * Get max-length value of element.
   * @param {jQuery} $item Element.
   * @returns {number} Max length value.
   */
  var maxLength = function($item) {
    return toInt(attr($item, 'maxlength')) || Number.MAX_VALUE;
  };

  /**
   * Get pattern value of element.
   * @param {jQuery} $item Element.
   * @returns {RegExp} RegExp value.
   */
  var pattern = function($item) {
    var regexp = attr($item, 'pattern') || '.*';
    return new RegExp(regexp);
  };

  /**
   * Add or remove css classes on element.
   * @param {jQuery} $item Element.
   * @param {string} fn Function to call ('removeClass' or 'addClass').
   * @param {Array<string>} classes Css classes to add or remove.
   */
  var toggleClasses = function($item, fn, classes) {
    for (var i = 0, ln = classes.length; i < ln; ++i) {
      $item[fn](classes[i]);
    }
  };

  /**
   * Remove css classes on element.
   * @param {jQuery} $item Element.
   */
  var removeClasses = function($item) {
    var classes = Array.prototype.slice.call(arguments, 1);
    toggleClasses($item, 'removeClass', classes);
  };

  /**
   * Add css classes on element.
   * @param {jQuery} $item Element.
   */
  var addClasses = function($item) {
    var classes = Array.prototype.slice.call(arguments, 1);
    toggleClasses($item, 'addClass', classes);
  };

  /**
   * Capitalize a string.
   * @param {string} str String to capitalize.
   * @returns {string} Capitalized string.
   */
  var capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.substr(1);
  };

  /**
   * Change a string to a camel case string.
   * @param {string} name String to change.
   * @returns {string} Camel cased string.
   */
  var toCamelCase = function(name) {
    if (!name) {
      return name;
    }

    var i, ln;

    var strs = name.split('.');
    var camelCase = strs[0];
    for (i = 1, ln = strs.length; i < ln; i++) {
      camelCase += capitalize(strs[i]);
    }

    strs = camelCase.split('-');
    camelCase = strs[0];
    for (i = 1, ln = strs.length; i < ln; i++) {
      camelCase += capitalize(strs[i]);
    }

    return camelCase;
  };

  /**
   * Check if a year is valid.
   * @param {string|number} year Year to check.
   * @returns {boolean} True if year is valid, false otherwise.
   */
  var isYearValid = function(year) {
    return year > 0;
  };

  /**
   * Check if a month is valid.
   * @param {number} month Month to check.
   * @returns {boolean} True if month is valid, false otherwise.
   */
  var isMonthValid = function(month) {
    return month >= 0 && month <= 11;
  };

  /**
   * Check if a day is valid.
   * @param {number} day Day to check.
   * @returns {boolean} True if day is valid, false otherwise.
   */
  var isDayValid = function(day) {
    return day >= 1 && day <= 31;
  };

  /**
   * Check if a given date is valid or not.
   * @param {number} year Year.
   * @param {number} month Month.
   * @param {number} day Day.
   * @returns {boolean} True if date is valid, false otherwise.
   */
  var isDateValid = function(year, month, day) {
    year = toInt(year) || 0;
    month = (toInt(month) || 0) - 1;
    day = toInt(day) || 0;

    if (!isYearValid(year) || !isMonthValid(month) || !isDayValid(day)) {
      return false;
    }

    var date = new Date(year, month, day);
    return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day;
  };

  /**
   * Check if hour is valid.
   * @param {number} hour Hour to check.
   * @returns {boolean} True if hour is valid, false otherwise.
   */
  var isHourValid = function(hour) {
    return hour >= 0 && hour <= 23;
  };

  /**
   * Check if minute is valid.
   * @param {number} minute Minutes to check.
   * @returns {boolean} True if minute is valid, false otherwise.
   */
  var isMinuteValid = function(minute) {
    return minute >= 0 && minute <= 59;
  };

  /**
   * Check if second is valid.
   * @param {number} second Seconds to check.
   * @returns {boolean} True if second is valid, false otherwise.
   */
  var isSecondValid = function(second) {
    return second >= 0 && second <= 59;
  };

  /**
   * Check if given time is valid.
   * @param {string|number} hour Hour.
   * @param {string|number} minute Minute.
   * @param {string|number} second Second.
   * @returns {boolean} True if time is valid, false otherwise.
   */
  var isTimeValid = function(hour, minute, second) {
    hour = toInt(hour) || 0;
    minute = toInt(minute) || 0;
    second = toInt(second) || 0;
    return isHourValid(hour) && isMinuteValid(minute) && isSecondValid(second);
  };

  /**
   * Convert time to seconds.
   * @param {Array<string|number>|string} time Time to convert.
   * @returns {number} Seconds.
   */
  var toSeconds = function(time) {
    var array = $.isArray(time) ? time : time.split(':');
    var h = toInt(array[0]);
    var m = toInt(array[1]);
    var s = array.length === 3 ? toInt(array[2]) : 0;
    return h * 3600 + m * 60 + s;
  };

  /**
   * Extract all keys in given string (keys may be separated with a dot sign or between brackets).
   * @param {string} name Keys as a string value.
   * @returns {Array} Array of found keys.
   */
  var extractKeys = function(name) {
    var keys = name.split('.');

    var results = [];
    for (var i = 0, ln = keys.length; i < ln; ++i) {
      var key = keys[i];
      if (key.indexOf('[') >= 0) {
        var subKeys = key.split('[');
        results.push(subKeys[0]);

        var nbSubKeys = subKeys.length;
        for (var k = 1; k < nbSubKeys; ++k) {
          var subKey = subKeys[k];
          if (subKey[subKey.length - 1] === ']') {
            subKey = '[' + subKey;
          }
          results.push(subKey);
        }
      }
      else {
        results.push(key);
      }
    }

    return results;
  };

  /**
   * Set a value on given field in object.
   * @param {object} obj Object.
   * @param {Array<string>} keys Keys.
   * @param {*} value Value to set.
   */
  var deepSet = function(obj, keys, value) {
    var current = obj;
    var ln = keys.length;
    var last = keys[ln - 1];

    if (ln > 1) {
      var previous = current;
      for (var i = 0; i < ln - 1; ++i) {
        var key = keys[i];
        current = previous[key];
        if (current === undefined) {
          var nextKey = i + 1 < ln ? keys[i + 1] : null;
          var next = nextKey.charAt(0) === '[' ? [] : {};

          if ($.isArray(previous)) {
            // Push to array
            key = key.replace(']', '').replace('[', '');
            if (key === '') {
              previous.push(next);
            }
            else {
              previous[key] = next;
            }
          }
          else {
            // Set to object
            previous[key] = next;
          }
          current = next;
        }
        previous = current;
      }
    }

    if ($.isArray(current)) {
      current.push(value);
    }
    else {
      current[last] = value;
    }
  };

  /** Check if an item is a button */
  var isButton = function($item) {
    var type = attr($item, 'type');
    return type === 'button' || type === 'image' || type === 'reset' || $item.is('button');
  };

  /**
   * Form.
   * @param {jQuery} form jQuery form.
   * @param {object} options Initialization options.
   * @constructor
   */
  var Form = function(form, options) {
    this.$form = $(form);
    this.opts = options;
    this.errors = {};
  };

  //noinspection FunctionWithInconsistentReturnsJS,JSUnusedGlobalSymbols
  Form.prototype = {
    /** Initialize plugin. */
    init: function() {
      // Add relative position to form
      this.$form.css('position', 'relative');

      if (this.opts.showErrors) {
        attr(this.$form, 'novalidate', 'novalidate');
        this.appendErrorAreas();
      }

      this.bind();
      this.validate();
    },

    /** Bind user events. */
    bind: function() {
      var that = this;
      this.$form.on('keyup.jqForm', function(event) {
        var $item = $(event.srcElement);
        if (!isButton($item)) {
          that.checkAndUpdateForm($item);
        }
      });

      this.$form.on('focusout.jqForm', function(event) {
        var $item = $(event.srcElement);
        if (!isButton($item)) {
          that.checkAndUpdateForm($item);
        }
      });

      this.$form.on('change.jqForm', function(event) {
        var $item = $(event.srcElement);
        that.checkAndUpdateForm($item);

        addClasses($item, CSS_DIRTY);
        addClasses(that.$form, CSS_DIRTY);
      });

      this.$form.on('submit.jqForm', function(event) {
        event.preventDefault();
        that.$form.addClass('submitted');
        var valid = that.validate();
        if (that.opts.ajaxSubmit && valid) {
          that.submit();
        }
      });
    },

    /** Get items used by validation */
    $items: function() {
      return this.$form.find('input[type!="hidden"], select, textarea');
    },

    /** Append error boxes after each controls */
    appendErrorAreas: function() {
      this.$errors = {};

      var that = this;
      this.$items().each(function() {
        var $this = $(this);
        var name = that.name($this);

        var $error = $('<div></div>').addClass('jq-form-error');
        if (!that.$errors.hasOwnProperty(name)) {
          that.$errors[name] = $error;
          $this.after($error);
        }
      });
    },

    /** Validate form. */
    validate: function() {
      var that = this;
      var $first = null;

      this.$items().each(function() {
        var $this = $(this);
        var error = that.check($this);
        if (error.length > 0 && !$first) {
          $first = $this;
        }
      });

      if ($first) {
        $first.eq(0).focus();
      }

      return this.checkForm();
    },

    /** Submit form. */
    submit: function() {
      if (!this.xhr) {
        var $form = this.$form;

        var method = attr($form, 'method');
        var url = attr($form, 'action');
        var datas = $form.serialize();
        var $submit = $form.find(SUBMIT_BTNS);

        $submit
          .addClass('disabled')
          .attr('disabled', 'disabled');

        var that = this;

        that.xhr = $.ajax({
          url: url,
          type: method,
          dataType: that.opts.dataType,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          datas: datas
        });

        that.xhr.done(function() {
          that.opts.onSubmitSuccess.apply(null, arguments);
        });

        that.xhr.fail(function() {
          that.opts.onSubmitError.apply(null, arguments);
        });

        that.xhr.always(function() {
          that.opts.onSubmitComplete.apply(null, arguments);
          that.xhr = null;
          $submit.removeClass('disabled').removeAttr('disabled');
        });
      }
    },

    /** Unbind user events. */
    unbind: function() {
      this.$form.off('.jqForm');
    },

    /** Get name attribute of item */
    name: function($item) {
      var name = attr($item, DATA_NAME);
      if (!name) {
        name = attr($item, 'name') || '';
        name = toCamelCase(name);
        attr($item, DATA_NAME, name);
      }
      return name;
    },

    /**
     * Check form element.
     * @param {jQuery} $item jQuery item.
     */
    check: function($item) {
      var that = this;

      that.clearMessage($item);
      removeClasses($item, CSS_ERROR);

      // Check required flag (valid for every tags)
      var requiredError = that.checkRequired($item);

      // Validation by tag
      var tagName = ($item.get(0).tagName || 'null').toLowerCase();
      var fn = 'check' + capitalize(tagName);
      var itemErrors = (that[fn] ? that[fn]($item) : that.checkText($item));

      // Array of found errors
      var errors = [];

      // Add required error
      if (requiredError) {
        errors = errors.concat(requiredError);
      }

      // Add other found errors
      errors = errors.concat(itemErrors);

      var name = that.name($item);

      // Add error class and display message
      if (errors.length > 0) {
        addClasses($item, CSS_ERROR);

        // Display error message
        var firstError = errors[0];
        if (that.$errors[name]) {
          var position = $item.position();
          var heightItem = $item.outerHeight();
          var widthItem = $item.outerWidth();

          var top = position.top + heightItem + 5;

          var $error = that.$errors[name];
          $error
            .css({
              'display': '',
              'top': top
            })
            .html(firstError.label);

          var widthLabel = $error.outerWidth();
          var diff = widthItem - widthLabel;
          var left = position.left + (diff / 2);
          $error.css('left', left);
        }
      }

      this.errors[name] = errors.length > 0;
      this.checkForm();
      return errors;
    },

    /**
     * Check form validity.
     * @returns {boolean} True if form is valid, false otherwise.
     */
    checkForm: function() {
      var formError = false;
      this.$form.removeClass(CSS_ERROR);

      for (var i in this.errors) {
        if (this.errors.hasOwnProperty(i) && !!this.errors[i]) {
          addClasses(this.$form, CSS_ERROR);
          formError = true;
          break;
        }
      }

      delete this.errors.$$custom;

      var customIsValid = this.opts.isValid.call(this, this.$form, this.errors);
      if (!customIsValid) {
        this.errors.$$custom = true;
        addClasses(this.$form, CSS_ERROR);
        formError = true;
      }

      // Disable / Enable submit button
      if (this.opts.disableSubmit) {
        if (formError) {
          this.$form.find(SUBMIT_BTNS).attr('disabled', 'disabled');
        } else {
          this.$form.find(SUBMIT_BTNS).removeAttr('disabled');
        }
      }

      return !formError;
    },

    /**
     * Check item and update form validity.
     * @param {jQuery} $item Item to check.
     */
    checkAndUpdateForm: function($item) {
      this.check($item);
      this.checkForm();
    },

    /**
     * Check required item.
     * @param {jQuery} $item jQuery item.
     * @return {object?} Error.
     */
    checkRequired: function($item) {
      removeClasses($item, CSS_ERROR_REQUIRED);

      var value;

      if ($item.is('input[type=radio]')) {
        var name = attr($item, 'name');
        $item = this.$form.find('input[name="' + name + '"]');
        value = $item.find(':selected').val();
      } else if ($item.is('input[type=checkbox]')) {
        value = attr($item, 'checked');
      } else {
        value = $.trim($item.val());
      }

      if (isRequired($item) && isEmpty(value)) {
        addClasses($item, CSS_ERROR_REQUIRED);
        return this.buildError('required');
      }
    },

    /** Clear error message */
    clearMessage: function($item) {
      if (this.$errors) {
        var name = this.name($item);
        this.$errors[name]
          .hide()
          .html('');
      }
    },

    /** Build error message from key and optional replacements */
    buildError: function(key, replacements) {
      var message = this.opts.messages[key];

      if (replacements) {
        for (var i in replacements) {
          if (replacements.hasOwnProperty(i)) {
            message = message.replace('{{' + i + '}}', replacements[i]);
          }
        }
      }

      return {
        key: key,
        label: message
      };
    },

    /**
     * Check input element.
     * @param {jQuery} $input Input element.
     * @returns {Array} Array of detected errors.
     */
    checkInput: function($input) {
      var type = attr($input, 'data-type') || attr($input, 'type') || 'text';
      var fn = 'checkInput' + capitalize(type);
      return this[fn] ?
        this[fn]($input) :
        false;
    },

    /**
     * Check text errors (min-length, max-length, pattern).
     * @param {jQuery} $item jQuery element.
     * @returns {Array} Array of detected errors.
     */
    checkText: function($item) {
      removeClasses($item, CSS_ERROR_MIN_LENGTH, CSS_ERROR_MAX_LENGTH, CSS_ERROR_SAME_AS, CSS_ERROR_PATTERN);

      var errors = [];

      var value = $item.val();
      var trimValue = $.trim(value);
      var length = trimValue.length;

      var minln = minLength($item);
      if (length < minln) {
        addClasses($item, CSS_ERROR_MIN_LENGTH);
        errors.push(this.buildError('minlength', {
          count: minln
        }));
      }

      var maxln = maxLength($item);
      if (length > maxln) {
        addClasses($item, CSS_ERROR_MAX_LENGTH);
        errors.push(this.buildError('maxlength', {
          count: maxln
        }));
      }

      if (!pattern($item).test(trimValue)) {
        addClasses($item, CSS_ERROR_PATTERN);
        errors.push(this.buildError('pattern'));
      }

      var sameAs = attr($item, 'data-same-as');
      if (sameAs) {
        var $sameAs = $(sameAs);
        var valueToCompare = $sameAs.val();
        if (value !== valueToCompare) {
          addClasses($item, CSS_ERROR_SAME_AS);
          errors.push(this.buildError('sameAs', {
            item: attr($sameAs, 'title')
          }));
        }
      }

      return errors;
    },

    /**
     * Check text input.
     * @param {jQuery} $input Input.
     * @returns {Array} Detected errors.
     */
    checkInputText: function($input) {
      return this.checkText($input);
    },

    /**
     * Check password input.
     * @param {jQuery} $input Password input.
     * @returns {Array} Detected errors.
     */
    checkInputPassword: function($input) {
      return this.checkText($input);
    },

    /**
     * Check email input.
     * @param {jQuery} $input Email input.
     * @returns {Array} Detected errors.
     */
    checkInputEmail: function($input) {
      var errors = this.checkText($input);

      var value = $input.val();

      removeClasses($input, CSS_ERROR_EMAIL_PATTERN);
      var values = value.split(',');
      for (var i = 0, ln = values.length; i < ln; ++i) {
        var trimValue = $.trim(values[i]);
        if (trimValue && !PATTERN_EMAIL.test(trimValue)) {
          addClasses($input, CSS_ERROR_EMAIL_PATTERN);
          errors.push(this.buildError('email'));
        }
      }

      removeClasses($input, CSS_ERROR_EMAIL_MULTIPLE);
      var multiple = attr($input, 'multiple') !== undefined;
      if (!multiple && value.split(',').length > 1) {
        addClasses($input, CSS_ERROR_EMAIL_MULTIPLE);
        errors.push(this.buildError('emailMultiple'));
      }

      return errors;
    },

    /**
     * Check url input.
     * @param {jQuery} $input Url input.
     * @returns {Array} Array of detected errors.
     */
    checkInputUrl: function($input) {
      var errors = this.checkText($input);

      var value = $.trim($input.val());

      removeClasses($input, CSS_ERROR_URL_PATTERN);
      if (value && !PATTERN_URL.test(value)) {
        addClasses($input, CSS_ERROR_URL_PATTERN);
        errors.push(this.buildError('url'));
      }

      return errors;
    },

    /**
     * Check number input.
     * @param {jQuery} $input Number input.
     * @returns {Array} Array of detected errors.
     */
    checkInputNumber: function($input) {
      var value = parseFloat($input.val());

      var min = parseFloat(attr($input, 'min'));
      var max = parseFloat(attr($input, 'max'));

      if (min === undefined) {
        min = Number.MIN_VALUE;
      }

      if (max === undefined) {
        max = Number.MAX_VALUE;
      }

      var errors = [];

      removeClasses($input, CSS_ERROR_MIN, CSS_ERROR_MAX);
      if (value < min) {
        addClasses($input, CSS_ERROR_MIN);
        errors.push(this.buildError('min', {
          min: min
        }));
      }

      if (value > max) {
        addClasses($input, CSS_ERROR_MAX);
        errors.push(this.buildError('max', {
          max: max
        }));
      }

      return errors;
    },

    /**
     * Check range input.
     * @param {jQuery} $input Range input.
     * @returns {Array} True if input is not valid, false otherwise.
     */
    checkInputRange: function($input) {
      return this.checkInputNumber($input);
    },

    /**
     * Check checkbox inputs.
     * @returns {Array} Empty array.
     */
    checkInputCheckbox: function() {
      return [];
    },

    /**
     * Check checkbox radios.
     * @returns {Array} Empty array.
     */
    checkInputRadio: function() {
      return [];
    },

    /**
     * Check date for a given pattern.
     * @param {jQuery} $input Input element.
     * @param {RegExp} pattern Pattern.
     * @returns {Array} True if input is not valid, false otherwise.
     */
    checkDateValue: function($input, pattern) {
      removeClasses($input, CSS_ERROR_DATE_PATTERN, CSS_ERROR_DATE_INVALID, CSS_ERROR_MIN, CSS_ERROR_MAX);

      var value = $.trim($input.val());
      var date = null;

      var errors = [];

      if (value) {
        if (!pattern.test(value)) {
          $input.addClass(CSS_ERROR_DATE_PATTERN);
          errors.push(this.buildError('date'));
        }
        else {
          var values = value.split('-');
          var day = values.length === 3 ? values[2] : '01';
          if (!isDateValid(values[0], values[1], day)) {
            $input.addClass(CSS_ERROR_DATE_INVALID);
            errors.push(this.buildError('date'));
          }

          date = new Date(values[0] + '-' + values[1] + '-' + day);
        }
      }

      if (value && !errors.length) {
        var timestamp = date.getTime();
        var min = $.trim(attr($input, 'min'));
        var max = $.trim(attr($input, 'max'));

        if (min) {
          min = min.length === 7 ? min + '-01' : min;
          if (timestamp < new Date(min).getTime()) {
            $input.addClass(CSS_ERROR_MIN);
            errors.push(this.buildError('min', {
              min: min
            }));
          }
        }

        if (max) {
          max = max.length === 7 ? max + '-01' : max;
          if (timestamp > new Date(max).getTime()) {
            $input.addClass(CSS_ERROR_MAX);
            errors.push(this.buildError('max', {
              max: max
            }));
          }
        }
      }

      return errors;
    },

    /**
     * Check date input.
     * @param {jQuery} $input Date input.
     * @returns {Array} True if input is not valid, false otherwise.
     */
    checkInputDate: function($input) {
      return this.checkDateValue($input, PATTERN_FULL_DATE);
    },

    /**
     * Check month input.
     * @param {jQuery} $input Month input.
     * @returns {Array} True if input is not valid, false otherwise.
     */
    checkInputMonth: function($input) {
      return this.checkDateValue($input, PATTERN_FULL_MONTH);
    },

    /**
     * Check time input.
     * @param {jQuery} $input Time input.
     * @returns {Array} True if input is not valid, false otherwise.
     */
    checkInputTime: function($input) {
      removeClasses($input, CSS_ERROR_TIME_PATTERN, CSS_ERROR_TIME_INVALID, CSS_ERROR_MIN, CSS_ERROR_MAX);

      var value = $.trim($input.val());
      var seconds = 0;

      var errors = [];

      if (value) {
        if (!PATTERN_TIME.test(value)) {
          addClasses($input, CSS_ERROR_TIME_PATTERN);
          errors.push(this.buildError('time'));
        }
        else {
          var values = value.split(':');

          var hour = values[0];
          var minute = values[1];
          var second = values.length === 3 ? values[2] : '00';
          second = second.split('.')[0];

          if (!isTimeValid(hour, minute, second)) {
            addClasses($input, CSS_ERROR_TIME_INVALID);
            errors.push(this.buildError('time'));
          }

          seconds = toSeconds([hour, minute, second]);
        }
      }

      if (value && !errors.length) {
        var min = attr($input, 'min');
        var max = attr($input, 'max');

        if (min) {
          var minSeconds = toSeconds(min.split(':'));
          if (seconds < minSeconds) {
            addClasses($input, CSS_ERROR_MIN);
            errors.push(this.buildError('min', {
              min: min
            }));
          }
        }

        if (max) {
          var maxSeconds = toSeconds(max.split(':'));
          if (seconds > maxSeconds) {
            addClasses($input, CSS_ERROR_MAX);
            errors.push(this.buildError('max', {
              max: max
            }));
          }
        }
      }

      return errors;
    },

    /**
     * Check select element.
     * @returns {Array} Detected errors.
     */
    checkSelect: function() {
      return [];
    },

    /**
     * Serialize form to json object.
     * @returns {object} Json object.
     */
    toJSON: function() {
      var o = {};
      var array = this.$form.serializeArray();
      $.each(array, function(i, item) {
        var name = item.name;
        var value = item.value;
        var keys = extractKeys(name);
        deepSet(o, keys, value);
      });
      return o;
    },

    /** Clear form. */
    clear: function() {
      this.$form.find('input').each(function() {
        var $this = $(this);
        if (attr($(this), 'type') !== 'hidden') {
          $this.val('');
        }
      });
      this.$form.find('select, textarea').val('');
    },

    /** Destroy plugin internal datas. */
    destroy: function() {
      var that = this;
      that.unbind();
      that.$form = that.opts = that.errors = that.$errors = null;
    }
  };

  $.fn.jqForm = function(settings) {
    var self = this;

    self.destroy = function() {
      $(self).data(PLUGIN_NAME).destroy();
      return self;
    };

    self.clear = function() {
      $(self).data(PLUGIN_NAME).clear();
      return self;
    };

    self.validate = function() {
      self.isValid();
      return self;
    };

    self.errors = function() {
      return $(self).data(PLUGIN_NAME).errors;
    };

    self.isValid = function() {
      return $(self).data(PLUGIN_NAME).validate();
    };

    self.toJSON = function() {
      return $(self).data(PLUGIN_NAME).toJSON();
    };

    return self.each(function() {
      var form = $(this).data(PLUGIN_NAME);
      if (!form) {
        var opts = $.extend({}, $.fn.jqForm.options);
        if (typeof settings === 'object') {
          opts = $.extend(opts, settings);
        }

        form = new Form(this, opts);
        form.init();
      }
      $(this).data(PLUGIN_NAME, form);
    });
  };

  $.fn.jqForm.options = {
    disableSubmit: false,
    dataType: 'json',
    ajaxSubmit: true,
    isValid: returnTrue,
    onSubmitSuccess: noop,
    onSubmitError: noop,
    onSubmitComplete: noop,
    showErrors: true,
    messages: {
      required: 'Please fill out this field',
      pattern: 'Please match the requested format',
      email: 'Please enter an email address',
      date: 'Please enter a date',
      time: 'Please enter a time',
      emailMultiple: 'Multiple email address is not allowed',
      url: 'Please enter an URL',
      minlength: 'Text must be at least {{count}} characters',
      maxlength: 'Text must be at most {{count}} characters',
      min: 'Value must be greater than or equal to {{min}}',
      max: 'Value must be less than or equal to {{max}}',
      sameAs: 'Value must match {{item}}'
    }
  };

}));