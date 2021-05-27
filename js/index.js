const menu = document.querySelector(".menu");
const navOpen = document.querySelector(".hamburger");
const navClose = document.querySelector(".close");

const navLeft = menu.getBoundingClientRect().left;
navOpen.addEventListener("click", () => {
  if (navLeft < 0) {
    menu.classList.add("show");
    document.body.classList.add("show");
    navBar.classList.add("show");
  }
});

navClose.addEventListener("click", () => {
  if (navLeft < 0) {
    menu.classList.remove("show");
    document.body.classList.remove("show");
    navBar.classList.remove("show");
  }
});

// Fixed Nav
const navBar = document.querySelector(".nav");
const navHeight = navBar.getBoundingClientRect().height;
window.addEventListener("scroll", () => {
  const scrollHeight = window.pageYOffset;
  if (scrollHeight > navHeight) {
    navBar.classList.add("fix-nav");
  } else {
    navBar.classList.remove("fix-nav");
  }
});

// Scroll To
const links = [...document.querySelectorAll(".scroll-link")];
links.map(link => {
  if (!link) return;
  link.addEventListener("click", e => {
    e.preventDefault();

    const id = e.target.getAttribute("href").slice(1);

    const element = document.getElementById(id);
    const fixNav = navBar.classList.contains("fix-nav");
    let position = element.offsetTop - navHeight;

    window.scrollTo({
      top: position,
      left: 0,
    });

    navBar.classList.remove("show");
    menu.classList.remove("show");
    document.body.classList.remove("show");
  });
});

gsap.from(".logo", { opacity: 0, duration: 1, delay: 0.5, y: -10 });
gsap.from(".hamburger", { opacity: 0, duration: 1, delay: 1, x: 20 });
gsap.from(".hero-img", { opacity: 0, duration: 1, delay: 1.5, x: -200 });
gsap.from(".hero-content h2", { opacity: 0, duration: 1, delay: 2, y: -50 });
gsap.from(".hero-content h1", { opacity: 0, duration: 1, delay: 2.5, y: -45 });
gsap.from(".hero-content a", { opacity: 0, duration: 1, delay: 3.5, y: 50 });

// Them, bot, xoa san pham
const cartDOM = document.querySelector(".cart_items");
const addToCartBtn = document.querySelectorAll(".btn__add__to__cart");
const cartCounter = document.querySelector(".cart_counter");
const totalCost = document.querySelector(".total_cost");
const totalCount = document.querySelector("#total_counter");
const checkOutBtn = document.querySelector(".check_out_btn");

// assign all values from local stoarge
let cartItems = (JSON.parse(localStorage.getItem("cart_items")) || []);


document.addEventListener("DOMContentLoaded", loadData);


checkOutBtn.addEventListener("click", () =>  {
    // alert("Your Order Sent Succesfully");
    //clearCartItems();
    checkout();
})

cartCounter.addEventListener("click", () => {
    cartDOM.classList.toggle("active");
})

addToCartBtn.forEach(btn => {

    btn.addEventListener("click", () => {
        let parentElement = btn.parentElement;

        const product = {
            id: parentElement.querySelector("#product_id").value,
            name: parentElement.querySelector(".product__name").innerText,
            image: parentElement.querySelector("#image").getAttribute("src"),
            price: parentElement.querySelector(".product__price").innerText.replace("$", ""),
            quantity: 1
        }

        let isIncart = cartItems.filter(item => item.id === product.id).length > 0;

        // check if alreday Exists
        if (!isIncart) {
            addItemToTheDOM(product);
        } else {
            alert("Product Already in the Cart");
            return;
        }

        const cartDOMItems = document.querySelectorAll(".cart_item");

        cartDOMItems.forEach(individualItem => {
            if (individualItem.querySelector("#product_id").value === product.id) {
                // increrase
                increaseItem(individualItem,product);
                // decrease
                decreaseItem(individualItem,product);
                // Removing Element
                removeItem(individualItem,product);
                
            }
        })

        cartItems.push(product);
        calculateTotal();
        saveToLocalStorage();
    });

})

function loadData() {
    if(cartItems.length > 0 ){
        cartItems.forEach( product => {
            addItemToTheDOM(product);
    
            const cartDOMItems = document.querySelectorAll(".cart_item");
    
            cartDOMItems.forEach(individualItem => {
                if (individualItem.querySelector("#product_id").value === product.id) {
                    // increrase
                    increaseItem(individualItem,product);
                    // decrease
                    decreaseItem(individualItem,product);
                    // Removing Element
                    removeItem(individualItem,product);
                   
                }
            });
        });
        calculateTotal();
    }
}

function calculateTotal() {
    let total = 0;
    cartItems.forEach( item => {
        total += item.quantity * item.price;
    });
    totalCost.innerText= total;
    totalCount.innerText = cartItems.length;

}

function saveToLocalStorage(){

    localStorage.setItem("cart_items", JSON.stringify(cartItems));

}
function clearCartItems(){

    localStorage.clear();
    cartItems = [];

    document.querySelectorAll(".cart_items").forEach( item => {

        item.querySelectorAll(".cart_item").forEach( node =>{
            node.remove();
        });

    });
    cartDOM.classList.toggle("active");
    calculateTotal();
    

}

