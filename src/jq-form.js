/**
 *
 */

(function($) {

  'use strict';

  var noop = function() {
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

  /**
   * Check if an element is required.
   * @param {jQuery} $item Element to check.
   * @returns {boolean} True if element is required, false otherwise.
   */
  var isRequired = function($item) {
    return $item.attr('required') !== undefined;
  };

  /**
   * Get min-length value of element.
   * @param {jQuery} $item Element.
   * @returns {number} Min length value.
   */
  var minLength = function($item) {
    return parseInt($item.attr('data-min-length'), 10) || 0;
  };

  /**
   * Get max-length value of element.
   * @param {jQuery} $item Element.
   * @returns {number} Max length value.
   */
  var maxLength = function($item) {
    return parseInt($item.attr('maxlength'), 10) || Number.MAX_VALUE;
  };

  /**
   * Get pattern value of element.
   * @param {jQuery} $item Element.
   * @returns {RegExp} RegExp value.
   */
  var pattern = function($item) {
    var regexp = $item.attr('pattern') || '.*';
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
    year = parseInt(year, 10) || 0;
    month = (parseInt(month, 10) || 0) - 1;
    day = parseInt(day, 10) || 0;

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
    hour = parseInt(hour, 10) || 0;
    minute = parseInt(minute, 10) || 0;
    second = parseInt(second, 10) || 0;
    return isHourValid(hour) && isMinuteValid(minute) && isSecondValid(second);
  };

  /**
   * Convert time to seconds.
   * @param {Array<string|number>|string} time Time to convert.
   * @returns {number} Seconds.
   */
  var toSeconds = function(time) {
    var array = $.isArray(time) ? time : time.split(':');
    var h = parseInt(array[0], 10);
    var m = parseInt(array[1], 10);
    var s = array.length === 3 ? parseInt(array[2], 10) : 0;
    return h * 3600 + m * 60 + s;
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

  Form.prototype = {
    /**
     * Initialize plugin.
     */
    init: function() {
      this.bind();
      this.validate();
    },

    /**
     * Bind user events.
     */
    bind: function() {
      var that = this;
      this.$form.on('keyup.jqForm', function(event) {
        var $item = $(event.srcElement);
        that.checkAndUpdateForm($item);
      });

      this.$form.on('focusout.jqForm', function(event) {
        var $item = $(event.srcElement);
        that.checkAndUpdateForm($item);
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
        if (valid) {
          that.submit();
        }
      });
    },

    /**
     * Validate form.
     */
    validate: function() {
      var that = this;
      this.$form.find('input, select, textarea').each(function() {
        var $this = $(this);
        if (!$this.is('input') || $this.attr('type') !== 'hidden') {
          that.check($this);
        }
      });
      return this.checkForm();
    },

    /**
     * Submit form.
     */
    submit: function() {
      if (!this.xhr) {
        var method = this.$form.attr('method');
        var url = this.$form.attr('action');
        var datas = this.$form.serialize();
        var $submit = this.$form.find(SUBMIT_BTNS);

        $submit.addClass('disabled').attr('disabled', 'disabled');

        this.xhr = $.ajax({
          url: url,
          type: method,
          dataType: this.opts.dataType,
          contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          datas: datas
        });

        var that = this;

        this.xhr.done(function() {
          that.opts.onSubmitSuccess.apply(null, arguments);
        });

        this.xhr.fail(function() {
          that.opts.onSubmitError.apply(null, arguments);
        });

        this.xhr.always(function() {
          that.opts.onSubmitComplete.apply(null, arguments);
          that.xhr = null;
          $submit.removeClass('disabled').removeAttr('disabled');
        });
      }
    },

    /**
     * Unbind user events.
     */
    unbind: function() {
      this.$form.off('.jqForm');
    },

    /**
     * Check form element.
     * @param {jQuery} $item jQuery item.
     */
    check: function($item) {
      var name = $item.attr(DATA_NAME);
      if (!name) {
        name = $item.attr('name') || '';
        name = toCamelCase(name);
        $item.attr(DATA_NAME, name);
      }

      removeClasses($item, CSS_ERROR);

      var tagName = ($item.get(0).tagName || 'null').toLowerCase();

      // Check required flag (valid for every tags)
      var error = this.checkRequired($item);

      // Validation by tag
      var fn = 'check' + capitalize(tagName);
      error = (this[fn] ? this[fn]($item) : this.checkText($item)) || error;

      if (error) {
        addClasses($item, CSS_ERROR);
      }

      this.errors[name] = error;
      this.checkForm();
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

      // Disable / Enable submit button
      if (this.opts.disableSubmit) {
        if (formError) {
          this.$form.find(SUBMIT_BTNS).attr('disabled', 'disabled');
        } else {
          this.$form.find(SUBMIT_BTNS).removeAttr('disabled');
        }
      }

      return formError;
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
     * @return {boolean} True if required error is triggered, false otherwise.
     */
    checkRequired: function($item) {
      removeClasses($item, CSS_ERROR_REQUIRED);

      var value = $.trim($item.val());
      if (isRequired($item) && value === '') {
        addClasses($item, CSS_ERROR_REQUIRED);
        return true;
      }

      return false;
    },

    /**
     * Check input element.
     * @param {jQuery} $input Input element.
     * @returns {boolean} True if input element is invalid, false otherwise.
     */
    checkInput: function($input) {
      var type = $input.attr('data-type') || $input.attr('type') || 'text';
      var fn = 'checkInput' + capitalize(type);
      return this[fn] ?
        this[fn]($input) :
        false;
    },

    /**
     * Check text errors (min-length, max-length, pattern).
     * @param {jQuery} $item jQuery element.
     * @returns {boolean} True if element is not valid, false otherwise.
     */
    checkText: function($item) {
      removeClasses($item, CSS_ERROR_MIN_LENGTH, CSS_ERROR_MAX_LENGTH, CSS_ERROR_SAME_AS, CSS_ERROR_PATTERN);

      var error = false;
      var value = $item.val();
      var trimValue = $.trim(value);
      var length = trimValue.length;

      if (length < minLength($item)) {
        error = true;
        addClasses($item, CSS_ERROR_MIN_LENGTH);
      }

      if (length > maxLength($item)) {
        error = true;
        addClasses($item, CSS_ERROR_MAX_LENGTH);
      }

      if (!pattern($item).test(trimValue)) {
        error = true;
        addClasses($item, CSS_ERROR_PATTERN);
      }

      var sameAs = $item.attr('data-same-as');
      if (sameAs) {
        var valueToCompare = $(sameAs).val();
        if (value !== valueToCompare) {
          error = true;
          addClasses($item, CSS_ERROR_SAME_AS);
        }
      }

      return error;
    },

    /**
     * Check text input.
     * @param {jQuery} $input Input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputText: function($input) {
      return this.checkText($input);
    },

    /**
     * Check password input.
     * @param {jQuery} $input Password input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputPassword: function($input) {
      return this.checkText($input);
    },

    /**
     * Check email input.
     * @param {jQuery} $input Email input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputEmail: function($input) {
      var error = this.checkText($input);

      var value = $input.val();

      removeClasses($input, CSS_ERROR_EMAIL_PATTERN);
      var values = value.split(',');
      for (var i = 0, ln = values.length; i < ln; ++i) {
        var trimValue = $.trim(values[i]);
        if (trimValue && !PATTERN_EMAIL.test(trimValue)) {
          error = true;
          addClasses($input, CSS_ERROR_EMAIL_PATTERN);
        }
      }

      removeClasses($input, CSS_ERROR_EMAIL_MULTIPLE);
      var multiple = $input.attr('multiple') !== undefined;
      if (!multiple && value.split(',').length > 1) {
        error = true;
        addClasses($input, CSS_ERROR_EMAIL_MULTIPLE);
      }

      return error;
    },

    /**
     * Check url input.
     * @param {jQuery} $input Url input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputUrl: function($input) {
      var error = this.checkText($input);
      var value = $.trim($input.val());

      removeClasses($input, CSS_ERROR_URL_PATTERN);
      if (value && !PATTERN_URL.test(value)) {
        error = true;
        addClasses($input, CSS_ERROR_URL_PATTERN);
      }

      return error;
    },

    /**
     * Check number input.
     * @param {jQuery} $input Number input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputNumber: function($input) {
      var value = parseFloat($input.val());

      var min = parseFloat($input.attr('min'));
      var max = parseFloat($input.attr('max'));

      if (min === undefined) {
        min = Number.MIN_VALUE;
      }

      if (max === undefined) {
        max = Number.MAX_VALUE;
      }

      var error = false;
      removeClasses($input, CSS_ERROR_MIN, CSS_ERROR_MAX);
      if (value < min) {
        error = true;
        addClasses($input, CSS_ERROR_MIN);
      }

      if (value > max) {
        error = true;
        addClasses($input, CSS_ERROR_MAX);
      }

      return error;
    },

    /**
     * Check range input.
     * @param {jQuery} $input Range input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputRange: function($input) {
      return this.checkInputNumber($input);
    },

    /**
     * Check date for a given pattern.
     * @param {jQuery} $input Input element.
     * @param {RegExp} pattern Pattern.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkDateValue: function($input, pattern) {
      removeClasses($input, CSS_ERROR_DATE_PATTERN, CSS_ERROR_DATE_INVALID, CSS_ERROR_MIN, CSS_ERROR_MAX);

      var value = $.trim($input.val());
      var date = null;

      var error = false;

      if (value) {
        if (!pattern.test(value)) {
          error = true;
          $input.addClass(CSS_ERROR_DATE_PATTERN);
        }
        else {
          var values = value.split('-');
          var day = values.length === 3 ? values[2] : '01';
          if (!isDateValid(values[0], values[1], day)) {
            error = true;
            $input.addClass(CSS_ERROR_DATE_INVALID);
          }

          date = new Date(values[0] + '-' + values[1] + '-' + day);
        }
      }

      if (value && !error) {
        var timestamp = date.getTime();
        var min = $.trim($input.attr('min'));
        var max = $.trim($input.attr('max'));

        if (min) {
          min = min.length === 7 ? min + '-01' : min;
          if (timestamp < new Date(min).getTime()) {
            error = true;
            $input.addClass(CSS_ERROR_MIN);
          }
        }

        if (max) {
          max = max.length === 7 ? max + '-01' : max;
          if (timestamp > new Date(max).getTime()) {
            error = true;
            $input.addClass(CSS_ERROR_MAX);
          }
        }
      }

      return error;
    },

    /**
     * Check date input.
     * @param {jQuery} $input Date input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputDate: function($input) {
      return this.checkDateValue($input, PATTERN_FULL_DATE);
    },

    /**
     * Check month input.
     * @param {jQuery} $input Month input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputMonth: function($input) {
      return this.checkDateValue($input, PATTERN_FULL_MONTH);
    },

    /**
     * Check time input.
     * @param {jQuery} $input Time input.
     * @returns {boolean} True if input is not valid, false otherwise.
     */
    checkInputTime: function($input) {
      removeClasses($input, CSS_ERROR_TIME_PATTERN, CSS_ERROR_TIME_INVALID, CSS_ERROR_MIN, CSS_ERROR_MAX);

      var value = $.trim($input.val());
      var seconds = 0;
      var error = false;
      if (value) {
        if (!PATTERN_TIME.test(value)) {
          error = true;
          addClasses($input, CSS_ERROR_TIME_PATTERN);
        }
        else {
          var values = value.split(':');
          var hour = values[0];
          var minute = values[1];
          var second = values.length === 3 ? values[2] : '00';
          second = second.split('.')[0];
          if (!isTimeValid(hour, minute, second)) {
            error = true;
            addClasses($input, CSS_ERROR_TIME_INVALID);
          }
          seconds = toSeconds([hour, minute, second]);
        }
      }

      if (value && !error) {
        var min = $input.attr('min');
        var max = $input.attr('max');

        if (min) {
          var minSeconds = toSeconds(min.split(':'));
          if (seconds < minSeconds) {
            error = true;
            addClasses($input, CSS_ERROR_MIN);
          }
        }

        if (max) {
          var maxSeconds = toSeconds(max.split(':'));
          if (seconds > maxSeconds) {
            error = true;
            addClasses($input, CSS_ERROR_MAX);
          }
        }
      }

      return error;
    },

    /**
     * Check select element.
     * @returns {boolean} false.
     * @public
     */
    checkSelect: function() {
      return false;
    },

    /**
     * Clear form.
     * @public
     */
    clear: function() {
      this.$form.find('input').each(function() {
        var $this = $(this);
        if ($(this).attr('type') !== 'hidden') {
          $this.val('');
        }
      });
      this.$form.find('select, textarea').val('');
    },

    /**
     * Destroy plugin internal datas.
     * @public
     */
    destroy: function() {
      this.unbind();
      this.$form = null;
      this.opts = null;
      this.errors = null;
    }
  };

  $.fn.jqForm = function(settings) {
    this.destroy = function() {
      $(this).data(PLUGIN_NAME).destroy();
      return this;
    };

    this.clear = function() {
      $(this).data(PLUGIN_NAME).clear();
      return this;
    };

    this.validate = function() {
      this.isValid();
      return this;
    };

    this.errors = function() {
      return $(this).data(PLUGIN_NAME).errors;
    };

    this.isValid = function() {
      return $(this).data(PLUGIN_NAME).validate();
    };

    return this.each(function() {
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
    onSubmitSuccess: noop,
    onSubmitError: noop,
    onSubmitComplete: noop
  };

})(jQuery);