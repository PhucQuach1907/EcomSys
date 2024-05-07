let cart_items = [];
let total = 0;
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
            currentUsername = data.username;
            displayUsername(data.username);
            fetchProducts('http://127.0.0.1:8084/cart/api/cart-items/')
                .then(items => displayProducts(items))
                .catch(error => console.error('Error fetching clothes:', error));
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

function displayProducts(items) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    const itemNumber = document.getElementById('number-items');
    itemNumber.textContent = `You have ${items.length} items`;

    const totalParagraph = document.getElementById('total');

    items.forEach(item => {
        cart_items.push(item.id);
        const productContainer = document.createElement('div');
        productContainer.classList.add('bg-white', 'shadow-lg', 'border', 'border-black', 'rounded-lg', 'overflow-hidden', 'm-4', 'flex', 'relative');

        const productImage = document.createElement('img');
        productImage.classList.add('w-72', 'h-80', 'p-3', 'object-contain');

        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('flex', 'flex-col', 'p-4');

        const productName = document.createElement('div');
        productName.classList.add('text-gray-800', 'text-2xl', 'font-semibold', 'mb-2');

        const productQuantity = document.createElement('div');
        productQuantity.classList.add('text-gray-400', 'text-xl', 'font-semibold', 'mb-2');

        const productPrice = document.createElement('div');
        productPrice.classList.add('text-gray-800', 'font-semibold', 'text-xl', 'mb-2');

        let type = '';
        switch (item.product_type) {
            case 1:
                type = 'books';
                break;
            case 2:
                type = 'mobiles';
                break;
            case 3:
                type = 'clothes';
                break;
        }
        fetchProducts(`http://127.0.0.1:8082/product/api/${type}/${item.product_id}/`)
            .then(product => {
                productImage.src = product.image;
                productName.textContent = product.name;
                productQuantity.textContent = `Quantity: ${item.quantity}`;
                let price;
                price = formatPrice(item.quantity * product.price);
                productPrice.textContent = `Subtotal: ${price} VND`;
                total += item.quantity * product.price;
                totalParagraph.textContent = `Total: ${formatPrice(total)} VND`;
            });
        contentWrapper.appendChild(productName);
        contentWrapper.appendChild(productQuantity);
        contentWrapper.appendChild(productPrice);

        productContainer.appendChild(productImage);
        productContainer.appendChild(contentWrapper);

        productList.appendChild(productContainer);
    });
}

function handleCheckout() {
    const popup = document.createElement('div');
    popup.classList.add('fixed', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-black', 'bg-opacity-50', 'flex', 'justify-center', 'items-center', 'z-50');

    const popupContent = document.createElement('div');
    popupContent.classList.add('relative', 'flex', 'flex-col', 'bg-white', 'p-4', 'rounded-lg', 'shadow-lg', 'w-3/5', 'h-3/5', 'justify-center');

    const qrMessage = document.createElement('div');
    qrMessage.classList.add('text-center', 'text-gray-400', 'text-2xl', 'font-semibold', 'mb-2');
    qrMessage.textContent = 'Scan QR code to complete payment';
    popupContent.appendChild(qrMessage);

    const qrCode = document.createElement('img');
    qrCode.classList.add('self-center', 'w-52', 'h52');
    qrCode.src = 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png?20200615212723';
    popupContent.appendChild(qrCode);

    const closeButton = document.createElement('button');
    closeButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    closeButton.classList.add('absolute', 'top-0', 'right-0', 'mt-2', 'mr-2', 'text-xl', 'text-gray-400', 'font-semibold', 'focus:outline-none');
    closeButton.addEventListener('click', () => {
        popup.remove();
    });
    popupContent.appendChild(closeButton);

    const doneButton = document.createElement('button');
    doneButton.textContent = 'DONE';
    doneButton.classList.add('absolute', 'bottom-0', 'right-0', 'w-60', 'm-3', 'py-2', 'bg-pink-500', 'text-white', 'uppercase', 'font-semibold', 'tracking-wider', 'hover:bg-pink-600', 'focus:outline-none', 'focus:bg-pink-600', 'transition', 'duration-300', 'ease-in-out', 'rounded-lg');
    doneButton.addEventListener('click', () => {
        fetch('http://127.0.0.1:8085/payment/api/init-payment/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'user_id': currentUserId,
                'username': currentUsername,
                'cart_items': cart_items,
                'total_price': total,
                'payment_mode': 'Banking',
            })
        })
            .then(response => {
                if (response.ok) {
                    console.log('Tạo thanh toán thành công');
                    return response.json();
                } else {
                    return response.json().then(data => {
                        console.log(data.detail);
                    });
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                fetch('http://127.0.0.1:8085/payment/api/payment-status/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'payment': data.id,
                        'status': 1
                    })
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('Thanh toán thành công');
                            data.cart_items.forEach(item => {
                                deleteCartItems(item);
                                window.location.href = 'home.html';
                            })
                            return response.json();
                        } else {
                            return response.json().then(data => {
                                console.log(data.detail);
                            });
                        }
                        throw new Error('Network response was not ok.');
                    })
                    .catch(error => {
                        console.error('There was a problem with your fetch operation:', error);
                    });
            })
            .catch(error => {
                console.error('There was a problem with your fetch operation:', error);
            });
    });
    popupContent.appendChild(closeButton);
    popupContent.appendChild(doneButton);

    popup.appendChild(popupContent);
    document.body.appendChild(popup);
}

function deleteCartItems(item) {
    fetch(`http://127.0.0.1:8084/cart/api/cart-items/${item}/`, {
        method: 'DELETE'
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    })
        .catch(error => console.error('There was an error deleting cart item:', error));
}