// -------------------scrolling navbar -----------------------
let lastScrollTop = 0 ;
const navbar = document.querySelector("nav");
// const navbarCart = document.getElementById("navbarCart");

window.addEventListener("scroll", function () {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        navbar.style.top = "-70px"; 
        
    } else {
        navbar.style.top = "0";
        
    }
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; 
});



// ------------------------ icons for contact------------------------
    const clickedForShow = document.querySelector('.clickedForShow');
    const faXmark = document.querySelector('.fa-xmark');
    const iconsContact = document.querySelector('.hideIcons');

    clickedForShow.addEventListener("click" , ()=>{
        clickedForShow.style.display = "none";
        faXmark.style.display = "block";
        iconsContact.classList.remove('dNone');
    });

    faXmark.addEventListener("click", ()=>{
        clickedForShow.style.display = "block";
        faXmark.style.display = "none";
        iconsContact.classList.add('dNone');
    });

// ------------------------end of icons for contact------------------------


// ---------------------------------------- firebase signin /signup-------------------
const firebaseConfig = {
    apiKey: "AIzaSyDVOLhm7aCmLVADT24qbrRpXFwsFSNm80s",
    authDomain: "online-shop-63a33.firebaseapp.com",
    projectId: "online-shop-63a33",
    storageBucket: "online-shop-63a33.appspot.com",
    messagingSenderId: "1045983279947",
    appId: "1:1045983279947:web:b7640999c6111f91bd86ce",
    measurementId: "G-CKPTP931EX"
    };

  // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    const storage = firebase.storage();

    // Utility: update all known profile image elements
    function updateAllProfileImages(newSrc) {
        if (!newSrc) return;
        document.querySelectorAll('#imgSrcinput, #imgSrcinputSide').forEach((img) => {
            if (img) img.src = newSrc;
        });
    }

    // Apply stored profile photo ASAP (before auth resolves)
    (function applyStoredProfilePhotoEarly() {
        const storedPhotoUrl = localStorage.getItem('profilePhotoURL');
        const storedPhotoDataUrl = localStorage.getItem('profilePhotoDataURL');
        const earlySrc = storedPhotoUrl || storedPhotoDataUrl;
        if (!earlySrc) return;
        updateAllProfileImages(earlySrc);
    })();

    // Cross-tab sync: respond to localStorage changes
    window.addEventListener('storage', () => {
        const src = localStorage.getItem('profilePhotoURL') || localStorage.getItem('profilePhotoDataURL');
        if (src) updateAllProfileImages(src);
    });

    // BroadcastChannel for instant multi-tab updates
    const profilePhotoChannel = 'BroadcastChannel' in window ? new BroadcastChannel('profile-photo') : null;
    if (profilePhotoChannel) {
        profilePhotoChannel.onmessage = (event) => {
            const data = event && event.data ? event.data : {};
            if (data.url) updateAllProfileImages(data.url);
            else if (data.temp) updateAllProfileImages(data.temp);
        };
    }


function signUp() {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const username = document.getElementById('signupUsername').value;
    const error = document.getElementById("error");
    let text = "";

    if (username.length === 0){
        text = "please enter username";
        error.innerHTML = text;
        return false;
    }
    else if (username.length < 5 || username.length > 40){
        text = "username must be 5 letters or more";
        error.innerHTML = text;
        return false;
    }
    else  if (email.indexOf("@") == -1 ) {
        text = "please enter valid email";
        error.innerHTML = text;
        return false;
    }
    else if (password.length === 0){
        text = "please enter valid password";
        error.innerHTML = text;
        return false;
    }
    else if (password.length < 7 ){
        text = "password must be seven letters or more";
        error.innerHTML = text;
        return false;
    }
    

    auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        return user.updateProfile({
        displayName: username
    });
    })
    .then(() => {
        alert("account create successfully");
        window.location.href = "index.html";
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });
}


