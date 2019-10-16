// HAVE NOT COMPLETED BONUS DELIVERABLES \\

document.addEventListener('DOMContentLoaded', (event) => {
  getQuotes()
})


const quoteListUl = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')


function getQuotes() {
  fetch('http://localhost:3000/quotes?_embed=likes')
  .then(response => response.json())
  .then(quotesArray => {
    quotesArray.forEach(quote => {
      addQuoteLiToQuoteListUl(quote)
    })
  })
}


function addQuoteLiToQuoteListUl(quote) {
  let quoteLi = document.createElement('li')
  let likesCount = quote.likes.length 

  quoteLi.className = 'quote-card'
  quoteLi.innerHTML = 
    ` <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success'>Likes: <span>${likesCount}</span></button>
        <button class='btn-danger'>Delete</button>
      </blockquote>`

  quoteLi.addEventListener('click', (event) => {
    if (event.target.className === 'btn-danger') {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
      method: 'DELETE'
      })
      .then(response => response.json())
      .then(deleteQuote => {
        event.target.parentElement.parentElement.remove()
      })
    }
  })


  quoteLi.addEventListener('click', (event) => { 
    if (event.target.className === 'btn-success') {
      fetch('http://localhost:3000/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          quoteId: quote.id,
          createdAt: Date.now()
        })
      })
      .then(response => response.json())
      .then(newLike => {
        quote.likes.push(newLike)
        event.target.children[0].innerText = quote.likes.length
      })
    }
  })

  quoteListUl.append(quoteLi)
}


function addLikesKeyToQuote(newQuote) {
  fetch('http://localhost:3000/quotes?_embed=likes')
  .then(response => response.json())
  .then(quotesArray => {
    let foundQuote = quotesArray.find(quote => {
      return quote.id === newQuote.id
    })
    addQuoteLiToQuoteListUl(foundQuote)
  })
}


newQuoteForm.addEventListener('submit', (event) => {
  event.preventDefault()
  let newQuote = event.target['new-quote'].value
  let newAuthor = event.target.author.value

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor
    })
  })
  .then(response => response.json())
  .then(newQuote => {
    addLikesKeyToQuote(newQuote)
  })
})