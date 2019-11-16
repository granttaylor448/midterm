// $(() => {
// $.ajax({
// method: "GET",
// url: "/api/users"
// }).done((users) => {
// for (user of users) {
// $("<div>").text(user.name).appendTo($("body"));
// }
// });;
// });

const createMenu = function (menu) {
  return (
    ` <div class="card menu-items__card p-3 mb-3">

        <div class="card-header menu-title-price">
          ${menu.name}
          <div class="menu-price">
            <h5>${menu.price}</h5>
          </div>
        </div>

        <div class="menu-items__flex">
          <img class="menu-image inline" src="${menu.photo}" alt="fried_rice">
          <div class="card-body inline">
            <p class="card-text text-justify">${menu.description}</p>
          </div>

          <div class="qty">
            <span class="minus bg-danger">-</span>
            <input type="number" class="count" name="qty" value="0">
            <span class="plus bg-danger">+</span>
          </div>
        </div>
      </div>`
  )
}

const renderMenu = function (menuElements) {
  const menuContainer = $('#menu-items');
  menuElements.forEach((menu) => {
    menuContainer.append(createMenu(menu))
  })
}

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/menu"
  }).done((response) => {
    //console.log(response.menu);
    renderMenu(response.menu);
  })

});


$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((response) => {
    //console.log(response.menu);
    console.log(response.rows);
    response.rows;
  })

});


