const itens = document.querySelectorAll(".item")

itens.forEach(item => {
item.addEventListener("click", () => {
alert("Você clicou em " + item.innerText)
})
})