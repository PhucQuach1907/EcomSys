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
            displayUsername(data.username);
            fetchProducts('http://127.0.0.1:8082/product/api/books/')
                .then(products => displayProducts(products, 'books'))
                .catch(error => console.error('Error fetching books:', error));

            fetchProducts('http://127.0.0.1:8082/product/api/mobiles/')
                .then(products => displayProducts(products, 'mobiles'))
                .catch(error => console.error('Error fetching mobiles:', error));

            fetchProducts('http://127.0.0.1:8082/product/api/clothes/')
                .then(products => displayProducts(products, 'clothes'))
                .catch(error => console.error('Error fetching clothes:', error));
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

function displayUsername(username) {
    const usernameSpan = document.getElementById('username');
    usernameSpan.textContent = "Hello, " + username;
}

async function fetchProducts(url) {
    const response = await fetch(url);
    return await response.json();
}

const swiper = new Swiper('.swiper-container', {
    slidesPerView: 'auto',
    spaceBetween: 16,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
});

function displayProducts(products, sectionId) {
    const section = document.getElementById(sectionId);
    const productList = section.querySelector('.product-list');

    productList.innerHTML = '';

    let index = 0;

    products.forEach(product => {
        if (index >= 4) {
            return;
        }
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
        index++;
    });
}
