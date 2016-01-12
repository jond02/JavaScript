$(function() {

WelcomeAdmin = (function() {
	"use strict";

	var count = 30,

	init = function() {

		$('.secAdd').on('click', function() {
			_addSection(this);
		});

		$('.secRemove').on('click', function() {
			_removeSection(this);
		});	
		
	},
	_addSection = function(that) {

		var par = $(that).parent(),
		div = document.createElement('div'),
		secHTML = '<input type="text" placeholder="Section title" class="form-control secTitle" name="secName ' + count + '" value="">' +
			 		'<textarea class="form-control welcText" name="parName ' + count + '"></textarea>',
		span1 = document.createElement('span'),
		span2 = document.createElement('span');

		$(span1).addClass('glyphicon glyphicon-plus secAdd');
		$(span2).addClass('glyphicon glyphicon-remove secRemove');
		$(div).addClass('secDiv').css('height', '0').html(secHTML);

		$(div).insertAfter(par);
		$(div).append(span1);
		$(div).append(span2);

		$(div).animate({
			'height' : '250px'
		});

		$(span1).on('click', function() {
			_addSection(this);
		});

		$(span2).on('click', function() {
			_removeSection(this);
		});	
		count++;
	},
	_removeSection = function(that) {

		var count = $(that).parents('.welcForm').children().length,
		div = $(that).parent(),
		title = $(that).siblings('.secTitle').val();
		title = title === '' ? 'not named' : title;

		if (count === 3) {

			alert("One section remaining, can't be deleted.");

		} else {

			if (confirm("Delete the " + title + " section?")) {
				
				$(div).animate({'height' : '0px'}, function() {
					$(div).remove();
				});

			}
		}
	}
	return {init : init};
})();

WelcomeAdmin.init();

});