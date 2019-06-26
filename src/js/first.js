$(function(){


    function ajax() {
        var startOption =
        {
            url: "http://localhost:8282/books/",
            data: {},
            method: "GET",
            dataType: "json",
            contentType: "application/json",
            async: false
        };

        if (arguments.length>0) {
            startOption.url = "http://localhost:8282"+$(arguments[0]).data('url');
            startOption.method = $(arguments[0]).data('type');
        }

        if (arguments.length>1) {
            var result = {};
            for (var i=0; i<arguments[1].length; i++) {
                result[arguments[1][i].name] = arguments[1][i].value;
            }
            startOption.data = JSON.stringify(result);
        }

        return $.ajax(startOption).done(function (result) {
        }).fail(function (xhr, status, err) {
        }).always(function (xhr, status) {
        }).responseJSON;
    }


    // set form action
    var formBook = $('#addBook');
    formBook.on('submit', function(e){
        e.preventDefault();
        ajax(this,$(this).serializeArray());
        refreshBooks();
    });

    function refreshBooks() {
        var result = ajax();
        var list = $('#book-list');

        list.html('');

        for (element of result) {
            var row = $(
                '<div class="card">' +
                '<div class="card-header">' +
                '<div class="row mb-0">' +
                '<div class="col-10 book-title" data-url="/books/'+element.id+'" data-type="GET">' + element.title + '</div>' +
                '<div class="col-2"><button type="button" class="btn btn-danger book-delete" data-type="DELETE" data-url="/books/'+element.id+'">Usuń</button></div>' +
                '</div>' +
                '</div>' +
                '<div class="collapse" style="display:none">' +
                '<div class="card-body"></div>' +
                '</div>' +
                '</div>');
            // dodwanie zadarzenia do elementu listy
            row.find('.book-title').on('click', function () {
                var collapse = $(this).parent().parent().parent().find('.collapse');
                var ajaxResult = ajax(this);
                var description =
                    'id : '+ ajaxResult.id + '<br>'+
                    'isbn : '+ ajaxResult.isbn +'<br>'+
                    'author : '+ ajaxResult.author +'<br>'+
                    'publisher : '+ ajaxResult.publisher +'<br>'+
                    'type : '+ ajaxResult.type;

                if (collapse.css('display') === 'none') {
                    collapse.css('display', 'block');
                    collapse.children(0).html(description);

                } else {
                    collapse.css('display', 'none');
                    collapse.children(0).html('');
                }
            });

            // dodawanie zdarzenia do button usun
            var button = row.find('.book-delete');
            button.on('click', function() {
                console.log(ajax(this));
                refreshBooks()
            });
            list.append(row);
        }
    }

    refreshBooks();

});