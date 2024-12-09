import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDc0LsOB3pdGusE5tnzNNWwgZrVY52-qp0",
    authDomain: "optistock-4c312.firebaseapp.com",
    projectId: "optistock-4c312",
    storageBucket: "optistock-4c312.firebasestorage.app",
    messagingSenderId: "962151131446",
    appId: "1:962151131446:web:a17fb757cb71885bb0eb97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Navigation functionality
const sections = document.querySelectorAll('section');
document.querySelectorAll('nav ul li a').forEach((link) => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = e.target.dataset.section;

        sections.forEach((section) => {
            if (section.id === sectionId) {
                section.classList.remove('hidden');
            } else {
                section.classList.add('hidden');
            }
        });
    });
});

// Add active class to the clicked link
document.querySelectorAll('nav ul li a').forEach((link) => {
    link.addEventListener('click', (e) => {
        document.querySelectorAll('nav ul li a').forEach((item) => {
            item.classList.remove('active');
        });
        e.target.classList.add('active');
    });
});

// ** PRODUCTS SECTION **
// Populate category dropdown
const categorySelect = document.getElementById('product-category');

onSnapshot(collection(db, 'Categories'), (snapshot) => {
    categorySelect.innerHTML = '<option value="" disabled selected>Select a Category</option>';
    snapshot.forEach((doc) => {
        const category = doc.data();
        categorySelect.innerHTML += `<option value="${doc.id}">${category.name}</option>`;
    });
});

// Handle product form submission
document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('product-name').value;
    const description = document.getElementById('product-description').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const quantity = parseInt(document.getElementById('product-quantity').value);
    const threshold = parseInt(document.getElementById('product-threshold').value);
    const categoryId = document.getElementById('product-category').value;

    if (!categoryId) {
        alert('Please select a category.');
        return;
    }

    try {
        await addDoc(collection(db, 'Products'), { name, description, price, quantity, threshold, categoryId });
        alert('Product added successfully!');
        document.getElementById('product-form').reset();
    } catch (error) {
        console.error('Error adding product:', error);
    }
});

// Fetch and display products in the table
onSnapshot(collection(db, 'Products'), (snapshot) => {
    const productTableBody = document.querySelector('#product-table tbody');
    productTableBody.innerHTML = '';
    snapshot.forEach((doc) => {
        const product = doc.data();
        const row = `
            <tr>
                <td>${doc.id}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.price}</td>
                <td>${product.quantity}</td>
                <td>${product.threshold}</td>
                <td>${product.categoryId}</td>
            </tr>
        `;
        productTableBody.innerHTML += row;
    });
});

// ** SALES RECORDS SECTION **
document.getElementById('sales-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('sales-product-id').value;
    const quantitySold = parseInt(document.getElementById('sales-quantity').value);
    const date = document.getElementById('sales-date').value;

    try {
        await addDoc(collection(db, 'SalesRecords'), { product_id: productId, quantity_sold: quantitySold, date });
        alert('Sales record added successfully!');
        document.getElementById('sales-form').reset();
    } catch (error) {
        console.error('Error adding sales record:', error);
    }
});

// Fetch and display sales records in the table
onSnapshot(collection(db, 'SalesRecords'), (snapshot) => {
    const salesTableBody = document.querySelector('#sales-table tbody');
    salesTableBody.innerHTML = '';
    snapshot.forEach((doc) => {
        const record = doc.data();
        const row = `
            <tr>
                <td>${doc.id}</td>
                <td>${record.product_id}</td>
                <td>${record.quantity_sold}</td>
                <td>${record.date}</td>
            </tr>
        `;
        salesTableBody.innerHTML += row;
    });
});

// ** CATEGORIES SECTION **
document.getElementById('category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('category-name').value;

    try {
        await addDoc(collection(db, 'Categories'), { name });
        alert('Category added successfully!');
        document.getElementById('category-form').reset();
    } catch (error) {
        console.error('Error adding category:', error);
    }
});

// Fetch and display categories in the table
onSnapshot(collection(db, 'Categories'), (snapshot) => {
    const categoryTableBody = document.querySelector('#category-table tbody');
    categoryTableBody.innerHTML = '';
    snapshot.forEach((doc) => {
        const category = doc.data();
        const row = `
            <tr>
                <td>${doc.id}</td>
                <td>${category.name}</td>
            </tr>
        `;
        categoryTableBody.innerHTML += row;
    });
});

// ** PRODUCT CATEGORIES SECTION **
document.getElementById('product-category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const productId = document.getElementById('product-id').value;
    const categoryId = document.getElementById('category-id').value;

    try {
        await addDoc(collection(db, 'ProductCategories'), { product_id: productId, category_id: categoryId });
        alert('Product-Category relation added successfully!');
        document.getElementById('product-category-form').reset();
    } catch (error) {
        console.error('Error adding product-category relation:', error);
    }
});

// Fetch and display product-category relationships in the table
onSnapshot(collection(db, 'ProductCategories'), (snapshot) => {
    const productCategoryTableBody = document.querySelector('#product-category-table tbody');
    productCategoryTableBody.innerHTML = '';
    snapshot.forEach((doc) => {
        const relation = doc.data();
        const row = `
            <tr>
                <td>${relation.product_id}</td>
                <td>${relation.category_id}</td>
            </tr>
        `;
        productCategoryTableBody.innerHTML += row;
    });
});
