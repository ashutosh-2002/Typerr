class Book {

    constructor(title , author , isbn){
        
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }

}

class UI {

    addBookToList(book){

        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
    
        row.innerHTML = `<td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td> <a href="#" class = 'delete'> X </a> </td>`
    
        list.appendChild(row);
    }

    deleteBook(target){

        if(target.className === 'delete')
        {
            target.parentElement.parentElement.remove();
        }
    }

    showAlert(message , className){

        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');

        container.insertBefore(div , form);

        setTimeout(function(){document.querySelector('.alert').remove()} , 3000);
    }

    clearFields(){

        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

class Store {

    static getBooks() {

        let Books;

        if(localStorage.getItem('books') === null){
            Books = [];
        }
        else{
            Books = JSON.parse(localStorage.getItem('books'));
        }

        return Books;
    }

    static displayBooks() {

        const ui = new UI();

        const Books = Store.getBooks();

        Books.forEach(function(book){
            ui.addBookToList(book);
        });
    }

    static addBooks(book) {

        let Books = Store.getBooks();

        Books.push(book);

        localStorage.setItem('books' , JSON.stringify(Books));

    }

    static removeBooks(isbn) {

        let Books = Store.getBooks();

        Books.forEach(function(book , index){

            if(book.isbn === isbn){
                Books.splice(index , 1);
            }

        })

        localStorage.setItem('books' , JSON.stringify(Books));
    }

}

document.addEventListener('DOMContentLoaded' , Store.displayBooks());

document.getElementById('book-form').addEventListener('submit' , function(e){

    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    const book = new Book(title , author , isbn);

    const ui = new UI();

    if(title === '' || author === '' || isbn === '')
    {
        ui.showAlert('Please fill in all fields' , 'error');
    }
    else
    {
        ui.addBookToList(book);
        ui.showAlert('Book Added!' , 'success');
        ui.clearFields();

        Store.addBooks(book);
    }

    e.preventDefault();
})

document.getElementById('book-list').addEventListener('click' , function(e){

    const ui = new UI();

    ui.deleteBook(e.target);
    ui.showAlert('Book Deleted!' , 'success');
    
    Store.removeBooks(e.target.parentElement.previousElementSibling.textContent);

    e.preventDefault();
})