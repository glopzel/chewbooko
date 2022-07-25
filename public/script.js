const likeBtn = document.querySelectorAll('.liked')
const deleteBtn = document.querySelectorAll('.deleted')

Array.from(likeBtn).forEach(item => {
    item.addEventListener('click', likedBook)
})

Array.from(deleteBtn).forEach(item => {
    item.addEventListener('click', deleteBook)
})

async function likedBook() {
    // 2 and 4 return undefined
    const bookTitleLiked = this.parentNode.childNodes[1].innerText
    const bookAuthorLiked = this.parentNode.childNodes[3].innerText
    const totalLikes = Number(this.parentNode.childNodes[5].innerText)

    try {
        const response = await fetch('addLike', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                // request.body for /addLike key : variable here
                'bookTitleL': bookTitleLiked,
                'bookAuthorL': bookAuthorLiked,
                'likesL': totalLikes
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err){
        console.log(err)
    }
}

async function deleteBook() {
    const bookTitleDelete = this.parentNode.childNodes[1].innerText
    const bookAuthorDelete = this.parentNode.childNodes[3].innerText
    try {
        const response = await fetch('deleteBook', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            // request.body for /deleteBook key : variable here
                bookTitleD: bookTitleDelete,
                bookAuthorD: bookAuthorDelete
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}