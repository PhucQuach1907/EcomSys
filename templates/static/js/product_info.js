const product_type = sessionStorage.getItem('type');
const product_id = sessionStorage.getItem('product_id');
const commentsPerPage = 5;
let currentPage = 1;
document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
    if (!token) {
        confirm("Vui lòng đăng nhập!")
        if (confirm) {
            window.location.href = "login.html";
        }
    }

    const decodeTokenUrl = 'http://127.0.0.1:8081/user/login/api/decode-token/';

    fetch(decodeTokenUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (!response.ok) {
                console.log(response);
                alert("Vui lòng đăng nhập lại!")
                if (confirm) {
                    window.location.href = "login.html";
                }
            }
            return response.json();
        })
        .then(data => {
            currentUserId = data.id;
            displayUsername(data.account.username);
            fetchProducts(`http://127.0.0.1:8082/product/api/${product_type}/${product_id}/`)
                .then(product => displayProduct(product, product_type))
                .catch(error => console.error('Error fetching products:', error));
            fetchProducts(`http://127.0.0.1:8088/comment/api/${product_type}/${product_id}/`)
                .then(comments => renderComments(comments, currentPage))
                .catch(error => console.error('Error fetching comments:', error));
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

async function displayProduct(product, product_type) {
    const productList = document.getElementById('product-list');

    productList.innerHTML = '';

    let productType;
    switch (product_type) {
        case "books":
            productType = 1;
            break;
        case "mobiles":
            productType = 2;
            break;
        case "clothes":
            productType = 3;
            break;
    }

    const productImage = document.createElement('img');
    productImage.src = product.image;
    productImage.classList.add('w-80', 'p-3', 'object-contain');
    productList.appendChild(productImage);

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('flex', 'flex-col', 'h-full', 'mt-12', 'ml-5');

    const productName = document.createElement('div');
    productName.textContent = product.name;
    productName.classList.add('text-3xl', 'text-gray-800', 'font-semibold', 'mb-2');
    contentWrapper.appendChild(productName);

    if (productType === 1) {
        const productAuthor = document.createElement('div');
        const author = await getForeignKeyName(product.author, 'authors');
        productAuthor.textContent = `Author: ${author}`;
        productAuthor.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productAuthor);

        const productPublisher = document.createElement('div');
        const publisher = await getForeignKeyName(product.publisher, 'publishers');
        productPublisher.textContent = `Publisher: ${publisher}`;
        productPublisher.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productPublisher);

        const productCategories = document.createElement('div');
        const categoryNames = await getForeignKeyNames(product.categories, 'categories');
        const categoriesText = categoryNames.join(', ');
        productCategories.textContent = `Categories: ${categoriesText}`;
        productCategories.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productCategories);

    } else if (productType === 2) {
        const productType = document.createElement('div');
        const type = await getForeignKeyName(product.type, 'mobiles-types');
        productType.textContent = `Type: ${type}`;
        productType.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productType);

        const productProducer = document.createElement('div');
        productProducer.textContent = `Producer: ${product.producer}`;
        productProducer.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productProducer);
    } else {
        const productStyle = document.createElement('div');
        const style = await getForeignKeyName(product.style, 'clothes-styles');
        productStyle.textContent = `Style: ${style}`;
        productStyle.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productStyle);

        const productProducer = document.createElement('div');
        const producer = await getForeignKeyName(product.producer, 'clothes-producers');
        productProducer.textContent = `Producer: ${producer}`;
        productProducer.classList.add('text-xl', 'text-gray-800', 'font-semibold', 'mb-2');
        contentWrapper.appendChild(productProducer);
    }

    const productPrice = document.createElement('div');
    let price = formatPrice(product.price);
    productPrice.textContent = `Price: ${price} VND`;
    productPrice.classList.add('text-xl', 'text-red-500', 'font-semibold', 'mb-2');
    contentWrapper.appendChild(productPrice);

    let quantity = 1;
    const productQuantity = document.createElement('div');
    productQuantity.classList.add('text-xl', 'flex', 'flex-row', 'mb-2');

    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = 'Quantity:';
    quantityLabel.classList.add('text-gray-800', 'font-semibold', 'mr-2');
    productQuantity.appendChild(quantityLabel);

    const decreaseButton = document.createElement('button');
    decreaseButton.textContent = '-';
    decreaseButton.classList.add('px-2', 'py-1', 'bg-gray-300', 'text-gray-800', 'font-semibold', 'rounded', 'focus:outline-none', 'hover:bg-gray-400', 'transition', 'duration-300', 'ease-in-out');

    const quantityDisplay = document.createElement('span');
    quantityDisplay.textContent = quantity;
    quantityDisplay.classList.add('px-2', 'py-1', 'text-gray-800', 'font-semibold', 'w-8', 'text-center');

    const increaseButton = document.createElement('button');
    increaseButton.textContent = '+';
    increaseButton.classList.add('px-2', 'py-1', 'bg-gray-300', 'text-gray-800', 'font-semibold', 'rounded', 'focus:outline-none', 'hover:bg-gray-400', 'transition', 'duration-300', 'ease-in-out');
    increaseButton.addEventListener('click', () => {
        quantity++;
        quantityDisplay.textContent = quantity;
    });
    decreaseButton.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
        }
    });
    productQuantity.appendChild(decreaseButton);
    productQuantity.appendChild(quantityDisplay);
    productQuantity.appendChild(increaseButton);
    contentWrapper.appendChild(productQuantity);

    const addToCartButton = document.createElement('button');
    addToCartButton.textContent = 'Add to Cart';
    addToCartButton.classList.add('w-60', 'py-2', 'bg-blue-500', 'text-white', 'uppercase', 'font-semibold', 'tracking-wider', 'hover:bg-blue-600', 'focus:outline-none', 'focus:bg-blue-600', 'transition', 'duration-300', 'ease-in-out', 'rounded-lg');
    addToCartButton.addEventListener('click', () => {
        addToCart(product.id, currentUserId, productType, quantity);
    });
    contentWrapper.appendChild(addToCartButton);
    productList.appendChild(contentWrapper);
}