// ----------------------------signin-----------------------
function signIn() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorsignin = document.getElementById("error");
    let textSignin = "";
    if(email.length === 0){
        textSignin = "please enter email";
        errorsignin.innerHTML = textSignin;
        return false;
    }
    else  if (email.indexOf("@") == -1 ) {
        textSignin = "please enter valid email";
        errorsignin.innerHTML = textSignin;
        return false;
    }
    else if (password.length === 0){
        textSignin = "please enter valid password";
        errorsignin.innerHTML = textSignin;
        return false;
    }
    else if (password.length < 7 ){
        textSignin = "please enter valid password";
        errorsignin.innerHTML = textSignin;
        return false;
    }
    

    auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        alert("welcome to our site");
        window.location.href = "index.html";
        })
        .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    });
}

    auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user.email);
        localStorage.setItem("isLoggedIn", "true"); 
        localStorage.setItem("userEmail", user.email); 
    } else {
        console.log("User is signed out");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
    }
    });

// ------------------------------end of login and sign up-----------------------------------

// ------------------------------show profile link--------------------------
firebase.auth().onAuthStateChanged((user) => {
    const profileLink = document.querySelector('.profileLink');
    const profileLinkSide = document.querySelector('.profileLinkSide');
    const loginDiv = document.querySelector('.login');
    const loginDivSide = document.querySelector('.loginSide');
    const usernameInput = document.getElementById('usernameInput');
    const usernameInputSide = document.getElementById('usernameInputSide');
    const imgSrcinput = document.getElementById('imgSrcinput');
    const imgSrcinputSide = document.getElementById('imgSrcinputSide');
    const orders = document.querySelector('.orders');

    if (user) {
        if (usernameInput)
            usernameInput.textContent = `Hello, ${user.displayName}` || ` Hello, ${user.email.split('@')[0]}`;
        if (usernameInputSide)
            usernameInputSide.textContent = `Hello, ${user.displayName}` || ` Hello, ${user.email.split('@')[0]}`;
        const storedPhotoUrl = localStorage.getItem('profilePhotoURL');
        const effectivePhotoUrl = storedPhotoUrl || user.photoURL || 'icon-7797704_640.png';
        if (imgSrcinput) imgSrcinput.src = effectivePhotoUrl;
        if (imgSrcinputSide) imgSrcinputSide.src = effectivePhotoUrl;
        updateAllProfileImages(effectivePhotoUrl);

        // enable click-to-upload on profile images
        enableProfileImageUpload(imgSrcinput, user);
        enableProfileImageUpload(imgSrcinputSide, user);

        // If local stored URL exists and differs from Firebase, push it to Firebase so it persists across sessions/devices
        if (storedPhotoUrl && user.photoURL !== storedPhotoUrl) {
            user.updateProfile({ photoURL: storedPhotoUrl })
                .then(() => {
                    try { auth.currentUser && auth.currentUser.reload && auth.currentUser.reload(); } catch (_) {}
                })
                .catch((e) => console.warn('Could not sync stored photoURL to Firebase:', e));
        }

        // Ensure we have the latest profile data from Firebase, then update everywhere and sync to localStorage
        try {
            user.reload().then(() => {
                const refreshed = auth.currentUser;
                if (refreshed && refreshed.photoURL) {
                    localStorage.setItem('profilePhotoURL', refreshed.photoURL);
                    updateAllProfileImages(refreshed.photoURL);
                }
            }).catch(() => {});
        } catch (_) {}

        if (profileLink) profileLink.classList.remove('hiddenLink');
        if (profileLinkSide) profileLinkSide.classList.remove('hiddenLinkSide');
        if (loginDiv) loginDiv.style.display = 'none';
        if (loginDivSide) loginDivSide.style.display = 'none';
        if (orders) orders.style.padding = '3px';
    } else {
        if (profileLink) profileLink.classList.add('hiddenLink');
        if (profileLinkSide) profileLinkSide.classList.add('hiddenLinkSide');
        if (loginDiv) loginDiv.style.display = 'block';
        if (loginDivSide) loginDivSide.style.display = 'block';
        if (orders) orders.style.padding = '20px 5px 3px 5px';
    }
});

