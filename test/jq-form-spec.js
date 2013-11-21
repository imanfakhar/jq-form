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

describe('jqForm Plugin: Test Suite', function() {

  beforeEach(function() {
    spyOn($.fn, 'attr').andCallThrough();
    spyOn($.fn, 'addClass').andCallThrough();
    spyOn($.fn, 'removeClass').andCallThrough();
    spyOn($.fn, 'on').andCallThrough();
    spyOn($.fn, 'css').andCallThrough();

    spyOn($.fn, 'position').andReturn({
      top: 10,
      left: 20
    });

    spyOn($.fn, 'outerHeight').andReturn(5);
    spyOn($.fn, 'outerWidth').andReturn(15);

    this.$form = $('<form></form>');
    $('body').append(this.$form);
  });

  afterEach(function() {
    this.$form.remove();
  });

  it('should have default options', function() {
    expect($.fn.jqForm.options).toBeDefined();
    expect($.fn.jqForm.options).toEqual({
      disableSubmit: false,
      dataType: 'json',
      ajaxSubmit: true,
      isValid: jasmine.any(Function),
      onSubmitSuccess: jasmine.any(Function),
      onSubmitError: jasmine.any(Function),
      onSubmitComplete: jasmine.any(Function),
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
    });
  });

  describe('jqForm: check initialization', function() {
    it('should use default options', function() {
      this.$form.jqForm();

      var plugin = this.$form.data('jqForm');
      expect(plugin.opts).toBeDefined();
      expect(plugin.opts).toEqual($.fn.jqForm.options);
    });

    it('should override default options', function() {
      this.$form.jqForm({
        disableSubmit: true
      });

      var plugin = this.$form.data('jqForm');
      expect(plugin.opts).toBeDefined();
      expect(plugin.opts).toEqual({
        disableSubmit: true,
        dataType: 'json',
        ajaxSubmit: true,
        isValid: jasmine.any(Function),
        showErrors: true,
        onSubmitSuccess: jasmine.any(Function),
        onSubmitError: jasmine.any(Function),
        onSubmitComplete: jasmine.any(Function),
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
      });
    });
  });

  describe('jqForm: toJSON', function() {
    it("should serialize form to json object with simple string values", function() {
      this.$input = $('<input type="text" name="foo1" value="bar1"/>');
      this.$select = $('<select name="foo2"><option value="bar2" selected></option></select>');

      this.$form.append(this.$input);
      this.$form.append(this.$select);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');

      var obj = this.$plugin.toJSON();
      expect(obj).toEqual({
        foo1: 'bar1',
        foo2: 'bar2'
      });
    });

    it("should serialize form to json object with nested object", function() {
      this.$input1 = $('<input type="text" name="foo.foo1" value="bar1"/>');
      this.$input2 = $('<input type="text" name="foobar" value="bar1"/>');
      this.$select = $('<select name="foo.foo2"><option value="bar2" selected></option></select>');

      this.$form.append(this.$input1);
      this.$form.append(this.$input2);
      this.$form.append(this.$select);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');

      var obj = this.$plugin.toJSON();
      expect(obj).toEqual({
        foobar: 'bar1',
        foo: {
          foo1: 'bar1',
          foo2: 'bar2'
        }
      });
    });

    it("should serialize form to json object with nested object", function() {
      this.$input1 = $('<input type="text" name="foo.foo1" value="bar1"/>');
      this.$input2 = $('<input type="text" name="foobar" value="bar1"/>');
      this.$select = $('<select name="foo.foo2"><option value="bar2" selected></option></select>');

      this.$form.append(this.$input1);
      this.$form.append(this.$input2);
      this.$form.append(this.$select);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');

      var obj = this.$plugin.toJSON();
      expect(obj).toEqual({
        foobar: 'bar1',
        foo: {
          foo1: 'bar1',
          foo2: 'bar2'
        }
      });
    });

    it("should serialize form to json object with arrays", function() {
      this.$input1 = $('<input type="text" name="foo[]" value="bar1"/>');
      this.$input2 = $('<input type="text" name="foo[]" value="bar2"/>');
      this.$select = $('<select name="foobar"><option value="bar1" selected></option></select>');

      this.$form.append(this.$input1);
      this.$form.append(this.$input2);
      this.$form.append(this.$select);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');

      var obj = this.$plugin.toJSON();
      expect(obj).toEqual({
        foobar: 'bar1',
        foo: ['bar1', 'bar2']
      });
    });

    it("should serialize form to json object with arrays", function() {
      this.$input1 = $('<input type="text" name="foo.bar[0].name" value="bar1"/>');
      this.$input2 = $('<input type="text" name="foo.bar[1].name" value="bar2"/>');
      this.$select = $('<select name="foobar"><option value="bar1" selected></option></select>');

      this.$form.append(this.$input1);
      this.$form.append(this.$input2);
      this.$form.append(this.$select);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');

      var obj = this.$plugin.toJSON();
      expect(obj).toEqual({
        foobar: 'bar1',
        foo: {
          bar: [
            { name: 'bar1' },
            { name: 'bar2' }
          ]
        }
      });
    });
  });

  describe('jqForm: check ajax submission', function() {
    it("should not submit form if ajax submission is disabled", function() {
      this.$input = $('<input type="text"/>');
      this.$form.append(this.$input);

      this.$form.jqForm({
        ajaxSubmit: false
      });

      this.$plugin = this.$form.data('jqForm');
      spyOn(this.$plugin, 'validate').andReturn(true);
      spyOn(this.$plugin, 'submit');

      expect(this.$plugin.$form.on).toHaveBeenCalledWith('submit.jqForm', jasmine.any(Function));
      this.$plugin.$form.trigger('submit');
      expect(this.$plugin.submit).not.toHaveBeenCalled();
    });

    it("should submit form if ajax submission is enabled", function() {
      this.$input = $('<input type="text"/>');
      this.$form.append(this.$input);

      this.$form.jqForm({
        ajaxSubmit: true
      });

      this.$plugin = this.$form.data('jqForm');
      spyOn(this.$plugin, 'validate').andReturn(true);
      spyOn(this.$plugin, 'submit');

      expect(this.$plugin.$form.on).toHaveBeenCalledWith('submit.jqForm', jasmine.any(Function));
      this.$plugin.$form.trigger('submit');
      expect(this.$plugin.submit).toHaveBeenCalled();
    });
  });

  describe('jqForm: check user events', function() {
    beforeEach(function() {
      this.$input = $('<input type="text"/>');
      this.$form.append(this.$input);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');

      spyOn(this.$plugin, 'check');
    });

    it('should check item on keyup event', function() {
      var event = jQuery.Event('keyup');
      event.srcElement = this.$input;

      this.$input.trigger(event);
      expect(this.$plugin.check).toHaveBeenCalledWith(this.$input);
    });

    it('should not check item on keyup event if item is input[type=button]', function() {
      var $button = $('<input type="button"/>');
      var event = jQuery.Event('keyup');
      event.srcElement = $button;

      this.$input.trigger(event);
      expect(this.$plugin.check).not.toHaveBeenCalled();
    });

    it('should not check item on keyup event if item is input[type=image]', function() {
      var $button = $('<input type="image"/>');
      var event = jQuery.Event('keyup');
      event.srcElement = $button;

      this.$input.trigger(event);
      expect(this.$plugin.check).not.toHaveBeenCalled();
    });

    it('should not check item on keyup event if item is input[type=reset]', function() {
      var $button = $('<input type="reset"/>');
      var event = jQuery.Event('keyup');
      event.srcElement = $button;

      this.$input.trigger(event);
      expect(this.$plugin.check).not.toHaveBeenCalled();
    });

    it('should not check item on keyup event if item is a button', function() {
      var $button = $('<button></button>');
      var event = jQuery.Event('keyup');
      event.srcElement = $button;

      this.$input.trigger(event);
      expect(this.$plugin.check).not.toHaveBeenCalled();
    });

    it('should check item on change event', function() {
      var event = jQuery.Event('change');
      event.srcElement = this.$input;

      this.$input.trigger(event);
      expect(this.$plugin.check).toHaveBeenCalledWith(this.$input);
      expect(this.$form.hasClass('dirty')).toBe(true);
      expect(this.$input.hasClass('dirty')).toBe(true);
    });

    it('should check item on focusout event', function() {
      var event = jQuery.Event('focusout');
      event.srcElement = this.$input;

      this.$input.trigger(event);
      expect(this.$plugin.check).toHaveBeenCalledWith(this.$input);
    });

    it('should not check item on focusout event if item is input[type=button]', function() {
      var $button = $('<input type="button"/>');
      var event = jQuery.Event('focusout');
      event.srcElement = $button;

      this.$input.trigger(event);
      expect(this.$plugin.check).not.toHaveBeenCalled();
    });

    it('should not check item on focusout event if item is input[type=image]', function() {
      var $button = $('<input type="image"/>');
      var event = jQuery.Event('focusout');
      event.srcElement = $button;

      this.$input.trigger(event);
      expect(this.$plugin.check).not.toHaveBeenCalled();
    });

    it('should not check item on focusout event if item is input[type=reset]', function() {
      var $button = $('<input type="reset"/>');
      var event = jQuery.Event('focusout');
      event.srcElement = $button;

      this.$input.trigger(event);
      expect(this.$plugin.check).not.toHaveBeenCalled();
    });

    it('should not check item on focusout event if item is a button', function() {
      var $button = $('<button></button>');
      var event = jQuery.Event('focusout');
      event.srcElement = $button;

      this.$input.trigger(event);
      expect(this.$plugin.check).not.toHaveBeenCalled();
    });

    it('should not submit if form is not valid', function() {
      var event = jQuery.Event('submit');
      spyOn(this.$plugin, 'validate').andReturn(false);
      spyOn(this.$plugin, 'submit');

      this.$form.trigger(event);
      expect(this.$form.hasClass('submitted')).toBe(true);
      expect(this.$plugin.validate).toHaveBeenCalled();
      expect(this.$plugin.submit).not.toHaveBeenCalled();
    });

    it('should submit if form is valid', function() {
      var event = jQuery.Event('submit');
      spyOn(this.$plugin, 'validate').andReturn(true);
      spyOn(this.$plugin, 'submit');

      this.$form.trigger(event);
      expect(this.$form.hasClass('submitted')).toBe(true);
      expect(this.$plugin.validate).toHaveBeenCalled();
      expect(this.$plugin.submit).toHaveBeenCalled();
    });
  });

  describe('jqForm: check submit', function() {
    beforeEach(function() {
      this.$form.attr('action', '/foo');
      this.$form.attr('method', 'POST');

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');

      this.datas = 'foo=bar';
      this.xhr = jasmine.createSpyObj('xhr', ['done', 'fail', 'always']);
      spyOn($.fn, 'serialize').andReturn(this.datas);
      spyOn($, 'ajax').andReturn(this.xhr);
    });

    it('should submit form', function() {
      this.$plugin.submit();

      expect($.ajax).toHaveBeenCalledWith({
        url: '/foo',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: this.datas
      });

      expect(this.$plugin.xhr).toBe(this.xhr);
      expect(this.$plugin.xhr.done).toHaveBeenCalled();
      expect(this.$plugin.xhr.fail).toHaveBeenCalled();
      expect(this.$plugin.xhr.always).toHaveBeenCalled();

      spyOn(this.$plugin.opts, 'onSubmitSuccess');
      this.$plugin.xhr.done.argsForCall[0][0]('foobar');
      expect(this.$plugin.opts.onSubmitSuccess).toHaveBeenCalledWith('foobar');
      expect(this.$plugin.xhr).not.toBe(null);

      spyOn(this.$plugin.opts, 'onSubmitError');
      this.$plugin.xhr.fail.argsForCall[0][0]();
      expect(this.$plugin.opts.onSubmitError).toHaveBeenCalled();
      expect(this.$plugin.xhr).not.toBe(null);

      spyOn(this.$plugin.opts, 'onSubmitComplete');
      this.$plugin.xhr.always.argsForCall[0][0]();
      expect(this.$plugin.opts.onSubmitComplete).toHaveBeenCalled();
      expect(this.$plugin.xhr).toBe(null);
    });

    it('should not submit form during submit', function() {
      this.$plugin.xhr = {};
      this.$plugin.submit();
      expect($.ajax).not.toHaveBeenCalled();
    });
  });

  describe('jqForm: check custom validation', function() {
    it("should detect custom validation", function() {
      this.$input = $('<input type="text" />');
      this.$form.append(this.$input);

      var customIsValid = jasmine.createSpy('isValid').andReturn(false);
      this.$form.jqForm({
        isValid: customIsValid
      });

      this.$plugin = this.$form.data('jqForm');
      var result = this.$plugin.validate();
      expect(result).toBe(false);
      expect(this.$plugin.errors.$$custom).toBe(true);
    });
  });

  describe('jqForm: check focus on error', function() {
    it("should detect custom validation", function() {
      spyOn($.fn, 'focus').andCallThrough();
      this.$input = $('<input type="text" required="required" />');
      this.$form.append(this.$input);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      var result = this.$plugin.validate();
      expect(result).toBe(false);
      expect(this.$input.focus).toHaveBeenCalled();
    });
  });

  describe('jqForm: check text input', function() {
    beforeEach(function() {
      this.$input = $('<input type="text" name="input-text"/>');
      this.$form.append(this.$input);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if text is empty', function() {
      this.$input.attr('required', 'required');
      this.$input.val('');

      var errors = this.$plugin.check(this.$input);

      expect(this.$input.attr('data-name')).toBe('inputText');
      expect(this.$input.hasClass('error')).toBe(true);
      expect(this.$input.hasClass('error-required')).toBe(true);
      expect(this.$input.hasClass('error-min-length')).toBe(false);
      expect(this.$input.hasClass('error-max-length')).toBe(false);
      expect(this.$input.hasClass('error-pattern')).toBe(false);
      expect(this.$input.hasClass('error-same-as')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputText']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputText : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputText'].css('display')).toBe('block');
      expect(this.$errors['inputText'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min-length error if text is too small', function() {
      this.$input.attr('data-min-length', '5');
      this.$input.val('foo');

      var errors = this.$plugin.check(this.$input);

      expect(this.$input.attr).toHaveBeenCalledWith('data-name', 'inputText');
      expect(this.$input.hasClass('error')).toBe(true);
      expect(this.$input.hasClass('error-required')).toBe(false);
      expect(this.$input.hasClass('error-min-length')).toBe(true);
      expect(this.$input.hasClass('error-max-length')).toBe(false);
      expect(this.$input.hasClass('error-pattern')).toBe(false);
      expect(this.$input.hasClass('error-same-as')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputText']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputText : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'minlength',
        label: 'Text must be at least 5 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputText'].css('display')).toBe('block');
      expect(this.$errors['inputText'].html()).toBe('Text must be at least 5 characters');
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add max-length error if text is too big', function() {
      this.$input.attr('maxlength', '5');
      this.$input.val('foobar');

      var errors = this.$plugin.check(this.$input);

      expect(this.$input.attr).toHaveBeenCalledWith('data-name', 'inputText');
      expect(this.$input.hasClass('error')).toBe(true);
      expect(this.$input.hasClass('error-required')).toBe(false);
      expect(this.$input.hasClass('error-min-length')).toBe(false);
      expect(this.$input.hasClass('error-max-length')).toBe(true);
      expect(this.$input.hasClass('error-pattern')).toBe(false);
      expect(this.$input.hasClass('error-same-as')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputText']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputText : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'maxlength',
        label: 'Text must be at most 5 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputText'].css('display')).toBe('block');
      expect(this.$errors['inputText'].html()).toBe('Text must be at most 5 characters');
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add pattern error if text is not valid', function() {
      this.$input.attr('pattern', '[0-9]+');
      this.$input.val('foobar');

      var errors = this.$plugin.check(this.$input);

      expect(this.$input.attr).toHaveBeenCalledWith('data-name', 'inputText');
      expect(this.$input.hasClass('error')).toBe(true);
      expect(this.$input.hasClass('error-required')).toBe(false);
      expect(this.$input.hasClass('error-min-length')).toBe(false);
      expect(this.$input.hasClass('error-max-length')).toBe(false);
      expect(this.$input.hasClass('error-pattern')).toBe(true);
      expect(this.$input.hasClass('error-same-as')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputText']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputText : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'pattern',
        label: 'Please match the requested format'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputText'].css('display')).toBe('block');
      expect(this.$errors['inputText'].html()).toBe('Please match the requested format');
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add same-as error if text not the same as another input', function() {
      var $input = $('<input id="foo-input" title="foo input" type="text" />');
      $input.val('foo');
      this.$form.append($input);

      this.$input.attr('data-same-as', '#foo-input');
      this.$input.val('bar');

      var errors = this.$plugin.check(this.$input);

      expect(this.$input.attr('data-name')).toBe('inputText');
      expect(this.$input.hasClass('error')).toBe(true);
      expect(this.$input.hasClass('error-required')).toBe(false);
      expect(this.$input.hasClass('error-min-length')).toBe(false);
      expect(this.$input.hasClass('error-max-length')).toBe(false);
      expect(this.$input.hasClass('error-pattern')).toBe(false);
      expect(this.$input.hasClass('error-same-as')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputText']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputText : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'sameAs',
        label: 'Value must match foo input'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputText'].css('display')).toBe('block');
      expect(this.$errors['inputText'].html()).toBe('Value must match foo input');
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputText'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check checkbox input', function() {
    beforeEach(function() {
      this.$input = $('<input type="checkbox" name="input-checkbox"/>');
      this.$form.append(this.$input);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if checkbox is not checked', function() {
      this.$input.attr('required', 'required');
      this.$input.val('foo');
      this.$input.removeAttr('checked');

      var errors = this.$plugin.check(this.$input);

      expect(this.$input.attr('data-name')).toBe('inputCheckbox');
      expect(this.$input.hasClass('error')).toBe(true);
      expect(this.$input.hasClass('error-required')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputCheckbox']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputCheckbox: true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputCheckbox'].css('display')).toBe('block');
      expect(this.$errors['inputCheckbox'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputCheckbox'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputCheckbox'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check radios input', function() {
    beforeEach(function() {
      this.$radio1 = $('<input type="radio" name="input-radio" value="foo"/>');
      this.$radio2 = $('<input type="radio" name="input-radio" value="bar"/>');
      this.$form.append(this.$radio1);
      this.$form.append(this.$radio2);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if no radios are selected', function() {
      this.$radio1.attr('required', 'required');
      this.$radio2.attr('required', 'required');

      var errors = this.$plugin.check(this.$radio1);

      expect(this.$radio1.attr('data-name')).toBe('inputRadio');
      expect(this.$radio1.hasClass('error')).toBe(true);
      expect(this.$radio1.hasClass('error-required')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputRadio']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputRadio: true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputRadio'].css('display')).toBe('block');
      expect(this.$errors['inputRadio'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputRadio'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputRadio'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check textarea', function() {
    beforeEach(function() {
      this.$textarea = $('<textarea name="textarea"></textarea>');
      this.$form.append(this.$textarea);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if textarea is empty', function() {
      this.$textarea.attr('required', 'required');
      this.$textarea.val('');

      var errors = this.$plugin.check(this.$textarea);

      expect(this.$textarea.attr('data-name')).toBe('textarea');
      expect(this.$textarea.hasClass('error')).toBe(true);
      expect(this.$textarea.hasClass('error-required')).toBe(true);
      expect(this.$textarea.hasClass('error-min-length')).toBe(false);
      expect(this.$textarea.hasClass('error-max-length')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['textarea']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        textarea : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['textarea'].css('display')).toBe('block');
      expect(this.$errors['textarea'].html()).toBe('Please fill out this field');
      expect(this.$errors['textarea'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['textarea'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min-length error if textarea is too small', function() {
      this.$textarea.attr('data-min-length', '5');
      this.$textarea.val('foo');

      var errors = this.$plugin.check(this.$textarea);

      expect(this.$textarea.attr('data-name')).toBe('textarea');
      expect(this.$textarea.hasClass('error')).toBe(true);
      expect(this.$textarea.hasClass('error-required')).toBe(false);
      expect(this.$textarea.hasClass('error-min-length')).toBe(true);
      expect(this.$textarea.hasClass('error-max-length')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['textarea']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        textarea : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'minlength',
        label: 'Text must be at least 5 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['textarea'].css('display')).toBe('block');
      expect(this.$errors['textarea'].html()).toBe('Text must be at least 5 characters');
      expect(this.$errors['textarea'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['textarea'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add max-length error if textarea is too big', function() {
      this.$textarea.attr('maxlength', '3');
      this.$textarea.val('foobar');

      var errors = this.$plugin.check(this.$textarea);

      expect(this.$textarea.attr('data-name')).toBe('textarea');
      expect(this.$textarea.hasClass('error')).toBe(true);
      expect(this.$textarea.hasClass('error-required')).toBe(false);
      expect(this.$textarea.hasClass('error-min-length')).toBe(false);
      expect(this.$textarea.hasClass('error-max-length')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['textarea']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        textarea : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'maxlength',
        label: 'Text must be at most 3 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['textarea'].css('display')).toBe('block');
      expect(this.$errors['textarea'].html()).toBe('Text must be at most 3 characters');
      expect(this.$errors['textarea'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['textarea'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check select', function() {
    beforeEach(function() {
      this.$select = $('<select name="select"></select>');
      this.$optionEmpty = $('<option value=""></option>');
      this.$option1 = $('<option value="0">O</option>');
      this.$option2 = $('<option value="1">1</option>');
      this.$select.append(this.$optionEmpty);
      this.$select.append(this.$option1);
      this.$select.append(this.$option2);

      this.$form.append(this.$select);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if textarea is empty', function() {
      this.$select.attr('required', 'required');
      this.$select.val('');

      var errors = this.$plugin.check(this.$select);

      expect(this.$select.attr('data-name')).toBe('select');
      expect(this.$select.hasClass('error')).toBe(true);
      expect(this.$select.hasClass('error-required')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['select']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        select : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['select'].css('display')).toBe('block');
      expect(this.$errors['select'].html()).toBe('Please fill out this field');
      expect(this.$errors['select'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['select'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check password input', function() {
    beforeEach(function() {
      this.$password = $('<input type="password" name="input-password"/>')
      this.$form.append(this.$password);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if password is empty', function() {
      this.$password.attr('required', 'required');
      this.$password.val('');

      var errors = this.$plugin.check(this.$password);

      expect(this.$password.attr('data-name')).toBe('inputPassword');
      expect(this.$password.hasClass('error')).toBe(true);
      expect(this.$password.hasClass('error-required')).toBe(true);
      expect(this.$password.hasClass('error-min-length')).toBe(false);
      expect(this.$password.hasClass('error-max-length')).toBe(false);
      expect(this.$password.hasClass('error-same-as')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputPassword']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputPassword : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputPassword'].css('display')).toBe('block');
      expect(this.$errors['inputPassword'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputPassword'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputPassword'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min-lengt error if password is too small', function() {
      this.$password.attr('data-min-length', '5');
      this.$password.val('foo');

      var errors = this.$plugin.check(this.$password);

      expect(this.$password.attr('data-name')).toBe('inputPassword');
      expect(this.$password.hasClass('error')).toBe(true);
      expect(this.$password.hasClass('error-required')).toBe(false);
      expect(this.$password.hasClass('error-min-length')).toBe(true);
      expect(this.$password.hasClass('error-max-length')).toBe(false);
      expect(this.$password.hasClass('error-same-as')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputPassword']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputPassword : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'minlength',
        label: 'Text must be at least 5 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputPassword'].css('display')).toBe('block');
      expect(this.$errors['inputPassword'].html()).toBe('Text must be at least 5 characters');
      expect(this.$errors['inputPassword'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputPassword'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min-length error if password is too big', function() {
      this.$password.attr('maxlength', '3');
      this.$password.val('foobar');

      var errors = this.$plugin.check(this.$password);

      expect(this.$password.attr('data-name')).toBe('inputPassword');
      expect(this.$password.hasClass('error')).toBe(true);
      expect(this.$password.hasClass('error-required')).toBe(false);
      expect(this.$password.hasClass('error-min-length')).toBe(false);
      expect(this.$password.hasClass('error-max-length')).toBe(true);
      expect(this.$password.hasClass('error-same-as')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputPassword']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputPassword : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'maxlength',
        label: 'Text must be at most 3 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputPassword'].css('display')).toBe('block');
      expect(this.$errors['inputPassword'].html()).toBe('Text must be at most 3 characters');
      expect(this.$errors['inputPassword'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputPassword'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add same-as error if password not the same as another input', function() {
      var $input = $('<input id="foo-input" title="foo input" type="text" />');
      $input.val('foo');
      this.$form.append($input);

      this.$password.attr('data-same-as', '#foo-input');
      this.$password.val('bar');

      var errors = this.$plugin.check(this.$password);

      expect(this.$password.attr('data-name')).toBe('inputPassword');
      expect(this.$password.hasClass('error')).toBe(true);
      expect(this.$password.hasClass('error-required')).toBe(false);
      expect(this.$password.hasClass('error-min-length')).toBe(false);
      expect(this.$password.hasClass('error-max-length')).toBe(false);
      expect(this.$password.hasClass('error-same-as')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputPassword']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputPassword : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'sameAs',
        label: 'Value must match foo input'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputPassword'].css('display')).toBe('block');
      expect(this.$errors['inputPassword'].html()).toBe('Value must match foo input');
      expect(this.$errors['inputPassword'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputPassword'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check email input', function() {
    beforeEach(function() {
      this.$email = $('<input type="email" name="input-email"/>')
      this.$form.append(this.$email);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if email is empty', function() {
      this.$email.attr('required', 'required');
      this.$email.val('');

      var errors = this.$plugin.check(this.$email);

      expect(this.$email.attr('data-name')).toBe('inputEmail');
      expect(this.$email.hasClass('error')).toBe(true);
      expect(this.$email.hasClass('error-required')).toBe(true);
      expect(this.$email.hasClass('error-min-length')).toBe(false);
      expect(this.$email.hasClass('error-max-length')).toBe(false);
      expect(this.$email.hasClass('error-same-as')).toBe(false);
      expect(this.$email.hasClass('error-email-multiple')).toBe(false);
      expect(this.$email.hasClass('error-email-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputEmail']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputEmail : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputEmail'].css('display')).toBe('block');
      expect(this.$errors['inputEmail'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min-length error if email is too small', function() {
      this.$email.attr('data-min-length', '15');
      this.$email.val('foo@gmail.com');

      var errors = this.$plugin.check(this.$email);

      expect(this.$email.attr('data-name')).toBe('inputEmail');
      expect(this.$email.hasClass('error')).toBe(true);
      expect(this.$email.hasClass('error-required')).toBe(false);
      expect(this.$email.hasClass('error-min-length')).toBe(true);
      expect(this.$email.hasClass('error-max-length')).toBe(false);
      expect(this.$email.hasClass('error-same-as')).toBe(false);
      expect(this.$email.hasClass('error-email-multiple')).toBe(false);
      expect(this.$email.hasClass('error-email-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputEmail']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputEmail : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'minlength',
        label: 'Text must be at least 15 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputEmail'].css('display')).toBe('block');
      expect(this.$errors['inputEmail'].html()).toBe('Text must be at least 15 characters');
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add max-length error if email is too big', function() {
      this.$email.attr('maxlength', '10');
      this.$email.val('foo@gmail.com');

      var errors = this.$plugin.check(this.$email);

      expect(this.$email.attr('data-name')).toBe('inputEmail');
      expect(this.$email.hasClass('error')).toBe(true);
      expect(this.$email.hasClass('error-required')).toBe(false);
      expect(this.$email.hasClass('error-min-length')).toBe(false);
      expect(this.$email.hasClass('error-max-length')).toBe(true);
      expect(this.$email.hasClass('error-same-as')).toBe(false);
      expect(this.$email.hasClass('error-email-multiple')).toBe(false);
      expect(this.$email.hasClass('error-email-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputEmail']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputEmail : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'maxlength',
        label: 'Text must be at most 10 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputEmail'].css('display')).toBe('block');
      expect(this.$errors['inputEmail'].html()).toBe('Text must be at most 10 characters');
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add same-as error if text not the same as another input', function() {
      var $input = $('<input id="foo-input" title="foo input" type="text" />');
      $input.val('foo@gmail.com');
      this.$form.append($input);

      this.$email.attr('data-same-as', '#foo-input');
      this.$email.val('bar@gmail.com');

      var errors = this.$plugin.check(this.$email);

      expect(this.$email.attr('data-name')).toBe('inputEmail');
      expect(this.$email.hasClass('error')).toBe(true);
      expect(this.$email.hasClass('error-required')).toBe(false);
      expect(this.$email.hasClass('error-min-length')).toBe(false);
      expect(this.$email.hasClass('error-max-length')).toBe(false);
      expect(this.$email.hasClass('error-same-as')).toBe(true);
      expect(this.$email.hasClass('error-email-multiple')).toBe(false);
      expect(this.$email.hasClass('error-email-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputEmail']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputEmail : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'sameAs',
        label: 'Value must match foo input'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputEmail'].css('display')).toBe('block');
      expect(this.$errors['inputEmail'].html()).toBe('Value must match foo input');
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add email-multiple error if user typed several email and multiple is not set', function() {
      this.$email.val('foo@gmail.com, bar@gmail.com');

      var errors = this.$plugin.check(this.$email);

      expect(this.$email.attr('data-name')).toBe('inputEmail');
      expect(this.$email.hasClass('error')).toBe(true);
      expect(this.$email.hasClass('error-required')).toBe(false);
      expect(this.$email.hasClass('error-min-length')).toBe(false);
      expect(this.$email.hasClass('error-max-length')).toBe(false);
      expect(this.$email.hasClass('error-same-as')).toBe(false);
      expect(this.$email.hasClass('error-email-multiple')).toBe(true);
      expect(this.$email.hasClass('error-email-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputEmail']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputEmail : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'emailMultiple',
        label: 'Multiple email address is not allowed'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputEmail'].css('display')).toBe('block');
      expect(this.$errors['inputEmail'].html()).toBe('Multiple email address is not allowed');
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add email-pattern error if email is not valid', function() {
      this.$email.attr('maxlength', '10');
      this.$email.val('@gmail.com');

      var errors = this.$plugin.check(this.$email);

      expect(this.$email.attr('data-name')).toBe('inputEmail');
      expect(this.$email.hasClass('error')).toBe(true);
      expect(this.$email.hasClass('error-required')).toBe(false);
      expect(this.$email.hasClass('error-min-length')).toBe(false);
      expect(this.$email.hasClass('error-max-length')).toBe(false);
      expect(this.$email.hasClass('error-same-as')).toBe(false);
      expect(this.$email.hasClass('error-email-multiple')).toBe(false);
      expect(this.$email.hasClass('error-email-pattern')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputEmail']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputEmail : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'email',
        label: 'Please enter an email address'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputEmail'].css('display')).toBe('block');
      expect(this.$errors['inputEmail'].html()).toBe('Please enter an email address');
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputEmail'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check url input', function() {
    beforeEach(function() {
      this.$url = $('<input type="url" name="input-url"/>')
      this.$form.append(this.$url);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if url is empty', function() {
      this.$url.attr('required', 'required');
      this.$url.val('');

      var errors = this.$plugin.check(this.$url);

      expect(this.$url.attr('data-name')).toBe('inputUrl');
      expect(this.$url.hasClass('error')).toBe(true);
      expect(this.$url.hasClass('error-required')).toBe(true);
      expect(this.$url.hasClass('error-min-length')).toBe(false);
      expect(this.$url.hasClass('error-max-length')).toBe(false);
      expect(this.$url.hasClass('error-same-as')).toBe(false);
      expect(this.$url.hasClass('error-pattern')).toBe(false);
      expect(this.$url.hasClass('error-url-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputUrl']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputUrl : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputUrl'].css('display')).toBe('block');
      expect(this.$errors['inputUrl'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min-length error if url is too small', function() {
      this.$url.attr('data-min-length', '50');
      this.$url.val('http://www.google.fr');

      var errors = this.$plugin.check(this.$url);

      expect(this.$url.attr('data-name')).toBe('inputUrl');
      expect(this.$url.hasClass('error')).toBe(true);
      expect(this.$url.hasClass('error-required')).toBe(false);
      expect(this.$url.hasClass('error-min-length')).toBe(true);
      expect(this.$url.hasClass('error-max-length')).toBe(false);
      expect(this.$url.hasClass('error-same-as')).toBe(false);
      expect(this.$url.hasClass('error-pattern')).toBe(false);
      expect(this.$url.hasClass('error-url-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputUrl']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputUrl : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'minlength',
        label: 'Text must be at least 50 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputUrl'].css('display')).toBe('block');
      expect(this.$errors['inputUrl'].html()).toBe('Text must be at least 50 characters');
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add max-length error if url is too big', function() {
      this.$url.attr('maxlength', '15');
      this.$url.val('http://www.google.fr');

      var errors = this.$plugin.check(this.$url);

      expect(this.$url.attr('data-name')).toBe('inputUrl');
      expect(this.$url.hasClass('error')).toBe(true);
      expect(this.$url.hasClass('error-required')).toBe(false);
      expect(this.$url.hasClass('error-min-length')).toBe(false);
      expect(this.$url.hasClass('error-max-length')).toBe(true);
      expect(this.$url.hasClass('error-same-as')).toBe(false);
      expect(this.$url.hasClass('error-pattern')).toBe(false);
      expect(this.$url.hasClass('error-url-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputUrl']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputUrl : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'maxlength',
        label: 'Text must be at most 15 characters'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputUrl'].css('display')).toBe('block');
      expect(this.$errors['inputUrl'].html()).toBe('Text must be at most 15 characters');
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add same-as error if text not the same as another input', function() {
      var $input = $('<input id="foo-input" title="foo input" type="text" />');
      $input.val('http://www.google.fr');
      this.$form.append($input);

      this.$url.attr('data-same-as', '#foo-input');
      this.$url.val('https://www.google.fr');

      var errors = this.$plugin.check(this.$url);

      expect(this.$url.attr('data-name')).toBe('inputUrl');
      expect(this.$url.hasClass('error')).toBe(true);
      expect(this.$url.hasClass('error-required')).toBe(false);
      expect(this.$url.hasClass('error-min-length')).toBe(false);
      expect(this.$url.hasClass('error-max-length')).toBe(false);
      expect(this.$url.hasClass('error-same-as')).toBe(true);
      expect(this.$url.hasClass('error-pattern')).toBe(false);
      expect(this.$url.hasClass('error-url-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputUrl']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputUrl : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'sameAs',
        label: 'Value must match foo input'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputUrl'].css('display')).toBe('block');
      expect(this.$errors['inputUrl'].html()).toBe('Value must match foo input');
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add pattern error if text is not valid', function() {
      this.$url.attr('pattern', 'https://[A-Z\\.]+');
      this.$url.val('http://www.google.fr');

      var errors = this.$plugin.check(this.$url);

      expect(this.$url.attr).toHaveBeenCalledWith('data-name', 'inputUrl');
      expect(this.$url.hasClass('error')).toBe(true);
      expect(this.$url.hasClass('error-required')).toBe(false);
      expect(this.$url.hasClass('error-min-length')).toBe(false);
      expect(this.$url.hasClass('error-max-length')).toBe(false);
      expect(this.$url.hasClass('error-same-as')).toBe(false);
      expect(this.$url.hasClass('error-pattern')).toBe(true);
      expect(this.$url.hasClass('error-url-pattern')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputUrl']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputUrl : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'pattern',
        label: 'Please match the requested format'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputUrl'].css('display')).toBe('block');
      expect(this.$errors['inputUrl'].html()).toBe('Please match the requested format');
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add url-pattern error if url is not valid', function() {
      this.$url.val('google');

      var errors = this.$plugin.check(this.$url);

      expect(this.$url.attr('data-name')).toBe('inputUrl');
      expect(this.$url.hasClass('error')).toBe(true);
      expect(this.$url.hasClass('error-required')).toBe(false);
      expect(this.$url.hasClass('error-min-length')).toBe(false);
      expect(this.$url.hasClass('error-max-length')).toBe(false);
      expect(this.$url.hasClass('error-same-as')).toBe(false);
      expect(this.$url.hasClass('error-pattern')).toBe(false);
      expect(this.$url.hasClass('error-url-pattern')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputUrl']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputUrl : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'url',
        label: 'Please enter an URL'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputUrl'].css('display')).toBe('block');
      expect(this.$errors['inputUrl'].html()).toBe('Please enter an URL');
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputUrl'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check number input', function() {
    beforeEach(function() {
      this.$number = $('<input type="number" name="input-number"/>')
      this.$form.append(this.$number);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if number is empty', function() {
      this.$number.attr('required', 'required');
      this.$number.val('');

      var errors = this.$plugin.check(this.$number);

      expect(this.$number.attr('data-name')).toBe('inputNumber');
      expect(this.$number.hasClass('error')).toBe(true);
      expect(this.$number.hasClass('error-required')).toBe(true);
      expect(this.$number.hasClass('error-min')).toBe(false);
      expect(this.$number.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputNumber']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputNumber : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputNumber'].css('display')).toBe('block');
      expect(this.$errors['inputNumber'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputNumber'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputNumber'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min error if number is less than min value', function() {
      this.$number.attr('min', '0');
      this.$number.val('-1');

      var errors = this.$plugin.check(this.$number);

      expect(this.$number.attr('data-name')).toBe('inputNumber');
      expect(this.$number.hasClass('error')).toBe(true);
      expect(this.$number.hasClass('error-required')).toBe(false);
      expect(this.$number.hasClass('error-min')).toBe(true);
      expect(this.$number.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputNumber']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputNumber : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'min',
        label: 'Value must be greater than or equal to 0'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputNumber'].css('display')).toBe('block');
      expect(this.$errors['inputNumber'].html()).toBe('Value must be greater than or equal to 0');
      expect(this.$errors['inputNumber'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputNumber'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add max error if number is greater than max value', function() {
      this.$number.attr('max', '0');
      this.$number.val('1');

      var errors = this.$plugin.check(this.$number);

      expect(this.$number.attr('data-name')).toBe('inputNumber');
      expect(this.$number.hasClass('error')).toBe(true);
      expect(this.$number.hasClass('error-required')).toBe(false);
      expect(this.$number.hasClass('error-min')).toBe(false);
      expect(this.$number.hasClass('error-max')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputNumber']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputNumber : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'max',
        label: 'Value must be less than or equal to 0'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputNumber'].css('display')).toBe('block');
      expect(this.$errors['inputNumber'].html()).toBe('Value must be less than or equal to 0');
      expect(this.$errors['inputNumber'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputNumber'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check date input', function() {
    beforeEach(function() {
      // Use text input to set value
      this.$date = $('<input type="date" name="input-date" />');
      this.$form.append(this.$date);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if date is empty', function() {
      this.$date.attr('required', 'required');
      this.$date.val('');

      var errors = this.$plugin.check(this.$date);

      expect(this.$date.attr('data-name')).toBe('inputDate');
      expect(this.$date.hasClass('error')).toBe(true);
      expect(this.$date.hasClass('error-required')).toBe(true);
      expect(this.$date.hasClass('error-date-pattern')).toBe(false);
      expect(this.$date.hasClass('error-date-invalid')).toBe(false);
      expect(this.$date.hasClass('error-min')).toBe(false);
      expect(this.$date.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputDate']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputDate : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputDate'].css('display')).toBe('block');
      expect(this.$errors['inputDate'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add date-pattern error if date is not valid', function() {
      spyOn($.fn, 'val').andReturn('2013-1-1');

      var errors = this.$plugin.check(this.$date);

      expect(this.$date.attr('data-name')).toBe('inputDate');
      expect(this.$date.hasClass('error')).toBe(true);
      expect(this.$date.hasClass('error-required')).toBe(false);
      expect(this.$date.hasClass('error-date-pattern')).toBe(true);
      expect(this.$date.hasClass('error-date-invalid')).toBe(false);
      expect(this.$date.hasClass('error-min')).toBe(false);
      expect(this.$date.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputDate']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputDate : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'date',
        label: 'Please enter a date'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputDate'].css('display')).toBe('block');
      expect(this.$errors['inputDate'].html()).toBe('Please enter a date');
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add date-invalid error if date is not valid', function() {
      spyOn($.fn, 'val').andReturn('2013-02-30');

      var errors = this.$plugin.check(this.$date);

      expect(this.$date.attr('data-name')).toBe('inputDate');
      expect(this.$date.hasClass('error')).toBe(true);
      expect(this.$date.hasClass('error-required')).toBe(false);
      expect(this.$date.hasClass('error-date-pattern')).toBe(false);
      expect(this.$date.hasClass('error-date-invalid')).toBe(true);
      expect(this.$date.hasClass('error-min')).toBe(false);
      expect(this.$date.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputDate']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputDate : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'date',
        label: 'Please enter a date'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputDate'].css('display')).toBe('block');
      expect(this.$errors['inputDate'].html()).toBe('Please enter a date');
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min error if date is less than min value', function() {
      spyOn($.fn, 'val').andReturn('2013-01-01');
      this.$date.attr('min', '2013-01-05');

      var errors = this.$plugin.check(this.$date);

      expect(this.$date.attr('data-name')).toBe('inputDate');
      expect(this.$date.hasClass('error')).toBe(true);
      expect(this.$date.hasClass('error-required')).toBe(false);
      expect(this.$date.hasClass('error-date-pattern')).toBe(false);
      expect(this.$date.hasClass('error-date-invalid')).toBe(false);
      expect(this.$date.hasClass('error-min')).toBe(true);
      expect(this.$date.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputDate']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputDate : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'min',
        label: 'Value must be greater than or equal to 2013-01-05'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputDate'].css('display')).toBe('block');
      expect(this.$errors['inputDate'].html()).toBe('Value must be greater than or equal to 2013-01-05');
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min error if date is greater than max value', function() {
      spyOn($.fn, 'val').andReturn('2013-01-05');
      this.$date.attr('max', '2013-01-01');

      var errors = this.$plugin.check(this.$date);

      expect(this.$date.attr('data-name')).toBe('inputDate');
      expect(this.$date.hasClass('error')).toBe(true);
      expect(this.$date.hasClass('error-required')).toBe(false);
      expect(this.$date.hasClass('error-date-pattern')).toBe(false);
      expect(this.$date.hasClass('error-date-invalid')).toBe(false);
      expect(this.$date.hasClass('error-min')).toBe(false);
      expect(this.$date.hasClass('error-max')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputDate']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputDate : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'max',
        label: 'Value must be less than or equal to 2013-01-01'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputDate'].css('display')).toBe('block');
      expect(this.$errors['inputDate'].html()).toBe('Value must be less than or equal to 2013-01-01');
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputDate'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check month input', function() {
    beforeEach(function() {
      // Use text input to set value
      this.$month = $('<input type="month" name="input-month" />');
      this.$form.append(this.$month);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if date is empty', function() {
      this.$month.attr('required', 'required');
      this.$month.val('');

      var errors = this.$plugin.check(this.$month);

      expect(this.$month.attr('data-name')).toBe('inputMonth');
      expect(this.$month.hasClass('error')).toBe(true);
      expect(this.$month.hasClass('error-required')).toBe(true);
      expect(this.$month.hasClass('error-date-pattern')).toBe(false);
      expect(this.$month.hasClass('error-date-invalid')).toBe(false);
      expect(this.$month.hasClass('error-min')).toBe(false);
      expect(this.$month.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputMonth']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputMonth : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputMonth'].css('display')).toBe('block');
      expect(this.$errors['inputMonth'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add date-pattern error if date is not valid', function() {
      spyOn($.fn, 'val').andReturn('2013-1');

      var errors = this.$plugin.check(this.$month);

      expect(this.$month.attr('data-name')).toBe('inputMonth');
      expect(this.$month.hasClass('error')).toBe(true);
      expect(this.$month.hasClass('error-required')).toBe(false);
      expect(this.$month.hasClass('error-date-pattern')).toBe(true);
      expect(this.$month.hasClass('error-date-invalid')).toBe(false);
      expect(this.$month.hasClass('error-min')).toBe(false);
      expect(this.$month.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputMonth']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputMonth : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'date',
        label: 'Please enter a date'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputMonth'].css('display')).toBe('block');
      expect(this.$errors['inputMonth'].html()).toBe('Please enter a date');
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add date-invalid error if date is not valid', function() {
      spyOn($.fn, 'val').andReturn('2013-13');

      var errors = this.$plugin.check(this.$month);

      expect(this.$month.attr('data-name')).toBe('inputMonth');
      expect(this.$month.hasClass('error')).toBe(true);
      expect(this.$month.hasClass('error-required')).toBe(false);
      expect(this.$month.hasClass('error-date-pattern')).toBe(false);
      expect(this.$month.hasClass('error-date-invalid')).toBe(true);
      expect(this.$month.hasClass('error-min')).toBe(false);
      expect(this.$month.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputMonth']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputMonth : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'date',
        label: 'Please enter a date'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputMonth'].css('display')).toBe('block');
      expect(this.$errors['inputMonth'].html()).toBe('Please enter a date');
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min error if date is less than min value', function() {
      spyOn($.fn, 'val').andReturn('2013-01');
      this.$month.attr('min', '2013-02');

      var errors = this.$plugin.check(this.$month);

      expect(this.$month.attr('data-name')).toBe('inputMonth');
      expect(this.$month.hasClass('error')).toBe(true);
      expect(this.$month.hasClass('error-required')).toBe(false);
      expect(this.$month.hasClass('error-date-pattern')).toBe(false);
      expect(this.$month.hasClass('error-date-invalid')).toBe(false);
      expect(this.$month.hasClass('error-min')).toBe(true);
      expect(this.$month.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputMonth']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputMonth : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'min',
        label: 'Value must be greater than or equal to 2013-02-01'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputMonth'].css('display')).toBe('block');
      expect(this.$errors['inputMonth'].html()).toBe('Value must be greater than or equal to 2013-02-01');
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min error if date is greater than max value', function() {
      spyOn($.fn, 'val').andReturn('2013-02');
      this.$month.attr('max', '2013-01');

      var errors = this.$plugin.check(this.$month);

      expect(this.$month.attr('data-name')).toBe('inputMonth');
      expect(this.$month.hasClass('error')).toBe(true);
      expect(this.$month.hasClass('error-required')).toBe(false);
      expect(this.$month.hasClass('error-date-pattern')).toBe(false);
      expect(this.$month.hasClass('error-date-invalid')).toBe(false);
      expect(this.$month.hasClass('error-min')).toBe(false);
      expect(this.$month.hasClass('error-max')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputMonth']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputMonth : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'max',
        label: 'Value must be less than or equal to 2013-01-01'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputMonth'].css('display')).toBe('block');
      expect(this.$errors['inputMonth'].html()).toBe('Value must be less than or equal to 2013-01-01');
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputMonth'].css).toHaveBeenCalledWith('left', 20);
    });
  });

  describe('jqForm: check time input', function() {
    beforeEach(function() {
      // Use text input to set value
      this.$time = $('<input type="time" name="input-time" />');
      this.$form.append(this.$time);

      this.$form.jqForm();
      this.$plugin = this.$form.data('jqForm');
      this.$errors = this.$plugin.$errors;
    });

    it('should add required error if time is empty', function() {
      this.$time.attr('required', 'required');
      this.$time.val('');

      var errors = this.$plugin.check(this.$time);

      expect(this.$time.attr('data-name')).toBe('inputTime');
      expect(this.$time.hasClass('error')).toBe(true);
      expect(this.$time.hasClass('error-required')).toBe(true);
      expect(this.$time.hasClass('error-time-pattern')).toBe(false);
      expect(this.$time.hasClass('error-time-invalid')).toBe(false);
      expect(this.$time.hasClass('error-min')).toBe(false);
      expect(this.$time.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputTime']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputTime : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'required',
        label: 'Please fill out this field'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputTime'].css('display')).toBe('block');
      expect(this.$errors['inputTime'].html()).toBe('Please fill out this field');
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add time-pattern error if time is not valid', function() {
      spyOn($.fn, 'val').andReturn('00:1:1');

      var errors = this.$plugin.check(this.$time);

      expect(this.$time.attr('data-name')).toBe('inputTime');
      expect(this.$time.hasClass('error')).toBe(true);
      expect(this.$time.hasClass('error-required')).toBe(false);
      expect(this.$time.hasClass('error-time-pattern')).toBe(true);
      expect(this.$time.hasClass('error-time-invalid')).toBe(false);
      expect(this.$time.hasClass('error-min')).toBe(false);
      expect(this.$time.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputTime']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputTime : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'time',
        label: 'Please enter a time'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputTime'].css('display')).toBe('block');
      expect(this.$errors['inputTime'].html()).toBe('Please enter a time');
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith('left', 20);
    });

    xit('should add time-invalid error if time is not valid', function() {
      spyOn($.fn, 'val').andReturn('00:60:61');

      var errors = this.$plugin.check(this.$time);

      expect(this.$time.attr('data-name')).toBe('inputTime');
      expect(this.$time.hasClass('error')).toBe(true);
      expect(this.$time.hasClass('error-required')).toBe(false);
      expect(this.$time.hasClass('error-time-pattern')).toBe(false);
      expect(this.$time.hasClass('error-time-invalid')).toBe(false);
      expect(this.$time.hasClass('error-min')).toBe(false);
      expect(this.$time.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputTime']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputTime : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'time',
        label: 'Please enter a time'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputTime'].css('display')).toBe('block');
      expect(this.$errors['inputTime'].html()).toBe('Please enter a time');
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min error if time is less than min value', function() {
      spyOn($.fn, 'val').andReturn('01:00:00');
      this.$time.attr('min', '02:00:00');

      var errors = this.$plugin.check(this.$time);

      expect(this.$time.attr('data-name')).toBe('inputTime');
      expect(this.$time.hasClass('error')).toBe(true);
      expect(this.$time.hasClass('error-required')).toBe(false);
      expect(this.$time.hasClass('error-time-pattern')).toBe(false);
      expect(this.$time.hasClass('error-time-invalid')).toBe(false);
      expect(this.$time.hasClass('error-min')).toBe(true);
      expect(this.$time.hasClass('error-max')).toBe(false);

      // Check error cache
      expect(this.$plugin.errors['inputTime']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputTime : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'min',
        label: 'Value must be greater than or equal to 02:00:00'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputTime'].css('display')).toBe('block');
      expect(this.$errors['inputTime'].html()).toBe('Value must be greater than or equal to 02:00:00');
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith('left', 20);
    });

    it('should add min error if date is greater than max value', function() {
      spyOn($.fn, 'val').andReturn('02:00:00');
      this.$time.attr('max', '01:00:00');

      var errors = this.$plugin.check(this.$time);

      expect(this.$time.attr('data-name')).toBe('inputTime');
      expect(this.$time.hasClass('error')).toBe(true);
      expect(this.$time.hasClass('error-required')).toBe(false);
      expect(this.$time.hasClass('error-time-pattern')).toBe(false);
      expect(this.$time.hasClass('error-time-invalid')).toBe(false);
      expect(this.$time.hasClass('error-min')).toBe(false);
      expect(this.$time.hasClass('error-max')).toBe(true);

      // Check error cache
      expect(this.$plugin.errors['inputTime']).toBe(true);
      expect(this.$plugin.errors).toEqual({
        inputTime : true
      });

      // Check detected errors
      expect(errors).toEqual([{
        key: 'max',
        label: 'Value must be less than or equal to 01:00:00'
      }]);

      expect(this.$form.hasClass('error')).toBe(true);

      expect(this.$errors['inputTime'].css('display')).toBe('block');
      expect(this.$errors['inputTime'].html()).toBe('Value must be less than or equal to 01:00:00');
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith({
        display: '',
        top : 20
      });
      expect(this.$errors['inputTime'].css).toHaveBeenCalledWith('left', 20);
    });
  });
});
