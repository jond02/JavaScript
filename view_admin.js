var ViewAdmin;

$(function() {
	"use strict";
	
	ViewAdmin = (function() {
		var init = function() {
			
			//populate template
			_updateTemplate();
			
			$('.btn_section_add').on('click', function() {
				_addView(this);
			});
			
			$('.btn_section_edit').on('click', function() {
				_editView(this);
			});
			
			$('.btn_section_del').on('click', function() {
				_deleteView(this, 'Views');
			});
			
			$('.sel_template').on('change', function() {
				_updateTemplate();
			});
			
			$('.btn_template_add').on('click', function(){
				_templateAddView(this);
			});
			
			$('.btn_template_del').on('click', function(){
				_deleteView(this, 'Temp');
			});
			
			$('.menu_template').on('click', function(){
				_templateEdit(this);
			});

		},
		_templateEdit = function(that) {

			function closeDiv() {
				$($('.temp_edit_div')[0]).animate({'height' : '0','padding-top' : '0'}, function() {
					$(this).remove();
				});
			}

			if (!$('.temp_edit_div')[0]) {

			//load edit controls
			var div = document.createElement('div'),
				btnSave = document.createElement('input'),
				btnDel = document.createElement('input'),
				p = document.createElement('p'),
				inputTxt = document.createElement('input'),
				parent = $(that).parent();

			$(div).addClass('div_edit light_td temp_edit_div');
			
			$(p).addClass('p_edit').css({'margin-right' : '10px'}).html('Add: ');
			
			$(inputTxt).attr({ 'type' : 'text' }).addClass('form-control temp_edit_txt');
			
			$(btnSave).attr({
				'type' : 'button',
				'value' : 'Save'
			}).addClass('btn temp_edit_btn_add');

			$(btnDel).attr({
				'type' : 'button',
				'value' : 'Delete'
			}).addClass('btn temp_edit_btn_del');

			$(div).append(p).append(inputTxt).append(btnSave).append(btnDel);

			$(div).insertAfter(parent);
			
			$(div).animate({
				'height' : '50px',
				'padding-top' : '10px'
			}, 400);

		} else {
			closeDiv();
		}

			//Save button
			$(btnSave).on('click', function() {

				var tempName = $(inputTxt).val();

				//check if name already exists
				$('select[data-viewid="template"] option').each(function() {
					if ($(this).text() === tempName) {
						alert(tempName + ' already exists. Please enter a new name.');
						return;
					}
				});
				
				$.get("http://" + sgDir + "/php/viewAdminTemplateAdd.php?name=" + tempName, function(data) {
					if (isNaN(data)) {
						alert("There's been an error. Please reload page and try again.");
					} else {
						//update options
						var sel = $('select[data-viewid="template"]')[0],
							opt = document.createElement('option');
						
						//add to options
						$(opt).attr('value', data).html(tempName);
						$(sel).append(opt);
						$(sel).val(data);

						//add to var
						templateData[data + 'ids' + 1] = [];
						templateData[data + 'ids' + 2] = [];
						templateData[data + 'ids' + 3] = [];
						templateData[data + 'ids' + 4] = [];

						//load template
						_updateTemplate();
					}
				});

				closeDiv();	
			});

			$(btnDel).on('click', function() {

				var tempSel = $('.div_template p').children('select')[0],
				tempId = $(tempSel).val(),
				tempName = tempSel.options[tempSel.selectedIndex].text;

				if (confirm('Delete ' + tempName + '?')) {

					$.get("http://" + sgDir + "/php/viewAdminTemplateDelete.php?id=" + tempId, function(data) {
						if (data === 'false') {
							alert("There's been an error. Please reload page and try again.");
						}
					});

					//remove from options
					$(tempSel).children('option[value="' + tempId +'"]').remove();

					//load newly selected template
					_updateTemplate();

					closeDiv();	
				}

			});

		},
		_updateTemplate = function() {
			
			var tempSel = $('.div_template p').children('select')[0],
			tempId = $(tempSel).val(),
			pars = $('.div_template').children('.view_section'),
			j = 1;

			$.each(pars, function() {
				//empty options
				$(this).children('.views_select').empty();
				
				if (templateData[tempId + 'ids' + j] !== null) {
					//get options
					var optHTML = '';
					
					for (var i = 0; i < templateData[tempId + 'ids' + j].length; i++) {
						optHTML += '<option value="' + 
						//get id
						templateData[tempId + 'ids' + j][i] + '">' + 
						//get name
						viewData.viewLookup[templateData[tempId + 'ids' + j][i]] + 
						'</option>';
					}
					
					//add options
					$(this).children('.views_select').html(optHTML);
					j++;
				}
			});
			
		},
		_templateAddView = function(that) {
			
			var parent = _checkIfExists(that, 'Add');
			
			if (!parent) {
				return;
			}
			
			_createTempForm(that, parent);
			
		},
		_createTempForm = function(that, parent) {
			
			_updateButtons(that, 'Cancel', true);
			
			//load edit controls
			var div = document.createElement('div'),
				btn = document.createElement('input'),
				select = document.createElement('select'),
				p = document.createElement('p'),
				viewType = $(parent).data('viewtype');

			$(div).addClass('div_edit light_td');
			
			$(p).addClass('p_edit').css({'margin-right' : '10px'}).html('Add: ');

			$(select).addClass('form-control sel_edit').html(_createViewList(viewType, 'Temp'));
			$(btn).attr({
				'type' : 'button',
				'value' : 'Save'
			}).addClass('btn edit_btn');

			$(div).append(p).append(select).append(btn);
			$(parent).children('select').before(div);
			
			$(div).animate({
				'height' : '45px',
				'padding-top' : '10px'
			}, 400);

			//Save button
			$(btn).on('click', function() {

				var viewId = $(select).val(),
					ts = $('.div_template p').children('select')[0],
					tempId = $(ts).val();

				//check if view is already in list
				if (typeof templateData[tempId + 'ids' + viewType][viewId] !== 'undefined') {
					alert('View already exists, please select a new view to add.');
					return;
				}
				
				_updateButtons(that, 'Add', false);
				
				$.get("http://" + sgDir + "/php/....php?vid=" + viewId + "&tid=" + tempId, function(data) {
					if (data !== 'true') {
						alert("There's been an error. Please reload page and try again.");
					}
				});

				function updateVarsUI() {
					//update vars
					templateData[tempId + 'ids' + viewType].push(viewId);
					
					//update options
					var sel = $(parent).children('select')[0],
						opt = document.createElement('option');
					
					$(opt).attr('value', viewId).css({'opacity' : '0'}).html(viewData.viewLookup[viewId]);
					$(sel).append(opt);
					$(opt).animate({'opacity' : '1'});
				}
				
				_closeEdit(parent, updateVarsUI);

			});
		},
		_addView = function(that) {
			
			var parent = _checkIfExists(that, 'Add');
			
			if (!parent) {
				return;
			}
			
			_createForm(that, 'Add', parent);
		},
		_deleteView = function(that, section) {
			
			function checkData(data) {
				if (data === 'false') {
					alert("There's been an error. Please reload page and try again.");
				}
			}
			
			var	parent = $(that).parents('.view_section'),
				viewType = $(parent).data('viewtype'),
				index;
			
			//make sure a view is selected to delete
			var sel = $(parent).children('select')[0];
			if (typeof sel.options[sel.selectedIndex] === 'undefined') {
				alert('Please select a view to delete and try again.');
				return;
			}
			
			var viewName = sel.options[sel.selectedIndex].text,
				viewId = $(sel).val();
			
			if (confirm("Delete " + viewName + "?")) {
				
				if (section === 'Temp') {
					
					//Temp section
					var ts = $('.div_template p').children('select')[0],
					tempId = $(ts).val();
					
					$.get("http://" + sgDir + "/php/....php?vid=" + viewId + "&tid=" + tempId, function(data) {
						checkData(data);
					});
					
					//remove from vars
					index = templateData[tempId + 'ids' + viewType].indexOf(parseInt(viewId));
					templateData[tempId + 'ids' + viewType].splice(index, 1);
					
					//remove from just the template select list
					$(sel).children('option[value="' + viewId +'"]').fadeOut("slow", function() {
						this.remove();
					});
					
				} else if (section === 'Views') {
					
					//Views section
					$.get("http://" + sgDir + "/php/....php?id=" + viewId + "&ty=" + viewType, function(data) {
						checkData(data);
					});
					
					//remove from vars
					index = viewData['viewIds' + viewType].indexOf(parseInt(viewId));
					viewData['viewIds' + viewType].splice(index, 1);
					viewData['viewNames' + viewType].splice(index, 1);
					delete viewData.viewLookup[viewId];
					
					//remove from views and templates select lists
					$('option[value="' + viewId +'"]').fadeOut("slow", function() {
						this.remove();
					});
				}
			}
		},
		_editView = function(that) {
			
			var parent = _checkIfExists(that, 'Edit');
	
			if (!parent) {
				return;
			}
			
			//make sure a view is selected to edit
			var sel = $(parent).children('select')[0];
			if (typeof sel.options[sel.selectedIndex] === 'undefined') {
				alert('Please select a view to edit and try again.');
				return;
			}

			var selViewData = {
					sel : sel,
					viewName : sel.options[sel.selectedIndex].text,
					viewId : $(sel).val()
				};
			
			_createForm(that, 'Edit', parent, selViewData);
			
		},
		_createForm = function(that, addOrEdit, parent, selViewData) {
			
			_updateButtons(that, 'Cancel', true);
			
			//load edit controls
			var div = document.createElement('div'),
				txt = document.createElement('input'),
				txt2 = document.createElement('input'),
				btn = document.createElement('input'),
				select = document.createElement('select'),
				p = document.createElement('p'),
				p2 = document.createElement('p'),
				p3 = document.createElement('p'),
				viewType = $(parent).data('viewtype');

			$(div).addClass('div_edit light_td');
			
			$(p).addClass('p_edit').css({'margin-right' : '40.25px'}).html('Name: ');
			$(p2).addClass('p_edit').css({'margin-right' : '46.5px'}).html('Order: ');
			$(p3).addClass('p_edit').html('Definition: ');
			$(txt).addClass('form-control txt txt_edit');
			
			if (addOrEdit === 'Edit') {

				$(txt).attr('value', selViewData.viewName);
				var def = (typeof viewData.defs[selViewData.viewId] !== 'undefined') ? viewData.defs[selViewData.viewId] : '';
				$(txt2).attr('value', def);
			}
			
			$(txt2).addClass('form-control txt txt_edit_note');
			
			$(select).addClass('form-control sel_edit').html(_createViewList(viewType, addOrEdit));
			$(btn).attr({
				'type' : 'button',
				'value' : 'Save'
			}).addClass('btn edit_btn');

			$(div).append(p).append(txt).append(btn).append(p2).append(select).append(p3).append(txt2);
			$(parent).children('select').before(div);
			
			$(div).animate({
				'height' : '120px',
				'padding-top' : '10px'
			});

			//Save button
			$(btn).on('click', function() {

				var newName = $(txt).val(),
					ord = $(select).val(),
					def = $(txt2).val(),
					path = "http://" + sgDir + "/php/....php?";
				
				if (addOrEdit === 'Edit') {
					_updateButtons(that, 'Edit', false);
					path += "id=" + encodeURIComponent(selViewData.viewId) + "&";
				} else {
					_updateButtons(that, 'Add', false);
				}
				path += "ord=" + encodeURIComponent(ord) + 
						"&up=" + encodeURIComponent(newName) + 
						"&ty=" + encodeURIComponent(viewType) + 
						"&def=" + encodeURIComponent(def);
				
				$.get(path, function(data) {
					
					function newViewUpdateSel() {
						
						//update options
						var sel = $(parent).children('select')[0],
							index = _sortIndex(viewType, newName),
							opt = document.createElement('option');
						
						$(opt).attr('value', data).css({'opacity' : '0'}).html(newName);
						sel.add(opt, index);
						$(opt).animate({'opacity' : '1'});
					}
					
					if (typeof parseInt(data) === 'number') {
						
						if (addOrEdit === 'Add') {
							
							//use new id to update data
							var newViewData = {
								viewName : newName,
								viewId : data,
								def : def
							};
							_updateVars(ord, viewType, newViewData, true);
								
							_closeEdit(parent, newViewUpdateSel);
							
						}

					} else {
						alert("There's been an error. Please reload page and try again.");
					}
				});

				if (addOrEdit === 'Edit') {
					selViewData.def = def;
					_updateVars(ord, viewType, selViewData, false);
					//update option name
					selViewData.sel.options[selViewData.sel.selectedIndex].text = newName;
					_closeEdit(parent);
				}
				
			});
			
		},
		_sort = function(viewType) {
			//retired function
			//clone array
			var names = viewData['viewNames' + viewType].slice(0),
				html,
				id,
				index;
			names.sort();
			
			for (var i = 0; i < names.length; i++) {
				//find id
				index = viewData['viewNames' + viewType].indexOf(names[i]);
				id = viewData['viewIds' + viewType][index];
				//create options
				html += '<option value="' + id + '">' + names[i] + '</option>';
			}
			return html; 
		},
		_sortIndex = function(viewType, newView) {
			//clone array
			var names = viewData['viewNames' + viewType].slice(0);
			names.sort();
			return names.indexOf(newView);
		},
		_updateVars = function(ord, viewType, selViewData, newView) {
			
			//find index for removing and the new position of the view
			//no updates needed for same
			if (ord !== '_same') {
				//index1 isn't used for new views
				var index1,
					index2;
	
				if (ord === '_first') {
					
					index1 = viewData['viewIds' + viewType].indexOf(parseInt(selViewData.viewId));
					index2 = 0;
					
				} else if (ord === '_last') {
				
					index1 = viewData['viewIds' + viewType].indexOf(parseInt(selViewData.viewId));
					index2 = viewData['viewIds' + viewType].length + 1;
	
				} else if (typeof parseInt(ord) === 'number') {
					
					index1 = viewData['viewIds' + viewType].indexOf(parseInt(selViewData.viewId));
					index2 = viewData['viewIds' + viewType].indexOf(parseInt(ord));
				}

				if (newView) {
					//add new view to lookup
					viewData.viewLookup[selViewData.viewId] = selViewData.viewName;
				} else {
					//remove
					viewData['viewIds' + viewType].splice(index1, 1);
					viewData['viewNames' + viewType].splice(index1, 1);
					
					//adjust new position if it was changed by deleting ealier in the list
					if (index2 > index1) {
						index2--;
					}
				}

				//new position
				viewData['viewIds' + viewType].splice(index2, 0, parseInt(selViewData.viewId));
				viewData['viewNames' + viewType].splice(index2, 0, selViewData.viewName);
			}
			
			//update definitions
			viewData.defs[selViewData.viewId] = selViewData.def;
			
		},
		_checkIfExists = function(that, addOrEdit) {
			
			var	parent = $(that).parents('.view_section');

			if ($(parent).children().length === 3) {
				//remove div
				_closeEdit(parent);
				_updateButtons(that, addOrEdit, false);
				return false;
			} else {
				return parent;
			}
		},
		_updateButtons = function(that, btnVal, disable) {
			
			$(that).attr('value', btnVal);
			if (disable) {
				$(that).siblings().attr('disabled', 'disabled');
			} else {
				$(that).siblings().removeAttr('disabled');
			}
		},
		_closeEdit = function(parent, callback) {
			
			var div = $(parent).children('div');
			$(div).animate({'height' : '0','padding-top' : '0'}, function() {
				$(this).remove();
				if (callback) {callback();}
			});
		},
		_createViewList = function(viewType, listType) {
			
			var optHTML = '';
			
			if (listType === 'Edit') {
				optHTML += '<option value="_same">Same</option>';
			}
			
			if (listType !== 'Temp') {
				optHTML += '<option value="_last">Last</option><option value="_first">First</option><optgroup label="Or Before">';
			}
			
			for (var i = 0; i < viewData['viewNames' + viewType].length; i++) {
				optHTML += '<option value="' + viewData['viewIds' + viewType][i] + '">' + viewData['viewNames' + viewType][i] + '</option>';
			}
			
			if (listType !== 'Temp') {
				optHTML += '</optgroup>';
			}
			return optHTML;
		};
		return {
			'init' : init
		};
	})();
		
	ViewAdmin.init();
	
});