// signOut--------
function signOut() {
    firebase.auth().signOut()
        .then(() => {
            console.log('login ok');
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error('login mistake', error);
        });
}
// signOut from menubar-----------
function signOutSide() {
    firebase.auth().signOut()
        .then(() => {
            console.log('login ok');
            window.location.href = "index.html";
        })
        .catch((error) => {
            console.error('login mistake', error);
        });
}
// ----------------- show and hide password------------------

    function togglePassword() {
        const passwordInput = document.getElementById('loginPassword');
        const toggleIcon = document.querySelector('.openEye');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } 
        else {
            passwordInput.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
}
function togglePasswordSignup() {
        const signupPassword = document.querySelector('#signupPassword');
        const toggleIcon = document.querySelector('.openEyeSignup');
        
        if (signupPassword.type === 'password') {
            
            signupPassword.type = 'text';
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        } 
        else {
            signupPassword.type = 'password';
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        }
}

// -------------------------------------start function of show menubar-------------------------------

function showMenubar(){

    const rightSideNavMenu = document.querySelector('.rightSideNavMenu');

    rightSideNavMenu.classList.toggle('toggelMenu');

}

// ---click any where to close menubar---
document.addEventListener('click', (event) => {
    const rightSideNavMenu = document.querySelector('.rightSideNavMenu');
    const menuIcon = document.querySelector('.fa-bars');
    if (!rightSideNavMenu || !menuIcon) return;
    if (!rightSideNavMenu.contains(event.target) && !menuIcon.contains(event.target)) {
        rightSideNavMenu.classList.remove('toggelMenu');
    }
});

// --------------------------------------end function of show menubar--------------------------------
// -------------------------------------start function of show menubar of navbar two-------------------------------

function showMenubarTwo(){

    const leftSideNavMenu = document.querySelector('.leftMenuNavTwo');
    const overlayElement = document.querySelector('.overlay');

    leftSideNavMenu.classList.toggle('toggelMenuTwo');
    overlayElement.classList.toggle('navTwoActionMenubar');
}

// ---click any where to close menubar---
document.addEventListener('click', (event) => {
    const leftSideNavMenu = document.querySelector('.leftMenuNavTwo');
    const leftMenuIcon = document.querySelector('.fa-bars-secondNav');
    if (!leftSideNavMenu || !leftMenuIcon) return;
    if (!leftSideNavMenu.contains(event.target) && !leftMenuIcon.contains(event.target)) {
        leftSideNavMenu.classList.remove('toggelMenuTwo');
        overlayElement.classList.remove('navTwoActionMenubar');    }
});
// --------------------------------------end function of show menubar of navbar two--------------------------------
//-------------------------------start function to show popUp location--------------------------

const popUpOfLcation = document.querySelector('.popUpOfLcation');
const overlayElement = document.querySelector('.overlay');
let popupJustOpened = false;

function showPopUp(){
    if (!popUpOfLcation) return;
    popUpOfLcation.classList.add('showPop');
    if (overlayElement) overlayElement.style.display = 'block';

    // Prevent the initial click that opens the popup from immediately closing it
    popupJustOpened = true;
    setTimeout(() => {
        popupJustOpened = false;
    }, 0);
}
function closePopUp(){
    if (!popUpOfLcation) return;
    popUpOfLcation.classList.remove('showPop');
    if (overlayElement) overlayElement.style.display = 'none';
}

// Close when clicking on overlay
if (overlayElement) {
    overlayElement.addEventListener('click', () => {
        if (popUpOfLcation && popUpOfLcation.classList.contains('showPop')) {
            closePopUp();
            overlayElement.style.display = 'none';
        }
    });
}

