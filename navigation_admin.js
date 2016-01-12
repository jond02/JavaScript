var sgNavAdmin;

$(function(){

	sgNavAdmin = (function() {
			var init = function() {
				
				$('.navAdmin_del').on('click', function() {
					_deactivate();
				});

				$('.navAdmin_react').on('click', function() {
					_reactivate();
				});

				$('.navAdmin_add').on('click', function() {
					_addNav();
				});
				
				$('.navAdmin_mkParSel').on('change', function() {
					_loadDeactOpts();
				});

				$('.navAdmin_mkPar').on('click', function() {
					_makeParent();
				});
				
			},  
			_deactivate = function() {

				var sel = document.getElementById('js_navAdmin_delSel'),
					reactSel = document.getElementById('js_navAdmin_reactSel'),
					name = sel.options[sel.selectedIndex].text,
					canon = $('.navAdmin_delSel').val();
				
				if (!canon) {
					alert("Please select a category and try again.");
					return;
				}
				
				if (confirm( "Deactivate " + name + " and all of its sub-categories?")) {
					
					var spinner = $(sel).parent().children('.navAdmin_spinner');
					$(spinner).css('visibility', 'visible');
					$(sel).attr('disabled', 'disabled');

					$.get("http://" + sgDir + "/php/....php?canon=" + canon + "&active=0", function(data) {
						if (data === '') {

							//remove from nav where canon matches
							$(spinner).css('visibility', 'hidden');
							$(sel).removeAttr('disabled');

							$('li[data-canon="' + canon +'"]').fadeOut(function() {
								$('li[data-canon="' + canon +'"]').remove();
							});

							//remove option from list
							sel.remove(sel.selectedIndex);
							
							//add to deactivated
							var opt = document.createElement("option");
							opt.text = name;
							$(opt).attr('value', canon);
							reactSel.add(opt);
							//check if disabled and update now that theres an option
							if ($(reactSel).attr('disabled')) {
								$(reactSel).removeAttr('disabled');
								$(reactSel).parent().children('input[type="button"]').removeAttr('disabled');
							}
							
							//check if nav ul has children, if not reload page to load product page
							if ($('nav ul li').length === 0) {
								location.reload();
							}

						} else {
							alert("There's been an error.");
						}
					});	
				}
			},
			_reactivate = function() {
				
				var sel = document.getElementById('js_navAdmin_reactSel'),
					deactSel = document.getElementById('js_navAdmin_delSel'),
					name = sel.options[sel.selectedIndex].text,
					canon = $('.navAdmin_reactSel').val();
				
					if (!canon) {
						alert("Please select a category and try again.");
						return;
					}
	
				if (confirm( "Reactivate " + name + " and all of its sub-categories?")) {
					
					var spinner = $(sel).parent().children('.navAdmin_spinner');
					$(spinner).css('visibility', 'visible');
					$(sel).attr('disabled', 'disabled');

					$.get("http://" + sgDir + "/php/....php?canon=" + canon + "&active=1", function(data) {
						if (data === '') {

							//add to nav
							$(spinner).css('visibility', 'hidden');
							$(sel).removeAttr('disabled');
							var li = document.createElement('li'),
								a = document.createElement('a');
							$(li).attr('data-canon', canon);
							$(a).attr('href','index.php?nav=' + canon).
							  html(name);
							$('nav ul').append(li);
							$(li).append(a);

							//remove option from list
							sel.remove(sel.selectedIndex);
							
							//add to deactivated
							var opt = document.createElement("option");
							opt.text = name;
							$(opt).attr('value', canon);
							deactSel.add(opt);

						} else {
							alert("There's been an error.");
							console.log(data);
						}
					});	
				}

			},
			_addNav = function() {
				
				var txtbox = document.getElementById('js_navAdmin_addText'),
					deactSel = document.getElementById('js_navAdmin_delSel'),
					//check if on top level with url nav
					parCan = (typeof $(".active").data("canon") === 'undefined') ? 'products' : $(".active").data("canon"),
					navName = $(txtbox).val();

				if (!navName) {
					alert('Please enter a category name.');
					return;
				}
				
				//remove quotes, not needed and will break code later
				navName = navName.replace(/"/gi, '');
				navName = navName.replace(/'/gi, '');
				
				if (confirm( "Add " + navName + " to the navigation?")) {
					
					var spinner = $(txtbox).parent().children('.navAdmin_spinner');
					$(spinner).css('visibility', 'visible');

					$.get("http://" + sgDir + "/php/....php?name=" + encodeURIComponent(navName) + "&pc=" + parCan, function(canon) {
								
						if (canon !== 'false') {

							//add to nav
							$(spinner).css('visibility', 'hidden');
							var li = document.createElement('li'),
								a = document.createElement('a');
							$(li).attr('data-canon', canon);
							$(a).attr('href','index.php?nav=' + canon).
							  html(navName);
							$('nav ul').append(li);
							$(li).append(a);

							//remove value from txtbox
							txtbox.value = '';
							
							//add to deactivated
							var opt = document.createElement("option");
							opt.text = navName;
							$(opt).attr('value', canon);
							deactSel.add(opt);

						} else {
							alert("There's been an error.");
							console.log(canon);								
						}
					});
				}
			},
			_makeParent = function() {
				
				var sel = document.getElementById('js_navAdmin_mkParSel'),
					deactSel = document.getElementById('js_navAdmin_mkPar_deact'),
					name = sel.options[sel.selectedIndex].text,
					canon = $(sel).val(),
					newFirst = $('.navAdmin_fChildText').val(),
					deactFirstC = $(deactSel).val(),
					first,
					firstC;
				
				function redirect(canon) {
					//redirect to new parent page
					window.location = "http://" + sgDir + "/....php?nav=" + canon;
				}
				
				if (!canon) {
					alert("Please select a category and try again.");
					return;
				}
				
				if (!deactFirstC && !newFirst) {
					alert('Please enter or select a first child for the new parent and try again.');
					return;
				}	
				if (deactFirstC && newFirst) {
					alert('Please select only one first child for the new parent and try again.');
					return;	
				}
					
				if (deactFirstC) {
					firstC = deactFirstC;
					//get name
					first = deactSel.options[deactSel.selectedIndex].text;
				} else {
					first = newFirst; 
				}
				
				if (confirm( "Make " + name + " a parent and create a first child of " + first + "?")) {
					
					var spinner = $(sel).parent().children('.navAdmin_spinner');
					$(spinner).css('visibility', 'visible');
					
					if (deactFirstC) {
						//reactivate child category
						$.get("http://" + sgDir + "/php/....php?chcan=" + encodeURIComponent(firstC) + "&pcan=" + canon, function(data) {
							if (data === 'true') {
								redirect(canon);
							} else {
								alert("There's been an error.");
							}
						});
						
					} else {
						//add a category for a new nav
						$.get("http://" + sgDir + "/php/....php?name=" + encodeURIComponent(first) + "&pc=" + canon, function(data) {
							if (data !== 'false') {
								redirect(canon);
							} else {
								alert("There's been an error.");
							}
						});
					}
				}
			},
			_loadDeactOpts = function() {
				//get value
				var sel = document.getElementById('js_navAdmin_mkPar_deact'),
				canon = $('.navAdmin_mkParSel').val(),
				opt;
				
				function getOpts(canon) {
					var optHtml = '';
					//check if canon is in obj
					for (var prop in parentDeact) {
						if (parentDeact.hasOwnProperty(prop)) {
							if (prop === canon) {
								//create options
								optHtml = '<option value=""> </option>';
								for (var cat in parentDeact[prop]) {
									if (parentDeact[prop].hasOwnProperty(cat)) {
										optHtml += '<option value="' + cat + '">' + parentDeact[prop][cat] + '</option>';
									}
								}
							}
						}
					}
					return optHtml;
				}
				
				opt = getOpts(canon);
				if (opt) {
					$(sel).html(opt);
					$(sel).removeAttr('disabled');
					//if so populate list and enable
				} else {
					//if not clear list and disable
					$(sel).html('');
					$(sel).attr('disabled', 'disabled');
				}
			};
			return { 'init' : init};
		})();
		
	sgNavAdmin.init();
	
});