function addItemToTheDOM(product){
    // Adding the new Item to the Dom
    cartDOM.insertAdjacentHTML("afterbegin", 
    `<div class="cart_item">
            <input type="hidden" id="product_id" value="${product.id}">
           <img id="product_image" src="${product.image}" alt="" srcset="">
           <h4 class="product__name">${product.name}</h4>
           <a class="btn__small" action="decrease">&minus;</a>
           <h4 class="product__quantity">${product.quantity}</h4>
           <a class="btn__small" action="increase">&plus;</a>
          <span id="product__price">${product.price}</span>
           <a class="btn__small btn_remove" action="remove">&times;</a>
       </div>`);
}

function increaseItem(individualItem, product){

    individualItem.querySelector("[action='increase']").addEventListener('click', () => {
        // Actual Array
        cartItems.forEach(cartItem => {
            if (cartItem.id === product.id) {
                individualItem.querySelector(".product__quantity").innerText = ++cartItem.quantity;
                calculateTotal();     
                saveToLocalStorage();   
            }
        })
    });

}

function decreaseItem(individualItem,product){

    individualItem.querySelector("[action='decrease']").addEventListener('click', () => {
        // all cart items in the dom
        cartItems.forEach(cartItem => {
            // Actual Array
            if (cartItem.id === product.id) {
                if (cartItem.quantity > 1) {
                    individualItem.querySelector(".product__quantity").innerText = --cartItem.quantity;
                    calculateTotal();
                    saveToLocalStorage();
                } else {
                    // removing this element and assign the new elemntos to the old of the array
                    console.log(cartItems);

                    cartItems = cartItems.filter(newElements => newElements.id !== product.id);
                    individualItem.remove();

                    calculateTotal();
                    saveToLocalStorage();

                }

            }
        })
    });
}

function removeItem(individualItem, product){

    individualItem.querySelector("[action='remove']").addEventListener('click', () => {
        cartItems.forEach(cartItem => {
            if (cartItem.id === product.id) {
                cartItems = cartItems.filter(newElements => newElements.id !== product.id);
                individualItem.remove();
                calculateTotal();
                saveToLocalStorage();
            }
        })
    });
}

function checkout() {
    let paypalFormHTML = `
     <form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
        <input type="hidden" name="business" value="xxmyemailaddressxx">
        <input type="hidden" name="cmd" value="_xclick">
        <input type="hidden" name="item_name" value="Registration Fee">
        <input type="hidden" name="item_number" value="7757">
        <input type="hidden" name="tax_rate" value="13">
        <input type="hidden" name="tax" id="tax" value="0.33">
        <input type="hidden" name="amount" id="amount" value="2.50">
        <input type="hidden" name="currency_code" value="CAD">
        <input type="hidden" name="cancel_return" value="">
        <input type="hidden" name="return" value="">
        <input type="hidden" name="notify_url" value="">
        <input type="hidden" name="charset" value="utf-8">
    </form>
  `;

  cartItems.forEach((cartItem, index) => {
    ++index;
    paypalFormHTML += `
      <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
      <input type="hidden" name="amount_${index}" value="${cartItem.price}">
      <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">
    `;
  });

  paypalFormHTML += `
      <input type="submit" value="PayPal">
    </form>
    <div class="overlay"></div>
  `;

  document.querySelector('body').insertAdjacentHTML('beforeend', paypalFormHTML);
  document.getElementById('paypal-form').submit();
}

// paypal
// function checkout() {
//     let paypalFormHTML = `
//       <form id="paypal-form" action="https://www.paypal.com/cgi-bin/webscr" method="post">
//         <input type="hidden" name="cmd" value="_cart">
//         <input type="hidden" name="upload" value="1">
//         <input type="hidden" name="business" value="adrian@webdev.tube">
//     `;
  
//     cartItems.forEach((cartItem, index) => {
//       ++index;
//       paypalFormHTML += `
//         <input type="hidden" name="item_name_${index}" value="${cartItem.name}">
//         <input type="hidden" name="amount_${index}" value="${cartItem.price}">
//         <input type="hidden" name="quantity_${index}" value="${cartItem.quantity}">
//       `;
//     });
  
//     paypalFormHTML += `
//         <input type="submit" value="PayPal">
//       </form>
//       <div class="overlay"></div>
//     `;
  
//     document.querySelector('body').insertAdjacentHTML('beforeend', paypalFormHTML);
//     document.getElementById('paypal-form').submit();
//   }
//   function countCartTotal() {
//     let cartTotal = 0;
//     cart.forEach(cartItem => cartTotal += cartItem.quantity * cartItem.price);
//     document.querySelector('[data-action="CHECKOUT"]').innerText = `Pay $${cartTotal}`;
//   }
//   const cartDOM = document.querySelector('.cart');

//   function addCartFooter() {
//     if (document.querySelector('.cart-footer') === null) {
//       cartDOM.insertAdjacentHTML('afterend', `
//         <div class="cart-footer">
//           <button class="btn btn--danger" data-action="CLEAR_CART">Clear Cart</button>
//           <button class="btn btn--primary" data-action="CHECKOUT">Pay</button>
//         </div>
//       `);
  
//       document.querySelector('[data-action="CLEAR_CART"]').addEventListener('click', () => clearCart());
//       document.querySelector('[data-action="CHECKOUT"]').addEventListener('click', () => checkout());
//     }
//   }