// Close when clicking anywhere outside the popup
document.addEventListener('click', (event) => {
    if (!popUpOfLcation) return;
    if (popupJustOpened) return;
    if (!popUpOfLcation.classList.contains('showPop')) return;
    const clickInsidePopup = popUpOfLcation.contains(event.target);
    if (!clickInsidePopup) {
        closePopUp();
    }
});

// Close on Escape key
document.addEventListener('keydown', (event) => {
    if (!popUpOfLcation) return;
    if (event.key === 'Escape' && popUpOfLcation.classList.contains('showPop')) {
        closePopUp();
    }
});

//-------------------------------end function to show popUp location--------------------------

// -------------------------------populate countries and bind selection----------------------
(function initCountrySelection() {
    const countrySelect = document.getElementById('cuntryy');
    const locationTitleNodes = document.querySelectorAll('.location .selectionCuntry h1, .cuntryselect');

    if (!countrySelect || !locationTitleNodes.length) {
        return;
    }

    function updateLocationTitles(countryName) {
        locationTitleNodes.forEach((node) => {
            node.textContent = countryName;
        });
    }

    function applyStoredCountry() {
        const stored = localStorage.getItem('selectedCountryName');
        if (stored) {
            updateLocationTitles(stored);
            // Set select value if present in options
            const optionToSelect = Array.from(countrySelect.options).find(
                (opt) => opt.value === stored
            );
            if (optionToSelect) {
                countrySelect.value = stored;
            }
        }
    }

    async function populateCountries() {
        // Add a placeholder option first
        if (!countrySelect.querySelector('option[disabled]')) {
            const placeholder = document.createElement('option');
            placeholder.textContent = 'Select your country';
            placeholder.value = '';
            placeholder.disabled = true;
            placeholder.selected = true;
            countrySelect.appendChild(placeholder);
        }

        try {
            const response = await fetch('https://restcountries.com/v3.1/all?fields=name');
            if (!response.ok) throw new Error('Failed to load countries');
            const countries = await response.json();
            const names = countries
                .map((c) => c?.name?.common)
                .filter(Boolean)
                .sort((a, b) => a.localeCompare(b));

            // Clear existing non-placeholder options
            Array.from(countrySelect.options)
                .filter((opt) => !opt.disabled)
                .forEach((opt) => opt.remove());

            names.forEach((name) => {
                const opt = document.createElement('option');
                opt.value = name;
                opt.textContent = name;
                countrySelect.appendChild(opt);
            });

            // Apply stored selection after populating
            applyStoredCountry();
        } catch (err) {
            // Fallback minimal list
            const fallback = ['Egypt', 'United States', 'United Kingdom', 'Germany', 'France', 'Saudi Arabia', 'United Arab Emirates'];
            fallback.forEach((name) => {
                if (!Array.from(countrySelect.options).some((o) => o.value === name)) {
                    const opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    countrySelect.appendChild(opt);
                }
            });
            applyStoredCountry();
        }
    }

    // On change, update titles, persist and close popup
    countrySelect.addEventListener('change', (e) => {
        const selectedName = e.target.value;
        if (!selectedName) return;
        updateLocationTitles(selectedName);
        localStorage.setItem('selectedCountryName', selectedName);
        closePopUp();
    });

    // Initialize on load
    applyStoredCountry();
    populateCountries();
})();
// -------------------------------end countries selection------------------------------------

