var Styleguide;

$(function() {
	'use strict';
	
	Styleguide = (function() {
		var newNoteCount = 0,
			newNoteName,
			noteInput,
		init = function() {
			
			if (typeof sgAdmin !== 'undefined') {
				if (sgAdmin) {
					noteInput = _addNotesInput();
				}
			}
			
		    $(".notesAdmin").on("click", function() {
		    	_deleteNote(this);
	    	});
		
			//active view/all radios
		    $("input[name='notes']").on("click", function() {
		        loadNotes();

		       	$('.glyphicon-random').on("click", function() {
		        	reassignNote(this);
		        });

		        $('[data-toggle="tooltip"]').tooltip();
		    });
		    
		   	_viewButtonsInit();	

		   	_tooltips();

		},
		_tooltips = function() {

			if (arguments.length === 1) {
				//add tooltip for selected view
				if (typeof viewDefs[arguments[0]] !== 'undefined') {

					$('li[data-viewid="' + arguments[0] + '"]').attr({
			    		'data-toggle' : 'tooltip',
			    		'title' : viewDefs[arguments[0]]
			    	}).addClass('viewDef');
				}

			} else {
				//add tooltips for view in viewDefs obj
			    $.each(viewDefs, function(key, value) {
			    	$('li[data-viewid="' + key + '"]').attr({
			    		'data-toggle' : 'tooltip',
			    		'title' : value
			    	}).addClass('viewDef');
			    });	
			}

			//init tooltips
			$('[data-toggle="tooltip"]').tooltip();
		},
		_addNotesInput = function() {
			//create input for adding notes
			var div = document.createElement('div');
				$(div).css({
					'width' : '100%',
					'height' : '150px',
					'display' : 'none'
				});
			var p1 = document.createElement('p');
				$(p1).css('margin-top' , '20px');
				var label = document.createElement('label');
				$(label).attr('for', 'newNoteText').html('Enter a new note');
			
			var p2 = document.createElement('p');
				var input1 = document.createElement('input');
				$(input1).
				attr({
					'id' : 'newNoteText', 
					'type' : 'text',
					'value' : ''
				}).
				addClass('form-control btn-block');
			
			var p3 = document.createElement('p');
			var input2 = document.createElement('input');
			$(input2).attr({
				'type' : 'button',
				'id' : 'newNoteButton',
				'value' : 'Submit'
			}).addClass('btn-block sgButton');
			
			div.appendChild(p1).appendChild(label);
			div.appendChild(p2).appendChild(input1);
			div.appendChild(p3).appendChild(input2);
			
			$(input2).on("click", function() {
			    Styleguide.sendNote(input1.value);
			    input1.value = '';
			});	
			return div;
		},
		_viewButtonsInit = function() {
		    $('.viewAdminDelete').on("click", function() {
		    	_deleteView(this);
		    });
		    
		    $('.viewAdminAdd').on("click", function() {
		    	_addView(this);
		    });
		
			$('span[data-viewid="template"]').on("click", function() {
				var cont = confirm("All view data will be replaced with the template. Continue?");
				if (cont) {
					//get template id
					_addTemplate($('select[data-viewid="template"]').val());
				}
			});
		},
		_addTemplate = function(templateId) {
			var navId = $(".active").data('navcatid');	
		
			$.get("http://" + sgDir + "/php/....php?nav=" + navId + "&template=" + templateId, function(data) {
		    	if (data !== '') {
		    		//empty and reload views
		    		$('#shotListDiv form').empty().html(data);
		    		_viewButtonsInit();
		    		Gallery.initShotList();
		    		
		    	} else {
		    		alert("There has been an error with the database, please retry.");
		    	}
		    	
		    }); 	
		},
		_deleteView = function(that) {
		    var par = $(that).parent(),
		    	viewId = $(par).attr("data-viewid"),
		    	viewName = $(par).text().trim(),
		    	navId = $(".active").data("navcatid");
	    	
	    	if (confirm("Delete " + viewName + "?")) {

			    $.get("http://" + sgDir + "/php/....php?viewid=" + viewId + "&nav=" + navId, function(data) {
			        if (data !== 'true') {
			           alert("There's been an error deleting the note. Please reload page and try again.");
			        }
		    	});

			    $(par).fadeOut(function() {
			    	$(this).remove();
			    });
	    	}
		},
		createViewList = function(viewVar, idVar, viewName) {
			var formAddition = '<optgroup label="' + viewName + '">';
			
			for (var k = 0; k < viewVar.length; k++) {
				formAddition += '<option value="' + idVar[k] + '">' + viewVar[k] + '</option>';
			}
			formAddition += '</optgroup>';
			return formAddition;
		},
		loadViewList = function(filename) {
			var viewNumber = $('input[name="' + filename + '"]:checked').val();
			var selectInput = $('select[name="' + filename + '_sel"]');
			$(selectInput).empty();
			switch(viewNumber) {
				case '1': $(selectInput).html(createViewList(viewNames1, viewIds1, 'Primary Views')); 		break;
				case '2': $(selectInput).html(createViewList(viewNames2, viewIds2, 'Tour Views'));			break;
				case '3': $(selectInput).html(createViewList(viewNames3, viewIds3, 'Proprietary Views'));	break;
				case '4': $(selectInput).html(createViewList(viewNames4, viewIds4, 'Custom Views'));		break;
			}
		},
		_addView = function(that) {
			var viewTypeId = $(that).data('viewid');
			var viewId = $('select[data-viewid="' + viewTypeId + '"]').val();
			var navId = $(".active").data('navcatid');
			
			$.get("http://" + sgDir + "/php/....php?nav=" + navId + "&viewid=" + viewId, function(data) {
		    	if (data !== 'false') {
		    		var li = document.createElement('li');
		    		$(li).attr('data-viewid', viewId).html(data);
		    		$('ul[data-viewid="' + viewTypeId + '"]').append(li);
		    		
		    		var sp = document.createElement("span");
		            $(sp).addClass("glyphicon glyphicon-remove viewAdminDelete");
		        	$(li).html($(li).html() + ' ').append(sp);
		    		
		    		$(sp).on("click", function() {
		    			_deleteView(this);
		    		});

		    		_tooltips(viewId);

		    	} else {
		    		alert('Please select a view that is not already assigned.');
		    	}
		    }); 
		},
		loadNotes = function() {
			//load notes
			var notesTable = document.getElementById("notesTable");
		    $(notesTable).empty();
		    if (sgAdmin) {
		    	//reset display for fade in
		    	$(noteInput).detach().css('display', 'none');
		    }
		    //active notes
		    if ($("input[name='notes']:checked").val() === 'active') {
		        //look for a matching image name and add notes if Active View is selected, else display all
		        $.each(notesObj, function(key, val) {
		            if ($('#activeImage').attr('src').replace("studio_images/","") === val['label']) {
		                _addNote(val['note'], val['label'], val['id'], sgAdmin, false);
		            }
		        });
		        //slide in the notes
		        $($(notesTable).parent().parent()).effect("slide", 300, function() {
		        	if (sgAdmin) {
		        		$(this).append(noteInput);
		        		$(noteInput).fadeIn(400);
		        	}
		        });
		
		    } else {
		    	//all notes
		        $.each(notesObj, function(key, val) {
		            //display all
		            _addNote(val['note'], val['label'], val['id'], sgAdmin, false);
		        }); 
		    }
		},
		_deleteNote = function(that) {
		    var par = $(that).parent().parent();
		    var noteId = $(par).attr("data-noteid");

		    if (confirm("Delete note?")) {

			    $.get("http://" + sgDir + "/php/...php?noteid=" + noteId, function(data) {
			        if (data !== 'true') {
			           alert("There's been an error deleting the note. Please reload page and try again.");
			        }
			    });

			    $(par).fadeOut(function() {
			    	$(this).remove();
			    });

			    //look for a matching id to delete note from notes object
			    $.each(notesObj, function(key, val) {
			        if (noteId === val['id']) {
			            delete notesObj[key];
			        }
			    });
		   	}
		},
		_addNote = function(note, file_name, id, sgAdmin, userAdd) {
		    
		    var notesTable = document.getElementById("notesTable"),
		    	tRow = document.createElement("tr"),
				td = document.createElement("td");
		        
			td.innerHTML = note;
		    
		    $(tRow).attr('data-filename', file_name).
		    		attr('data-noteid', id);

		    notesTable.appendChild(tRow).appendChild(td);
		    
		    //if in admin mode add admin controls
		    if (sgAdmin) {

		        if ($("input[name='notes']:checked").val() === 'all') {
		        	
		        	//check if a note isn't assigned to any images
		        	var imgTest = true;
		        	for (var i = 0; i < document.images.length; i++) {

		        		if (document.images[i].src.indexOf(file_name) !== -1) {
		        			imgTest = false;
		        			break;
		        		}
		        	}

		        	if (imgTest) {
		        		var notSp = document.createElement("span");
		        		$(notSp).addClass("glyphicon glyphicon-bullhorn").
		        				attr({
		        					'title' : 'This note is not assigned to an image. Reassign or delete.',
		        					'data-toggle' : 'tooltip'
		        				});

						$(td).html(' ' + $(td).html()).prepend(notSp);
		        	}

		        	//build list with reassign icon for all notes
		        	var reassi = document.createElement("span");
		        	$(reassi).addClass("glyphicon glyphicon-random").
		        			attr('title', 'Reassign note to active image.');

		        	$(td).html(' ' + $(td).html()).prepend(reassi);

		        }

		        var sp = document.createElement("span");
		        $(sp).addClass("glyphicon glyphicon-remove notesAdmin").
		        		attr('title', 'Delete note.');
		        
		        $(td).html(' ' + $(td).html()).prepend(sp);
		        
		        $(sp).on("click", function() {
		            _deleteNote(this);
		        }); 
		    }
		
		    if (userAdd) {
		        //add note to notes objects if initiated from user
		        newNoteName = 'newNote' + newNoteCount;
		        notesObj[newNoteName] = {
		            'label' : file_name,
		            'id' : id, 
		            'note' : note
		        };
		        newNoteCount += 1;
		    }
		},
		reassignNote = function(that) {
			//get active image name and reassign note in note obj
    		var activeFile = $("#activeImage").attr("src").replace("studio_images/",""),
    			id = $(that).parents('tr').attr('data-noteid'),
    			td = $(that).parent();
    		
    		if (activeFile !== 'default/add_content.jpg') {

	    		$.get("http://" + sgDir + "/php/....php?nid=" + encodeURIComponent(id) + "&file=" + encodeURIComponent(activeFile), function(data) {
	    			if (data === 'false') {
	    				alert("There's been an error reassigning the note. Please reload the page and try again.");
	    			}
	    		});

	    		//update obj
	    		$.each(notesObj, function(key, val) {
	        		if (val['id'] === id) {
	            		val['label'] = activeFile;
	        		}
	    		});

	    		//visual indication that update happened
	    		$(td).fadeOut(function() {
	    			$(this).children('.glyphicon-bullhorn').remove();
	    			$(this).fadeIn();
	    		});

			} else {
				alert('Please select a product image and try again.');
			}

		},
		sendNote = function(note) {
		    if (note.length === 0) {
		        alert("Please enter a note.");
		        return;
		    } else {
		        var navId = $(".active").data("navcatid"),
		        	file = $("#activeImage").attr("src");
		        file = file.replace("studio_images/","");            
		      
		        $.get("http://" + sgDir + "/php/....php?nav=" + navId + "&note=" + encodeURIComponent(note) + "&file=" + file, function(nId) {
		            //check result
		            _addNote(note, file, nId, this, true, true); 
		        }); 
		    }
		},
		deleteImage = function(imgId) {
		    $.get("http://" + sgDir + "/php/....php?imgid=" + imgId, function(data) {
		        //check result
		        if (data !== 'true') {
		            alert('Error updating database. Please reload page and try again.');
		        }
		    }); 
		};
		return {
			'init' : init,
			'deleteImage' : deleteImage,
			'loadNotes' : loadNotes,
			'sendNote' : sendNote,
			'createViewList' : createViewList,
			'loadViewList' : loadViewList,
			'reassignNote' : reassignNote
		};

	})();

	Styleguide.init();
	
    //upload files
    if (sgAdmin) {
        //filename is the button that selects files
    	var field = document.getElementById('filename'),
    		formRadios = document.getElementById('formRadios'),
    		formPlaceholder = document.getElementById('formPlaceholder');

    	$(field).on('click', function() {
    		$(formRadios).empty();
    		formPlaceholder.innerHTML = '<p>Files...</p>';
    	}).
    	on('change', countFiles);
    }

    function countFiles(e) {

    	function nameUpdate(name) {
    		return name.slice(0,name.indexOf(' '));
    	}
    	
        if (this.files !== undefined) {
            var elems = this.form.elements,
                submitButton,
                len = this.files.length, 
                max = document.getElementsByName('MAX_FILE_SIZE')[0].value,
                maxfiles = this.getAttribute('data-maxfiles'),
                maxpost = this.getAttribute('data-postmax'),
                displaymax = this.getAttribute('data-displaymax'),
                filesize,
                toobig = [],
                total = 0,
                message = '',
                formAddition = '<table class="table"><tr><th>Filename</th><th>';
                formAddition += nameUpdate(viewTypes['1']);
                formAddition += '</th><th>';
                formAddition += nameUpdate(viewTypes['2']);
                formAddition += '</th><th>';
                formAddition += nameUpdate(viewTypes['3']);
                formAddition += '</th><th>';
                formAddition += nameUpdate(viewTypes['4']);
                formAddition += '</th><th>View</th></tr>';

            for (var i = 0; i < elems.length; i++) {
                if (elems[i].type == 'submit') {
                    submitButton = elems[i];
                    break;
                }
            }
            
            for (i = 0; i < len; i++) {
                filesize = this.files[i].size;
                if (filesize > max) {
                    toobig.push(this.files[i].name);
                } else {
                	//select tour as default
                	formAddition += '<tr><td><span>' + this.files[i].name + '</td>';
    				formAddition += '<td><input type="radio" name="' + this.files[i].name + '" value="1" checked="checked" /></td>';
    				formAddition += '<td><input type="radio" name="' + this.files[i].name + '" value="2" /></td>';
    				formAddition += '<td><input type="radio" name="' + this.files[i].name + '" value="3" /></td>';
    				formAddition += '<td><input type="radio" name="' + this.files[i].name + '" value="4" /></td>';
    				formAddition += '<td><select class="form-control" name ="' + this.files[i].name + '_sel" >';
    				formAddition += Styleguide.createViewList(viewNames1, viewIds1, 'Primary Views');
    				formAddition += '</select></td></tr>';
                }
                total += filesize;
            }
            if (toobig.length > 0) {
                message = 'The following file(s) are too big:\n' + toobig.join('\n') + '\n\n';
            }
            if (total > maxpost) {
                message += 'The combined total exceeds ' + displaymax + '\n\n';
            }
            if (len > maxfiles) {
                message += 'You have selected more than ' + maxfiles + ' files';
            }
            if (message.length > 0) {
                submitButton.disabled = true;
                alert(message);
            } else {
                submitButton.disabled = false;
                $('#formPlaceholder').empty();
                formRadios.innerHTML = formAddition + '</table>';
                formAddition = '';
            	
            	//now that inputs are created, add click events
            	for (i = 0; i < len; i++) {
	                $('input[name="' + this.files[i].name + '"]').on("click", function() {
	    				Styleguide.loadViewList($(this).attr('name'));
	    			});
            	}
            }
        }
    }

}); //end doc ready

window.onload = function() {
	//wait until carousels have been given heights to reassign
	var height = 1;
	var carHeight = 1;
	//get the max height
	$.each($('.es-carousel'), function() {
		carHeight = Number($(this).css('height').replace('px',''));
        height = (carHeight > height) ? carHeight : height;
	});
	//set the height
	$('.es-carousel').css('height', height + 'px');
};
