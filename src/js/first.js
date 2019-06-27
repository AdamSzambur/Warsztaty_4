$(function(){


    function ajax() {
        var startOption = {
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
        // zamiana tabeli na obiekt
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
                '<div class="card-body">' +
                '<form class = "bookForm" data-url="/books/'+element.id+'" data-type="PUT">'+
                '<div class="form-group row"><label for="bookId" class="col-sm-2 col-form-label">id</label><div class="col-sm-3">'+
                '<input type="text" readonly class="form-control" id="bookId" placeholder="bookId" name="id"></div></div>'+
                '<div class="form-group row"><label for="bookIsbn" class="col-sm-2 col-form-label">isbn</label><div class="col-sm-3">'+
                '<input type="text" class="form-control" id="bookIsbn" placeholder="bookIsbn" name="isbn"></div></div>'+
                '<div class="form-group row"><label for="bookTitle" class="col-sm-2 col-form-label">title</label><div class="col-sm-3">'+
                '<input minlength="2" type="text" class="form-control" id="bookTitle" placeholder="bookTitle" name="title"></div></div>'+
                '<div class="form-group row"><label for="bookAuthor" class="col-sm-2 col-form-label">author</label><div class="col-sm-3">'+
                '<input type="text" class="form-control" id="bookAuthor" placeholder="bookAuthor" name="author"></div></div>'+
                '<div class="form-group row"><label for="bookPublisher" class="col-sm-2 col-form-label">publisher</label><div class="col-sm-3">'+
                '<input type="text" class="form-control" id="bookPublisher" placeholder="bookPublisher" name="publisher"></div></div>'+
                '<div class="form-group row"><label for="bookType" class="col-sm-2 col-form-label">type</label><div class="col-sm-3">'+
                '<input type="text" class="form-control" id="bookType" placeholder="bookType" name="type"></div></div>'+
                '<div class="form-group row"><div class="col-sm-10"><button type="submit" class="btn btn-success book-update">Zmień</button></div></div>'+
                '</form>' +
                '</div>' +
                '</div>' +
                '</div>');

            var formBook = row.find('.bookForm');

            formBook.on('submit',function(e){
                e.preventDefault();
                ajax(this,$(this).serializeArray());
                refreshBooks();
            });

            // dodwanie zadarzenia do elementu listy
            row.find('.book-title').on('click', function () {
                var collapse = $(this).parent().parent().parent().find('.collapse');
                var ajaxResult = ajax(this);

                var bookForm =collapse.find('.bookForm');

                console.log(bookForm);

                if (collapse.css('display') === 'none') {
                    collapse.css('display', 'block');
                     bookForm.find('[name=id]').attr('value',ajaxResult.id);
                     bookForm.find('[name=isbn]').attr('value',ajaxResult.isbn);
                     bookForm.find('[name=title]').attr('value',ajaxResult.title);
                     bookForm.find('[name=author]').attr('value',ajaxResult.author);
                     bookForm.find('[name=publisher]').attr('value',ajaxResult.publisher);
                     bookForm.find('[name=type]').attr('value',ajaxResult.type);
                } else {
                    collapse.css('display', 'none');
                    bookForm.find('[type = text]').attr('value','');
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