// -------------------------------profile image upload (Firebase Storage)-------------------
function enableProfileImageUpload(imageElement, user) {
    if (!imageElement || !user) return;
    // Avoid double-binding
    if (imageElement.dataset.boundUpload === 'true') return;
    imageElement.dataset.boundUpload = 'true';

    imageElement.addEventListener('click', async (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        try {
            const file = await pickImageFile();
            if (!file) return;

            // Temporary preview in localStorage while upload happens
            const dataUrl = await fileToDataURL(file);
            localStorage.setItem('profilePhotoDataURL', dataUrl);
            updateAllProfileImages(dataUrl);
            if (profilePhotoChannel) profilePhotoChannel.postMessage({ temp: dataUrl });

            const fileRef = storage.ref().child(`profilePhotos/${user.uid}/${Date.now()}_${file.name}`);
            const snapshot = await fileRef.put(file);
            const downloadURL = await snapshot.ref.getDownloadURL();

            // Update Firebase Auth profile
            await user.updateProfile({ photoURL: downloadURL });

            // Persist for cross-page usage
            localStorage.setItem('profilePhotoURL', downloadURL);
            localStorage.removeItem('profilePhotoDataURL');

            updateAllProfileImages(downloadURL);
            if (profilePhotoChannel) profilePhotoChannel.postMessage({ url: downloadURL });
            alert('Profile photo updated');
        } catch (err) {
            console.error('Upload failed', err);
            alert('Failed to update photo: ' + (err && err.message ? err.message : err));
        }
    });
}

function pickImageFile() {
    return new Promise((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = () => {
            const file = input.files && input.files[0];
            resolve(file || null);
        };
        input.click();
    });
}
function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
// -------------------------------end profile image upload---------------------------------

// ----------------------imgs slider in first section------------------------

const imgs = document.querySelectorAll('.imgsChange ul img');
const prevBtn = document.querySelector('.controlPrev');
const nextBtn = document.querySelector('.controlNext');
let x = 0;
function changeSlider(){
    if (!imgs || imgs.length === 0) return;
    for (let i=0 ; i < imgs.length ; i++){
        // imgs[i].style.display = 'none';
        imgs[i].classList.remove('active');
    }
        // imgs[x].style.display ='block';
        imgs[x].classList.add('active');

}
if (imgs && imgs.length > 0) {
    changeSlider();



    prevBtn.addEventListener('click', ()=>{

        if (x > 0){
            x--;
        }else{
            x = imgs.length - 1;
        }
        changeSlider();
    });
    nextBtn.addEventListener('click', ()=>{

    if (x < imgs.length - 1){
        x++;
    }else{
        x = 0;
    }
    changeSlider();
    });
}
setInterval(() => {
    if (x < imgs.length - 1) {
        x++;
    } else {
        x = 0;
    }
    changeSlider();
}, 4000);

// ----------------------End of imgs slider in first section------------------------




fetch('https://fakestoreapi.com/products')
.then(res => res.json())
.then(console.log);

fetch('https://dummyjson.com/products')
.then(res => res.json())
.then(console.log);
fetch("https://fakestoreapi.in/api/products")
.then(res => res.json())
.then(res => console.log(res))



// ------------------------fetch data from api and display it in the page------------------------
const productsContainer = document.querySelector(".prouductsCard");
const pageNumbers = document.querySelector("#pageNumbers");
const prevBtnSlider = document.querySelector(".fa-angles-left");
const nextBtnSlider = document.querySelector(".fa-angles-right");
const cartCount = document.querySelector(".count");
const cartPage = document.getElementById("cartPage");
// const Checkout = document.querySelector('.containCheck');



let filteredProducts = []; //=================
let products = [];
const perPage = 12;
let currentPage = 1;
let totalPages = 1;
let cart = JSON.parse(localStorage.getItem("cart")) || [];


