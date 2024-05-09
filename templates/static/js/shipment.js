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
            fetchProducts('http://127.0.0.1:8086/shipment/api/shipment-updates/')
                .then(orders => displayOrders(orders))
                .catch(error => console.error('Error fetching clothes:', error));
        })
        .catch(error => {
            console.error('There was a problem with your fetch operation:', error);
        });
});

function getProductList(products, productTypes) {
    const productList = document.createElement('ul');
    productList.classList.add('mb-4');

    products.forEach((product_id, index) => {
        let type = '';
        switch (productTypes[index]) {
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

        fetchProducts(`http://127.0.0.1:8082/product/api/${type}/${product_id}/`)
            .then(product => {
                const productItem = document.createElement('li');
                productItem.classList.add('text-gray-600', 'font-semibold');
                productItem.textContent = `Product: ${product.name}`;
                productList.appendChild(productItem);
            });
    });

    return productList;
}

function displayOrders(orders) {
    const orderList = document.getElementById('order-list');
    orderList.innerHTML = '';

    orders.forEach(order => {
        if (order.user_id === currentUserId) {
            const orderContainer = document.createElement('div');
            orderContainer.classList.add('bg-white', 'shadow-lg', 'rounded-lg', 'p-4', 'mb-4');

            const clientName = document.createElement('p');
            clientName.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            clientName.textContent = `Name: ${order.client_name}`;
            orderContainer.appendChild(clientName);

            const mobileNumber = document.createElement('p');
            mobileNumber.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            mobileNumber.textContent = `Mobile Number: ${order.mobile_number}`;
            orderContainer.appendChild(mobileNumber);

            const address = document.createElement('p');
            address.classList.add('text-gray-600', 'font-semibold', 'mb-2');
            address.textContent = `Address: ${order.address}`;
            orderContainer.appendChild(address);

            const productList = getProductList(order.products, order.products_type);
            orderContainer.appendChild(productList);

            const status = document.createElement('p');
            status.classList.add('text-red-600', 'font-semibold', 'mb-2');
            fetchProducts(`http://127.0.0.1:8086/shipment/api/shipment-status/`)
                .then(shipments => {
                    shipments.forEach(shipment => {
                        console.log(shipment, order.id)
                        if (shipment.shipment === order.id) {
                            status.textContent = `Status: ${shipment.status}`;
                        }
                    })
                })
            orderContainer.appendChild(status);

            orderList.appendChild(orderContainer);
        }
    });
}

