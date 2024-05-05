document.addEventListener('DOMContentLoaded', function () {
    const token = sessionStorage.getItem('token');
    const type = sessionStorage.getItem('type');
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
            displayUsername(data.username);
            displayProductType(type);
            let productUrl = 'http://127.0.0.1:8082/product/api/' + type + '/';
            fetchProducts(productUrl)
                .then(products => displayProducts(products, 'product-section', 1))
                .catch(error => console.error('Error fetching books:', error));
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

function displayProducts(products, sectionId, currentPage) {
    const productList = document.getElementById('product-list');
    const pagination = document.getElementById('pagination');

    productList.innerHTML = '';
    pagination.innerHTML = '';

    const itemsPerPage = 8;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedProducts = products.slice(startIndex, endIndex);

    paginatedProducts.forEach(product => {
        const productContainer = document.createElement('div');
        productContainer.classList.add('w-60', 'bg-white', 'shadow-lg', 'border', 'border-black', 'rounded-lg', 'overflow-hidden', 'm-4', 'flex', 'flex-col');

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('flex', 'flex-col', 'h-full', 'justify-between');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productImage.classList.add('w-72', 'h-80', 'p-3', 'object-contain');
        contentWrapper.appendChild(productImage);

        const productName = document.createElement('div');
        productName.textContent = product.name;
        productName.classList.add('px-4', 'py-2', 'text-gray-800', 'font-semibold');
        contentWrapper.appendChild(productName);

        const productPrice = document.createElement('div');
        productPrice.textContent = `Price: ${product.price} VND`;
        productPrice.classList.add('px-4', 'py-2', 'text-red-500');
        contentWrapper.appendChild(productPrice);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.classList.add('w-full', 'py-2', 'bg-blue-500', 'text-white', 'uppercase', 'font-semibold', 'tracking-wider', 'hover:bg-blue-600', 'focus:outline-none', 'focus:bg-blue-600', 'transition', 'duration-300', 'ease-in-out', 'rounded-b-lg');
        productContainer.appendChild(contentWrapper);
        productContainer.appendChild(addToCartButton);

        productList.appendChild(productContainer);
    });

    const totalPages = Math.ceil(products.length / itemsPerPage);
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        const pageLink = document.createElement('a');
        pageLink.href = `?page=${i}`;
        pageLink.textContent = i;
        pageLink.classList.add('px-3', 'py-2');
        if (i === currentPage) {
            pageLink.classList.add('bg-blue-500', 'text-white');
        } else {
            pageLink.classList.add('text-blue-500', 'hover:bg-blue-200');
        }
        pageLink.addEventListener('click', function (event) {
            event.preventDefault();
            displayProducts(products, 'product-section', i);
            window.history.pushState({}, '', `?page=${i}`);
        });
        pageItem.appendChild(pageLink);
        pagination.appendChild(pageItem);
    }
}

async function fetchProducts(url) {
    const response = await fetch(url);
    return await response.json();
}

function displayUsername(username) {
    const usernameSpan = document.getElementById('username');
    usernameSpan.textContent = "Hello, " + username;
}

function displayProductType(type) {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    const productTitle = document.getElementById('product-type');
    productTitle.textContent = capitalizedType;
}

function handleSearch() {
    const query = document.getElementById('product-searchbar').value;
    const type = sessionStorage.getItem('type');
    if (!query) {
        window.location.reload();
    }
    let product_type;
    switch (type) {
        case "books":
            product_type = 1;
            break;
        case "mobiles":
            product_type = 2;
            break;
        case "clothes":
            product_type = 3;
            break;
    }
    fetchProducts(`http://127.0.0.1:8083/search/?query=${query}&type=${product_type}`)
        .then(products => displayProducts(products, 'product-section', 1))
        .catch(error => console.error('Error fetching books:', error));
}

function handleSearchByImage() {
    let input = document.getElementById('image-input');
    const type = sessionStorage.getItem('type');
    let product_type;
    switch (type) {
        case "books":
            product_type = 1;
            break;
        case "mobiles":
            product_type = 2;
            break;
        case "clothes":
            product_type = 3;
            break;
    }
    input.onchange = function (e) {
        let file = e.target.files[0];
        let formData = new FormData();
        formData.append('image', file);
        formData.append('type', product_type);

        let promise = fetch('http://127.0.0.1:8083/search-by-image/', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                displayProducts(data, 'product-section', 1)
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    };
    input.click();
}