async function fetchProducts() {
    if (!productsContainer) return;
  // Fake Store API
    const res1 = await fetch("https://fakestoreapi.com/products");
    const data1 = await res1.json();

  // DummyJSON API
    const res2 = await fetch("https://dummyjson.com/products");
    const data2 = await res2.json();
  // FakeStore API
    const res3 = await fetch("https://fakestoreapi.in/api/products");
    const data3 = await res3.json();

    products = [
    ...data3.products.map(p => ({
        id:  p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        description: p.description,
        category: p.category

    })),
    ...data1.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
        description: p.description,
        category: p.category
    })),
    ...data2.products.map(p => ({
        id:  p.id,
        title: p.title,
        price: p.price,
        image: p.thumbnail,
        description: p.description,
        category: p.category
    }))
    
    ];

    totalPages = Math.ceil(products.length / perPage);
    filteredProducts = products;          
    currentPage = 1;
    displayProductsList(filteredProducts, currentPage);
    setupPagination(filteredProducts);
    loadCategories(products);
    
}
// =========================================================================================product page


        function addToCart(product) {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        saveCart();
        alert("✅ Added to cart");
        }

        function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        }

        async function loadProductPage() {

            const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        if (!productId) return;
        // Fake Store API
            const res1 = await fetch("https://fakestoreapi.com/products");
            const data1 = await res1.json();

        // DummyJSON API
            const res2 = await fetch("https://dummyjson.com/products");
            const data2 = await res2.json();
        // FakeStore API
            const res3 = await fetch("https://fakestoreapi.in/api/products");
            const data3 = await res3.json();
            

            products = [
            ...data3.products.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                image: p.image,
                description: p.description,
                category: p.category,
                
            })),
            ...data1.map(p => ({
                id:p.id,
                title: p.title,
                price: p.price,
                image: p.image,
                description: p.description,
                category: p.category,
                
            })),
            ...data2.products.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                image: p.thumbnail,
                description: p.description,
                category: p.category,
                
            }))
            
            ];

        

        const product = products.find(p => p.id == productId);

        const detailsDiv = document.getElementById("productDetails");
        detailsDiv.innerHTML = `
            <div class="product">
                <img class="cartImgProduct" src="${product.image}" alt="${product.title}">
                <div class="containInfo">
                    <h4>${product.title}</h4>
                    <p>Price: $${product.price}</p>
                    <p>Category: ${product.category}</p>
                    <p class="desc">${product.description}</p>
                    <button id="addBtn" class="btn btn-primary addToCart" >Add to Cart</button>
                </div>
            </div>
        `;

        document.getElementById("addBtn").addEventListener("click", () => {
            addToCart(product);
        });

        const similar = products.filter(p => p.category === product.category && p.id != product.id);

        const similarDiv = document.getElementById("similarProducts");
        similar.forEach(p => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.innerHTML = `
            <div class=" col-sm-6 col-lg-3 similarCard" style="width: 19rem;">
                <h5 class="card-title">${p.title}</h5>
                <a class="hrefId" href="ProductPage.html?id=${p.id}">
                    <img src="${p.image}" class="card-img-top productImg" alt="${p.title}">
                </a>
                
                <div class="card-body">
                <p class="card-text">${p.description}</p>
                <p class="card-text price">$${p.price}</p>
                <a class="btn btn-primary addToCart">Add to cart</a>
                </div>
            </div>`;
            similarDiv.appendChild(card);
            card.querySelector(".addToCart").addEventListener("click", () => addToCart(p));
        });
        }

        loadProductPage();


// ===================================================================================





function displayProductsList(list, page = 1) {
  if (!productsContainer) return;
  productsContainer.innerHTML = "";

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const paginated = list.slice(start, end);

  paginated.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="card col-sm-6 col-lg-3 productCard" style="width: 19rem;">
        <h5 class="card-title">${p.title}</h5>
        <a href="ProductPage.html?id=${p.id}">
            <img src="${p.image}" class="card-img-top productImg" alt="${p.title}">
        </a>
        
        <div class="card-body">
          <p class="card-text">${p.description}</p>
          <p class="card-text price">$${p.price}</p>
          <a class="btn btn-primary addToCart">Add to cart</a>
        </div>
      </div>`;
    productsContainer.appendChild(div);
    div.querySelector(".addToCart").addEventListener("click", () => addToCart(p));
  });
}

function loadCategories(products) {
  const secondNavbar = document.querySelector('.secondNavbar ul');
  const select = document.getElementById('categorySelect');

  const categories = ["all", ...new Set(products.map(p => p.category))];

  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(option);

    const li = document.createElement('li');
    li.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    li.addEventListener("click", () => handleCategoryFilter(cat));
    secondNavbar.appendChild(li);
  });
}


function handleCategoryFilter(category) {
  filteredProducts = (category === "all")
    ? products
    : products.filter(p => p.category === category);

  currentPage = 1;
  displayProductsList(filteredProducts, currentPage);
  setupPagination(filteredProducts);
}


function displayProducts(page) {
    if (!productsContainer) return;
    productsContainer.innerHTML = "";
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginated = products.slice(start, end);
    


    paginated.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="card col-sm-6 col-lg-3 productCard" style="width: 19rem;">
            <h5 class="card-title">${p.title}</h5>
            <img src="${p.image}" class="card-img-top productImg"  alt="${p.title}">
            <div class="card-body">
                <p class="card-text">${p.description}</p>
                <p class="card-text price">$${p.price}</p>
                <a  class="btn btn-primary addToCart">Add to cart</a>
            </div>
        </div>
        `;
        productsContainer.appendChild(div);
        div.querySelector(".addToCart").addEventListener("click", () => {
            addToCart(p);
        });
    });


}


