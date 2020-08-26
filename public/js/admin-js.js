/**
 * 
 */
$('#sidebarCollapse').on('click', function () {
     $('#sidebar').toggleClass('active');
 });

/*Custom File Input*/
$(".custom-file-input").on("change", function() {
	  var fileName = $(this).val().split("\\").pop();
	  $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
});

/*Ajax Add in color-manage-table*/
//Add
$("#btnAddColor").on("click", function(){
		var colorName = $("#colorName").val();
		$.ajax({
			type: "POST",
			url: "add-color" ,
			dataType	: 'json',
			data: {
				name : colorName
			},
			timeout: 10000,
			success: function(data){
				location.reload(true);
			}
		});
});

