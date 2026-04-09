
// ELEMENTOS
const menuLanches = document.getElementById("menu-lanches")
const menuBebidas = document.getElementById("menu-bebidas")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")

// ENTREGA
const deliveryRadios = document.querySelectorAll('input[name="delivery"]')

// MODAL PRODUTO
const productModal = document.getElementById("product-modal")
const closeProductModal = document.getElementById("close-product-modal")
const confirmBtn = document.getElementById("add-product-confirm")
const observationInput = document.getElementById("modal-observation")
const modalProductName = document.getElementById("modal-product-name")

let cart = JSON.parse(localStorage.getItem("cart")) || []
let selectedProduct = null

// SALVAR
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart))
}

// ENTREGA
function getDeliveryFee() {
    const selected = document.querySelector('input[name="delivery"]:checked')
    if (!selected) return 0
    return selected.value === "entrega" ? 7 : 0
}

// ABRIR CARRINHO
cartBtn.addEventListener("click", () => {
    updateCartModal()
    cartModal.classList.remove("hidden")
    cartModal.classList.add("flex")
})

// FECHAR CARRINHO
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal || event.target === closeModalBtn) {
        cartModal.classList.add("hidden")
        cartModal.classList.remove("flex")
    }
})

// CLICK NOS PRODUTOS
function handleMenuClick(event) {
    const button = event.target.closest(".add-to-cart-btn")

    if (button) {
        selectedProduct = {
            name: button.getAttribute("data-name"),
            price: parseFloat(button.getAttribute("data-price"))
        }

        modalProductName.textContent = selectedProduct.name
        productModal.classList.remove("hidden")
        productModal.classList.add("flex")
    }
}

menuLanches.addEventListener("click", handleMenuClick)
menuBebidas.addEventListener("click", handleMenuClick)

// FECHAR MODAL PRODUTO
productModal.addEventListener("click", (event) => {
    if (event.target === productModal || event.target === closeProductModal) {
        productModal.classList.add("hidden")
        productModal.classList.remove("flex")
    }
})

// CONFIRMAR PRODUTO
confirmBtn.addEventListener("click", () => {

    if (!selectedProduct) return

    addToCart(
        selectedProduct.name,
        selectedProduct.price,
        observationInput.value.trim()
    )

    observationInput.value = ""
    productModal.classList.add("hidden")
    productModal.classList.remove("flex")
})

// ADICIONAR AO CARRINHO
function addToCart(name, price, observation = "") {
    const item = cart.find(i => i.name === name && i.observation === observation)

    if (item) {
        item.quantity++
    } else {
        cart.push({ name, price, quantity: 1, observation })
    }

    saveCart()
    updateCartModal()
}

// ATUALIZAR CARRINHO
function updateCartModal() {
    cartItemsContainer.innerHTML = ""
    let subtotal = 0

    cart.forEach(item => {
        const div = document.createElement("div")

        div.className = "flex justify-between mb-3"

        div.innerHTML = `
            <div>
                <p class="font-bold">${item.name}</p>
                ${item.observation ? `<p class="text-xs text-gray-500">📝 ${item.observation}</p>` : ""}

                <div class="flex items-center gap-2 mt-1">
                    <button class="decrease-btn bg-gray-200 px-2 rounded"
                        data-name="${item.name}" data-obs="${item.observation}">-</button>

                    <span>${item.quantity}</span>

                    <button class="increase-btn bg-gray-200 px-2 rounded"
                        data-name="${item.name}" data-obs="${item.observation}">+</button>
                </div>
            </div>

            <div>
                R$ ${(item.price * item.quantity).toFixed(2)}
            </div>
        `

        subtotal += item.price * item.quantity
        cartItemsContainer.appendChild(div)
    })

    const deliveryFee = getDeliveryFee()
    const total = subtotal + deliveryFee

    cartTotal.textContent = `R$ ${total.toFixed(2)}`

    const totalItens = cart.reduce((acc, item) => acc + item.quantity, 0)
    cartCounter.textContent = totalItens
}

// BOTÕES + E -
cartItemsContainer.addEventListener("click", (event) => {
    const name = event.target.getAttribute("data-name")
    const obs = event.target.getAttribute("data-obs")

    if (event.target.classList.contains("increase-btn")) {
        const index = cart.findIndex(i => i.name === name && i.observation === obs)
        if (index !== -1) cart[index].quantity++
    }

    if (event.target.classList.contains("decrease-btn")) {
        const index = cart.findIndex(i => i.name === name && i.observation === obs)

        if (index !== -1) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--
            } else {
                cart.splice(index, 1)
            }
        }
    }

    saveCart()
    updateCartModal()
})

// ALTERAR ENTREGA
deliveryRadios.forEach(radio => {
    radio.addEventListener("change", updateCartModal)
})

// FINALIZAR PEDIDO (WHATSAPP)
checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Carrinho vazio!")
        return
    }

    const deliveryFee = getDeliveryFee()

    const itens = cart.map(item =>
        `${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}`
        + (item.observation ? `\n📝 Obs: ${item.observation}` : "")
    ).join("\n\n")

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const total = subtotal + deliveryFee

    const mensagem = `🛒 Pedido - Marinho Burguer

${itens}

Subtotal: R$ ${subtotal.toFixed(2)}
Entrega: R$ ${deliveryFee.toFixed(2)}
Total: R$ ${total.toFixed(2)}`

    const telefone = "55051995647404"

    window.open(`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`, "_blank")

    cart = []
    saveCart()
    updateCartModal()

    cartModal.classList.add("hidden")
    cartModal.classList.remove("flex")
})

// 🔐 ACESSO ADMIN
let clickCount = 0
const logo = document.getElementById("logo")

logo.addEventListener("click", () => {
    clickCount++

    if (clickCount === 5) {
        const senha = prompt("Digite a senha de admin:")

        if (senha === "1234") {
            window.location.href = "admin.html"
        } else {
            alert("Senha incorreta!")
        }

        clickCount = 0
    }
})

// INICIAR
updateCartModal()