function setupPagination(list) {
  pageNumbers.innerHTML = "";
  totalPages = Math.ceil(list.length / perPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.classList.add("pgNumper");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("actBtn");
    btn.addEventListener("click", () => {
      currentPage = i;
      displayProductsList(list, currentPage);
      setupPagination(list);
    });
    pageNumbers.appendChild(btn);
  }
}


prevBtnSlider?.addEventListener("click", () => {
    if (currentPage > 1) {
    currentPage--;
        displayProductsList(filteredProducts, currentPage);
        setupPagination(filteredProducts);
    }
});

nextBtnSlider?.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        displayProductsList(filteredProducts, currentPage);
        setupPagination(filteredProducts);
    }
});

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        updateCartCount();
        saveCart();
        displayCart();
}

function updateCartCount() {
    // Update both navbar cart count and right side menu cart count
    const cartCounts = document.querySelectorAll('.count');
    if (cartCounts.length === 0) return; 
    
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    
    cartCounts.forEach(countElement => {
        countElement.textContent = totalQty;
    });
}

function displayCart() {
    if (!cartPage) return; //---------------------------------------
  cartPage.innerHTML = "";
  if (cart.length === 0) {
    cartPage.innerHTML = "<p>Cart is empty.</p>";
    return;
  }

  let total = 0;

    cart.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.innerHTML = `
            <div class="product">
                <img class="cartImgProduct" src="${item.image}" alt="${item.title}">
                <div class="containInfo">
                    <h4>${item.title}</h4>
                    <p>$${item.price}</p>
                    <p class="desc">${item.description}</p>
                    <div class="qty-controls">
                        <button class="decrease">-</button>
                        <span>Qty: ${item.qty}</span>
                        <button class="increase">+</button>
                    </div>
                    <button class="remove-btn">Remove</button>
                    
                </div>
            </div>
        `;
        cartPage.appendChild(div);

        total += item.price * item.qty;

        div.querySelector(".increase").addEventListener("click", () => {
        item.qty++;
        saveCart();
        updateCartCount();
        displayCart();
        });

        div.querySelector(".decrease").addEventListener("click", () => {
        if (item.qty > 1) {
            item.qty--;
        } else {
            cart = cart.filter(p => p.id !== item.id);
        }
        saveCart();
        updateCartCount();
        displayCart();
        });

        div.querySelector(".remove-btn").addEventListener("click", () => {
        cart = cart.filter(p => p.id !== item.id);
        saveCart();
        updateCartCount();
        displayCart();
        });
    });

  const totalDiv = document.createElement("div");
  totalDiv.classList.add("totalDivContain");
  const totalP = document.createElement("p");
  totalP.classList.add("totalPrice");
  const confirmBtn = document.createElement("a");
  confirmBtn.textContent = "Confirm Order";
  confirmBtn.href = "Checkout.html";
  confirmBtn.classList.add("confirnBtn");
  
  totalP.textContent = `Total: $${total.toFixed(2)}`;
  cartPage.appendChild(totalDiv);
  totalDiv.appendChild(totalP);
  totalDiv.appendChild(confirmBtn);

}
function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
    }