function addToCart(product_id, user_id, productType, quantity) {
    let formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('user_id', user_id);
    formData.append('product_type', productType);
    formData.append('quantity', quantity);
    fetch('http://127.0.0.1:8084/cart/api/cart-items/', {
        method: 'POST',
        body: formData
    })
        .then(response => {
            if (response.ok) {
                console.log('Thêm mặt hàng thành công');
                window.location.href = "cart.html";
                return response.json();
            } else {
                return response.json().then(data => {
                    alert(data.error);
                });
            }
            throw new Error('Network response was not ok.');
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
}

function renderComments(comments, page) {
    const start = (page - 1) * commentsPerPage;
    const end = start + commentsPerPage;
    const paginatedComments = comments.slice(start, end);

    const commentsList = document.getElementById('comments-list');
    commentsList.innerHTML = '';

    paginatedComments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('border', 'p-4', 'mb-4', 'bg-white');

        const usernameDiv = document.createElement('div');
        fetchProducts(`http://127.0.0.1:8081/user/api/user-info/${comment.user_id}/`)
            .then(user => {
                usernameDiv.textContent = `Name: ${user.account.username}`;
            })
        usernameDiv.classList.add('font-bold', 'mb-2');

        const contentDiv = document.createElement('div');
        contentDiv.textContent = `Comment: ${comment.content}`;
        contentDiv.classList.add('mb-2');

        const ratingDiv = document.createElement('div');
        ratingDiv.textContent = `Rating: ${comment.rating} Stars`;

        commentDiv.appendChild(usernameDiv);
        commentDiv.appendChild(contentDiv);
        commentDiv.appendChild(ratingDiv);

        commentsList.appendChild(commentDiv);
    });

    renderPagination(comments, page);
}

function renderPagination(comments, page) {
    const totalPages = Math.ceil(comments.length / commentsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('px-4', 'py-2', 'mx-1', 'border', 'rounded');
        if (i === page) {
            pageButton.classList.add('bg-blue-500', 'text-white');
        } else {
            pageButton.classList.add('bg-gray-200');
        }

        pageButton.addEventListener('click', () => {
            currentPage = i;
            renderComments(comments, currentPage);
        });

        pagination.appendChild(pageButton);
    }
}

document.getElementById('submit-comment').addEventListener('click', () => {
    const content = document.getElementById('content').value;

    if (content) {
        fetch('http://127.0.0.1:8088/comment/api/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: currentUserId,
                product_id: product_id,
                product_type: product_type,
                rating: getRatingValue(),
                content: content
            })
        })
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            })
    } else {
        alert('Please fill in all fields.');
    }
});

document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function () {
        const value = parseInt(this.getAttribute('data-value'));
        highlightStars(value);
    });
});

function highlightStars(value) {
    const stars = document.querySelectorAll('.star');
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('text-yellow-500');
        } else {
            star.classList.remove('text-yellow-500');
        }
    });
}

function getRatingValue() {
    const activeStars = document.querySelectorAll('.star.text-yellow-500');
    return activeStars.length;
}