// Function to clear cart completely
function clearCart() {
    cart = [];
    localStorage.removeItem("cart");
    updateCartCount();
    if (cartPage) {
        displayCart();
    }
}

function loadCart() {
    const saved = localStorage.getItem("cart");
    if (saved) {
    cart = JSON.parse(saved);
    updateCartCount();
    displayCart();
    }
}

function handleSearch() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase();
    const categoryValue = document.getElementById('categorySelect').value;

    const filtered = products.filter(p => {
        const matchCategory = categoryValue === 'all' || p.category === categoryValue;
        const matchText = p.title.toLowerCase().includes(searchValue);
        return matchCategory && matchText;
    });

    displayProductsList(filtered);
}



//price filter
function handlePriceFilter() {
    const min = parseFloat(document.getElementById("minPrice").value) || 0;
    const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    const priceFiltered = filteredProducts.filter(p => p.price >= min && p.price <= max);

    document.querySelector('.leftMenuNavTwo').classList.remove('toggelMenuTwo');
    document.querySelector('.overlay').classList.remove('navTwoActionMenubar');

    currentPage = 1;
    displayProductsList(priceFiltered, currentPage);
    setupPagination(priceFiltered);
}
function handlePriceFilterInput() {
    const min = parseFloat(document.getElementById("minPrice").value) || 0;
    const max = parseFloat(document.getElementById("maxPrice").value) || Infinity;

    const priceFiltered = filteredProducts.filter(p => p.price >= min && p.price <= max);

    currentPage = 1;
    displayProductsList(priceFiltered, currentPage);
    setupPagination(priceFiltered);
}
if(!productsContainer){
    console.warn("Cart page element not found!");
}else{
    document.getElementById("applyPriceFilter").addEventListener("click", handlePriceFilter);
    document.getElementById("minPrice").addEventListener("input", handlePriceFilterInput);
    document.getElementById("maxPrice").addEventListener("input", handlePriceFilterInput);

    document.querySelector('.searchIcon').addEventListener('click', handleSearch);

    document.getElementById('searchInput').addEventListener('input', handleSearch);

    document.getElementById('categorySelect').addEventListener('change', handleSearch);
}




loadCart();
fetchProducts();


        function checkLogin(required = false) {
        auth.onAuthStateChanged((user) => {
            if (required && !user) {
                alert("Please login first");
                window.location.href = "Login.html";
            }
        });
        }

        window.onload = function () {
        const path = window.location.pathname;

        if (path.includes("Checkout.html")) {
            checkLogin(true);
        }
        };


        function loadCheckout() {
            const checkoutDiv = document.getElementById("checkoutProducts");
            const totalPriceEl = document.getElementById("totalPrice");

            const saved = localStorage.getItem("cart");
            if (!saved) {
                checkoutDiv.innerHTML = "<p>Cart is empty.</p>";
                return;
            }

            const cart = JSON.parse(saved);
            let total = 0;

            cart.forEach(item => {
                const div = document.createElement("div");
                div.classList.add("checkout-item");
                div.innerHTML = `
                <h4>${item.title}</h4>
                <p>Price: $${item.price} × ${item.qty}</p>
                <p>Subtotal: $${(item.price * item.qty).toFixed(2)}</p>
                `;
                checkoutDiv.appendChild(div);

                total += item.price * item.qty;
            });

            totalPriceEl.textContent = `Total: $${total.toFixed(2)}`;
        }

        if (window.location.pathname.includes("Checkout.html")) {
            loadCheckout();
        }

        // Function to handle checkout completion
        function handleCheckoutComplete() {
            // Clear cart from localStorage
            localStorage.removeItem("cart");
            
            // Reset cart array
            cart = [];
            
            // Update all cart count displays
            updateCartCount();
            
            // If on cart page, refresh display
            if (cartPage) {
                displayCart();
            }
        }











